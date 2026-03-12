'use server'

import { createClient } from './supabase/server'
import { createAdminClient } from './supabase/admin'
import { revalidatePath } from 'next/cache'
import { Course } from './courses'
import { Lesson, Question } from './lessons'

export interface User {
    id: string
    email: string
    role: string
    created_at: string
}

export async function isAdmin(): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false
    return user.user_metadata?.role === 'admin'
}

export async function isAuthorizedForCourse(courseId: string): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    if (user.user_metadata?.role === 'admin') return true
    if (user.user_metadata?.role !== 'instructor') return false

    const { data: course } = await supabase.from('courses').select('instructor_id').eq('id', courseId).single()
    return course?.instructor_id === user.id
}

export async function isAuthorizedForLesson(lessonId: string): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    if (user.user_metadata?.role === 'admin') return true

    // Check if the user is authorized for ANY course that includes this lesson through its phase
    const { data: pls } = await supabase.from('phase_lessons').select('phases(course_id)').eq('lesson_id', lessonId)
    if (!pls) return false

    for (const pl of pls) {
        const courseId = (pl.phases as any)?.course_id
        if (courseId && await isAuthorizedForCourse(courseId)) return true
    }
    return false
}

async function revalidateLessonPaths(supabase: any, lessonId: string) {
    const { data: pls } = await supabase.from('phase_lessons').select('phases(course_id)').eq('lesson_id', lessonId)
    if (pls) {
        pls.forEach((pl: any) => {
            const courseId = (pl.phases as any)?.course_id
            if (courseId) {
                revalidatePath(`/admin/courses/${courseId}/lessons`)
                revalidatePath(`/courses/${courseId}/lessons`)
                revalidatePath(`/courses/${courseId}/lessons/${lessonId}`)
            }
        })
    }
}

export async function getAllUsers(): Promise<User[]> {
    if (!await isAdmin()) throw new Error('Unauthorized')

    const supabase = createAdminClient()
    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) throw new Error(error.message)

    return users.map(u => ({
        id: u.id,
        email: u.email || '',
        role: u.user_metadata?.role || 'student',
        created_at: u.created_at
    }))
}

export async function updateUserRole(userId: string, role: 'student' | 'instructor' | 'admin') {
    if (!await isAdmin()) throw new Error('Unauthorized')

    const supabase = createAdminClient()
    const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: { role } }
    )

    if (error) throw new Error(error.message)
    revalidatePath('/admin/users')
}

export async function getAllCourses(): Promise<Course[]> {
    if (!await isAdmin()) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('title')

    if (error) throw new Error(error.message)
    return data as Course[]
}

export async function getUserEnrollments(userId: string) {
    if (!await isAdmin()) throw new Error('Unauthorized')
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('enrollments')
        .select('*, courses(title)')
        .eq('user_id', userId)

    if (error) throw new Error(error.message)
    return data
}

export async function getDashboardStats() {
    if (!await isAdmin()) throw new Error('Unauthorized')

    const supabase = await createClient()

    // Get all users to count students and instructors
    const allUsers = await getAllUsers()
    const students = allUsers.filter(u => u.role === 'student')
    const instructors = allUsers.filter(u => u.role === 'instructor')

    // Courses
    const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })

    // Active Cohorts
    const { count: cohortsCount } = await supabase
        .from('cohorts')
        .select('*', { count: 'exact', head: true })

    // Total Enrollments
    const { count: enrollmentsCount } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })

    // Completed Lessons
    const { count: completedLessonsCount } = await supabase
        .from('lesson_progress')
        .select('*', { count: 'exact', head: true })
        .eq('is_completed', true)

    // Active Learning Streaks (streak active in last 2 days)
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    const { count: activeStreaksCount } = await supabase
        .from('learning_streaks')
        .select('*', { count: 'exact', head: true })
        .gte('last_activity_date', twoDaysAgo.toISOString().split('T')[0])
        .gt('current_streak', 0)

    // Submissions
    const { count: submissionsCount } = await supabase
        .from('lesson_progress')
        .select('*', { count: 'exact', head: true })
        .not('project_repo_link', 'is', null)

    return {
        totalStudents: students.length,
        totalInstructors: instructors.length,
        totalCourses: coursesCount || 0,
        activeCohorts: cohortsCount || 0,
        totalEnrollments: enrollmentsCount || 0,
        completedLessons: completedLessonsCount || 0,
        activeStreaks: activeStreaksCount || 0,
        totalSubmissions: submissionsCount || 0
    }
}

