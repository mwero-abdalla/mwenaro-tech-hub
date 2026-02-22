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

    // Check if the user is authorized for ANY course that includes this lesson
    const { data: cls } = await supabase.from('course_lessons').select('course_id').eq('lesson_id', lessonId)
    if (!cls) return false

    for (const cl of cls) {
        if (await isAuthorizedForCourse(cl.course_id)) return true
    }
    return false
}

async function revalidateLessonPaths(supabase: any, lessonId: string) {
    const { data: cls } = await supabase.from('course_lessons').select('course_id').eq('lesson_id', lessonId)
    if (cls) {
        cls.forEach((cl: any) => {
            revalidatePath(`/admin/courses/${cl.course_id}/lessons`)
            revalidatePath(`/courses/${cl.course_id}/lessons`)
            revalidatePath(`/courses/${cl.course_id}/lessons/${lessonId}`)
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

export async function createLesson(data: { course_id: string, title: string, content: string, video_url?: string, order_index: number, has_project: boolean }) {
    if (!await isAuthorizedForCourse(data.course_id)) throw new Error('Unauthorized')
    const supabase = await createClient()

    // Insert into lessons table
    const { data: lesson, error } = await supabase.from('lessons').insert({
        title: data.title,
        content: data.content,
        video_url: data.video_url,
        has_project: data.has_project
    }).select().single()

    if (error) throw new Error(error.message)

    // Link it to the current course
    const { error: joinError } = await supabase.from('course_lessons').insert({
        course_id: data.course_id,
        lesson_id: lesson.id,
        order_index: data.order_index
    })

    if (joinError) throw new Error(joinError.message)

    revalidatePath(`/admin/courses/${data.course_id}/lessons`)
    revalidatePath(`/courses/${data.course_id}/lessons`)
}

export async function assignSharedLesson(courseId: string, lessonId: string, orderIndex: number) {
    if (!await isAuthorizedForCourse(courseId)) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { error } = await supabase.from('course_lessons').insert({
        course_id: courseId,
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

    const { course_id, order_index, ...lessonData } = data as any;

    // Update core lesson content if any provided
    if (Object.keys(lessonData).length > 0) {
        const { error } = await supabase.from('lessons').update(lessonData).eq('id', id)
        if (error) throw new Error(error.message)
    }

    // Update the position within the specific course if provided
    if (course_id && order_index !== undefined) {
        await supabase.from('course_lessons').update({ order_index }).eq('course_id', course_id).eq('lesson_id', id)
    }

    await revalidateLessonPaths(supabase, id)
}

export async function updateLessonOrder(courseId: string, lessonId: string, newOrderIndex: number) {
    if (!await isAuthorizedForCourse(courseId)) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { error } = await supabase.from('course_lessons').update({ order_index: newOrderIndex }).eq('course_id', courseId).eq('lesson_id', lessonId)
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

export async function removeLessonFromCourse(courseId: string, lessonId: string) {
    if (!await isAuthorizedForCourse(courseId)) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { error } = await supabase.from('course_lessons').delete().eq('course_id', courseId).eq('lesson_id', lessonId)
    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${courseId}/lessons`)
    revalidatePath(`/courses/${courseId}/lessons`)
}

// --- Quiz Management ---

export async function createQuestion(data: { lesson_id: string, question_text: string, options: string[], correct_answer: number }) {
    if (!await isAuthorizedForLesson(data.lesson_id)) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { error } = await supabase.from('questions').insert(data)
    if (error) throw new Error(error.message)

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

    const { error } = await supabase.from('questions').insert(data)
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