export async function getAnalyticsData() {
    if (!await isAdmin()) throw new Error('Unauthorized')

    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    // 1. Enrollment Growth (Last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const { data: enrollmentData } = await supabase
        .from('enrollments')
        .select('enrolled_at')
        .gte('enrolled_at', sixMonthsAgo.toISOString())

    // 2. AI Grading Audit (Recent submissions with AI feedback)
    const { data: auditLogs } = await supabase
        .from('lesson_progress')
        .select(`
            user_id,
            lesson_id,
            ai_rating,
            project_rating,
            completed_at,
            lessons(title)
        `)
        .not('ai_rating', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(10)

    // Fetch student emails and names for the audit logs
    const userIds = [...new Set((auditLogs || []).map(log => log.user_id))]
    const [{ data: profiles }, { data: authData }] = await Promise.all([
        adminSupabase.from('profiles').select('id, full_name').in('id', userIds),
        adminSupabase.auth.admin.listUsers()
    ])

    const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || [])
    const emailMap = new Map(authData?.users.map(u => [u.id, u.email]) || [])

    const formattedAuditLogs = (auditLogs || []).map(log => ({
        id: `${log.user_id}-${log.lesson_id}`,
        student: profileMap.get(log.user_id) || emailMap.get(log.user_id) || 'Unknown',
        lesson: (log.lessons as any)?.title || 'Unknown Lesson',
        ai_rating: log.ai_rating,
        adjustment: log.project_rating ? log.project_rating - (log.ai_rating || 0) : 0,
        date: log.completed_at ? new Date(log.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'
    }))

    // 3. System Stats
    // Average AI Rating
    const { data: allAiRatings } = await supabase
        .from('lesson_progress')
        .select('ai_rating')
        .not('ai_rating', 'is', null)

    const avgAiRating = allAiRatings && allAiRatings.length > 0
        ? (allAiRatings.reduce((acc, curr) => acc + (curr.ai_rating || 0), 0) / allAiRatings.length).toFixed(1)
        : '0'

    // Grading Accuracy (Submissions where AI and Instructor ratings are within 10%)
    const { data: gradedSubmissions } = await supabase
        .from('lesson_progress')
        .select('ai_rating, project_rating')
        .not('ai_rating', 'is', null)
        .not('project_rating', 'is', null)

    const accuracy = gradedSubmissions && gradedSubmissions.length > 0
        ? ((gradedSubmissions.filter(s => Math.abs((s.project_rating || 0) - (s.ai_rating || 0)) <= 10).length / gradedSubmissions.length) * 100).toFixed(1)
        : '100'

    // Additional live data
    const { count: pendingReviews } = await supabase
        .from('lesson_progress')
        .select('*', { count: 'exact', head: true })
        .not('project_repo_link', 'is', null)
        .eq('project_reviewed', false)

    return {
        enrollmentData: enrollmentData || [],
        auditLogs: formattedAuditLogs,
        stats: [
            { label: 'Avg AI Rating', value: `${avgAiRating}%`, color: 'text-blue-500', trend: '+1.2%' },
            { label: 'Grading Accuracy', value: `${accuracy}%`, color: 'text-green-500', trend: '+0.2%' },
            { label: 'Pending Reviews', value: pendingReviews || 0, color: 'text-orange-500', trend: 'Critical' },
            { label: 'Neural Uptime', value: '99.9%', color: 'text-purple-500', trend: 'Stable' },
        ]
    }
}

// --- Course Management ---

export async function createCourse(data: {
    title: string,
    description: string,
    price: number,
    image_url: string,
    instructor_id?: string,
    is_published?: boolean,
    category?: string,
    level?: string
}) {
    if (!await isAdmin()) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { error } = await supabase.from('courses').insert(data)
    if (error) throw new Error(error.message)
    revalidatePath('/admin/courses')
    revalidatePath('/courses')
}

export async function updateCourse(id: string, data: Partial<Course>) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const isAdminUser = user.user_metadata?.role === 'admin'
    const isInstructorUser = user.user_metadata?.role === 'instructor'

    if (!isAdminUser && !isInstructorUser) throw new Error('Unauthorized')

    // If instructor, verify they own the course
    if (!isAdminUser) {
        const { data: course } = await supabase.from('courses').select('instructor_id').eq('id', id).single()
        if (course?.instructor_id !== user.id) throw new Error('Unauthorized: You can only edit your own courses')
    }

    const { error } = await supabase.from('courses').update(data).eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath('/admin/courses')
    revalidatePath(`/courses/${id}`)
    revalidatePath('/instructor/dashboard')
    revalidatePath('/dashboard')
}

export async function deleteCourse(id: string) {
    if (!await isAdmin()) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { error } = await supabase.from('courses').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/admin/courses')
    revalidatePath('/courses')
}

// --- Cohort Management ---

export async function getAllCohorts() {
    if (!await isAdmin()) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('cohorts')
        .select('*, courses(title)')
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
}

export async function getInstructors() {
    if (!await isAdmin()) throw new Error('Unauthorized')
    const users = await getAllUsers()
    return users.filter(u => u.role === 'instructor')
}

export async function createCohort(data: { name: string, course_id: string, instructor_id: string }) {
    if (!await isAdmin()) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { error } = await supabase.from('cohorts').insert(data)
    if (error) throw new Error(error.message)
    revalidatePath('/admin/cohorts')
}

export async function updateCohort(id: string, data: { name?: string, instructor_id?: string }) {
    if (!await isAdmin()) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { error } = await supabase.from('cohorts').update(data).eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/admin/cohorts')
}

export async function deleteCohort(id: string) {
    if (!await isAdmin()) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { error } = await supabase.from('cohorts').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/admin/cohorts')
}

export async function assignStudentToCohort(studentId: string, courseId: string, cohortId: string) {
    if (!await isAdmin()) throw new Error('Unauthorized')
    const supabase = await createClient()

    // Check if enrollment exists
    const { data: enrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', studentId)
        .eq('course_id', courseId)
        .single()

    if (enrollment) {
        // Update
        const { error } = await supabase
            .from('enrollments')
            .update({ cohort_id: cohortId })
            .eq('user_id', studentId)
            .eq('course_id', courseId)
        if (error) throw new Error(error.message)
    } else {
        // Create new enrollment
        const { error } = await supabase
            .from('enrollments')
            .insert({ user_id: studentId, course_id: courseId, cohort_id: cohortId })
        if (error) throw new Error(error.message)
    }

    revalidatePath('/admin/cohorts')
}

// --- Lesson Management ---

export async function createLesson(data: { course_id: string, phase_id?: string, title: string, content: string, video_url?: string, order_index: number, has_project: boolean }) {
    if (!await isAuthorizedForCourse(data.course_id)) throw new Error('Unauthorized')
    const supabase = await createClient()

    let phaseId = data.phase_id
    if (!phaseId) {
        const { data: phases } = await supabase.from('phases').select('id').eq('course_id', data.course_id).order('order_index').limit(1)
        if (phases && phases.length > 0) {
            phaseId = phases[0].id
        } else {
            const { data: newPhase } = await supabase.from('phases').insert({ course_id: data.course_id, title: 'Main Content' }).select('id').single()
            phaseId = newPhase?.id
        }
    }

    // Insert into lessons table
    const { data: lesson, error } = await supabase.from('lessons').insert({
        title: data.title,
        content: data.content,
        video_url: data.video_url,
        has_project: data.has_project
    }).select().single()

    if (error) throw new Error(error.message)

    // Link it to the specific phase
    const { error: joinError } = await supabase.from('phase_lessons').insert({
        phase_id: phaseId,
        lesson_id: lesson.id,
        order_index: data.order_index
    })

    if (joinError) throw new Error(joinError.message)

    revalidatePath(`/admin/courses/${data.course_id}/lessons`)
    revalidatePath(`/courses/${data.course_id}/lessons`)
}

export async function assignSharedLesson(courseId: string, phaseId: string, lessonId: string, orderIndex: number) {
    if (!await isAuthorizedForCourse(courseId)) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { error } = await supabase.from('phase_lessons').insert({
        phase_id: phaseId,
        lesson_id: lessonId,
        order_index: orderIndex
    })
    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${courseId}/lessons`)
    revalidatePath(`/courses/${courseId}/lessons`)
}

export async function updateLesson(id: string, data: Partial<Lesson>) {
    if (!await isAuthorizedForLesson(id)) throw new Error('Unauthorized')
    const supabase = await createClient()

    const { course_id, phase_id, order_index, ...lessonData } = data as any;

    // Update core lesson content if any provided
    if (Object.keys(lessonData).length > 0) {
        const { error } = await supabase.from('lessons').update(lessonData).eq('id', id)
        if (error) throw new Error(error.message)
    }

    // Update the position within the specific phase if provided
    if (phase_id && order_index !== undefined) {
        await supabase.from('phase_lessons').update({ order_index }).eq('phase_id', phase_id).eq('lesson_id', id)
    }

    await revalidateLessonPaths(supabase, id)
}

export async function updateLessonOrder(courseId: string, phaseId: string, lessonId: string, newOrderIndex: number) {
    if (!await isAuthorizedForCourse(courseId)) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { error } = await supabase.from('phase_lessons').update({ order_index: newOrderIndex }).eq('phase_id', phaseId).eq('lesson_id', lessonId)
    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${courseId}/lessons`)
    revalidatePath(`/courses/${courseId}/lessons`)
}

export async function deleteLesson(id: string) {
    if (!await isAuthorizedForLesson(id)) throw new Error('Unauthorized')
    const supabase = await createClient()

    // Deleting the lesson will cascade and delete from course_lessons
    const { error } = await supabase.from('lessons').delete().eq('id', id)
    if (error) throw new Error(error.message)

    await revalidateLessonPaths(supabase, id)
}

export async function removeLessonFromPhase(courseId: string, phaseId: string, lessonId: string) {
    if (!await isAuthorizedForCourse(courseId)) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { error } = await supabase.from('phase_lessons').delete().eq('phase_id', phaseId).eq('lesson_id', lessonId)
    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${courseId}/lessons`)
    revalidatePath(`/courses/${courseId}/lessons`)
}

// --- Quiz Management ---

export async function createQuestion(data: { lesson_id: string, question_text: string, options: string[], correct_answer: number }) {
    if (!await isAuthorizedForLesson(data.lesson_id)) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { error } = await supabase.from('questions').insert(data)
    if (error) {
        if (error.code === '23505') {
            throw new Error('A question with this text already exists in this lesson.')
        }
        throw new Error(error.message)
    }

    await revalidateLessonPaths(supabase, data.lesson_id)
}

export async function updateQuestion(id: string, data: Partial<Question>) {
    const supabase = await createClient()
    const { data: q } = await supabase.from('questions').select('lesson_id').eq('id', id).single()
    if (!q || !await isAuthorizedForLesson(q.lesson_id)) throw new Error('Unauthorized')
    const { error } = await supabase.from('questions').update(data).eq('id', id)
    if (error) throw new Error(error.message)

    await revalidateLessonPaths(supabase, q.lesson_id)
}

export async function deleteQuestion(id: string) {
    const supabase = await createClient()
    const { data: q } = await supabase.from('questions').select('lesson_id').eq('id', id).single()
    if (!q || !await isAuthorizedForLesson(q.lesson_id)) throw new Error('Unauthorized')
    const { error } = await supabase.from('questions').delete().eq('id', id)
    if (error) throw new Error(error.message)

    await revalidateLessonPaths(supabase, q.lesson_id)
}

export async function createQuestionsBulk(lessonId: string, questions: { question_text: string, options: string[], correct_answer: number, explanation?: string }[]) {
    if (!await isAuthorizedForLesson(lessonId)) throw new Error('Unauthorized')
    const supabase = await createClient()

    const data = questions.map(q => ({
        lesson_id: lessonId,
        ...q
    }))

    const { error } = await supabase.from('questions').upsert(data, { onConflict: 'lesson_id, question_text', ignoreDuplicates: true })
    if (error) throw new Error(error.message)

    await revalidateLessonPaths(supabase, lessonId)
}

export async function deleteAllQuestions(lessonId: string) {
    if (!await isAuthorizedForLesson(lessonId)) throw new Error('Unauthorized')
    const supabase = await createClient()

    const { error } = await supabase.from('questions').delete().eq('lesson_id', lessonId)
    if (error) throw new Error(error.message)

    await revalidateLessonPaths(supabase, lessonId)
}

// --- Phase Management ---

export async function createPhase(courseId: string, title: string) {
    if (!await isAuthorizedForCourse(courseId)) throw new Error('Unauthorized')
    const supabase = await createClient()

    const { data: phases } = await supabase.from('phases').select('order_index').eq('course_id', courseId).order('order_index', { ascending: false }).limit(1)
    const nextOrderIndex = (phases && phases.length > 0) ? (phases[0].order_index || 0) + 1 : 1

    const { error } = await supabase.from('phases').insert({
        course_id: courseId,
        title,
        order_index: nextOrderIndex
    })

    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${courseId}/lessons`)
    revalidatePath(`/courses/${courseId}`)
}

export async function updatePhase(id: string, data: { title?: string, order_index?: number }) {
    const supabase = await createClient()
    const { data: phase } = await supabase.from('phases').select('course_id').eq('id', id).single()
    if (!phase || !await isAuthorizedForCourse(phase.course_id)) throw new Error('Unauthorized')

    const { error } = await supabase.from('phases').update(data).eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath(`/admin/courses/${phase.course_id}/lessons`)
    revalidatePath(`/courses/${phase.course_id}`)
}

export async function deletePhase(id: string) {
    const supabase = await createClient()
    const { data: phase } = await supabase.from('phases').select('course_id').eq('id', id).single()
    if (!phase || !await isAuthorizedForCourse(phase.course_id)) throw new Error('Unauthorized')

    // Check if phase has lessons
    const { count } = await supabase.from('phase_lessons').select('*', { count: 'exact', head: true }).eq('phase_id', id)
    if (count && count > 0) throw new Error('Cannot delete phase because it contains lessons. Move or delete them first.')

    const { error } = await supabase.from('phases').delete().eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath(`/admin/courses/${phase.course_id}/lessons`)
    revalidatePath(`/courses/${phase.course_id}`)
}

export async function reorderPhases(courseId: string, phaseIds: string[]) {
    if (!await isAuthorizedForCourse(courseId)) throw new Error('Unauthorized')
    const supabase = await createClient()

    const updates = phaseIds.map((id, index) => ({
        id,
        order_index: index + 1
    }))

    // Batch update order_index
    for (const update of updates) {
        await supabase.from('phases').update({ order_index: update.order_index }).eq('id', update.id)
    }

    revalidatePath(`/admin/courses/${courseId}/lessons`)
    revalidatePath(`/courses/${courseId}`)
}

// --- Payment Management ---

export async function recordManualPayment(data: {
    user_id: string,
    course_id: string,
    amount: number,
    currency?: string,
    provider_reference: string,
    description?: string,
    created_at?: string
}) {
    console.log('[recordManualPayment] Starting...', { user_id: data.user_id, course_id: data.course_id });
    if (!await isAdmin()) {
        console.error('[recordManualPayment] Unauthorized');
        throw new Error('Unauthorized');
    }
    const supabase = createAdminClient()

    const paymentData = {
        user_id: data.user_id,
        course_id: data.course_id,
        amount: data.amount,
        currency: data.currency || 'KES',
        status: 'paid',
        provider: 'manual',
        provider_reference: data.provider_reference,
        description: data.description || null,
        created_at: data.created_at || new Date().toISOString()
    }

    console.log('[recordManualPayment] Inserting data...', paymentData);
    const { data: result, error } = await supabase
        .from('course_payments')
        .insert(paymentData)
        .select()
        .single()

    if (error) {
        console.error('[recordManualPayment] Insert Error:', error);
        throw new Error(error.message);
    }
    
    console.log('[recordManualPayment] Insert Successful. Updating enrollment...');
    // Attempt to also grant course access if not already enrolled/active
    try {
        const { data: enrollment } = await supabase
            .from('enrollments')
            .select('*')
            .eq('user_id', data.user_id)
            .eq('course_id', data.course_id)
            .single()

        if (enrollment) {
            if (enrollment.status !== 'active') {
                await supabase.from('enrollments').update({ status: 'active' }).eq('user_id', data.user_id).eq('course_id', data.course_id)
            }
        } else {
            // Need to insert into enrollments
            await supabase.from('enrollments').insert({
                user_id: data.user_id,
                course_id: data.course_id,
                status: 'active'
            })
        }
    } catch (e) {
        console.error("[recordManualPayment] Failed to update enrollment after payment", e)
    }

    console.log('[recordManualPayment] Revalidating paths...');
    revalidatePath('/admin/dashboard/payments')
    revalidatePath('/dashboard/receipts')

    return result
}

export async function getAllPayments() {
    if (!await isAdmin()) throw new Error('Unauthorized')
    const supabase = createAdminClient()

    // 1. Fetch payments with course titles
    const { data: payments, error: pError } = await supabase
        .from('course_payments')
        .select(`
            *,
            courses:course_id (
                title
            )
        `)
        .order('created_at', { ascending: false })

    if (pError) throw new Error(pError.message)
    if (!payments || payments.length === 0) return []

    // 2. Fetch unique profiles for these payments
    const userIds = Array.from(new Set(payments.map(p => p.user_id)))
    const { data: profiles, error: prError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds)

    if (prError) {
        console.error('Error fetching profiles for payments:', prError)
        // We can still return payments without profile names if needed, but let's try to be consistent
    }

    const profileMap = new Map((profiles || []).map(p => [p.id, p]))

    // 3. Map them together
    return payments.map(p => ({
        ...p,
        profiles: profileMap.get(p.user_id) || { full_name: 'Unknown', email: null }
    }))
}

export async function deletePayment(id: string) {
    if (!await isAdmin()) throw new Error('Unauthorized')
    const supabase = createAdminClient()

    const { error } = await supabase
        .from('course_payments')
        .delete()
        .eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/admin/dashboard/payments')
    revalidatePath('/dashboard/receipts')
    return { success: true }
}

