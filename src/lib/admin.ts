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
    const { data: lesson } = await supabase.from('lessons').select('course_id').eq('id', lessonId).single()
    if (!lesson) return false
    return isAuthorizedForCourse(lesson.course_id)
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
    const { error } = await supabase.from('lessons').insert(data)
    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${data.course_id}/lessons`)
    revalidatePath(`/courses/${data.course_id}/lessons`)
}

export async function updateLesson(id: string, data: Partial<Lesson>) {
    if (!await isAuthorizedForLesson(id)) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { data: lesson } = await supabase.from('lessons').select('course_id').eq('id', id).single()
    const { error } = await supabase.from('lessons').update(data).eq('id', id)
    if (error) throw new Error(error.message)
    if (lesson) {
        revalidatePath(`/admin/courses/${lesson.course_id}/lessons`)
        revalidatePath(`/courses/${lesson.course_id}/lessons`)
    }
}

export async function deleteLesson(id: string) {
    if (!await isAuthorizedForLesson(id)) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { data: lesson } = await supabase.from('lessons').select('course_id').eq('id', id).single()
    const { error } = await supabase.from('lessons').delete().eq('id', id)
    if (error) throw new Error(error.message)
    if (lesson) {
        revalidatePath(`/admin/courses/${lesson.course_id}/lessons`)
        revalidatePath(`/courses/${lesson.course_id}/lessons`)
    }
}

// --- Quiz Management ---

export async function createQuestion(data: { lesson_id: string, question_text: string, options: string[], correct_answer: number }) {
    if (!await isAuthorizedForLesson(data.lesson_id)) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { error } = await supabase.from('questions').insert(data)
    if (error) throw new Error(error.message)

    // Fetch course_id to revalidate
    const { data: lesson } = await supabase.from('lessons').select('course_id').eq('id', data.lesson_id).single()
    if (lesson) {
        revalidatePath(`/admin/courses/${lesson.course_id}/lessons`)
        revalidatePath(`/courses/${lesson.course_id}/lessons`)
        revalidatePath(`/courses/${lesson.course_id}/lessons/${data.lesson_id}`)
    }
}

export async function updateQuestion(id: string, data: Partial<Question>) {
    const supabase = await createClient()
    const { data: q } = await supabase.from('questions').select('lesson_id').eq('id', id).single()
    if (!q || !await isAuthorizedForLesson(q.lesson_id)) throw new Error('Unauthorized')
    const { error } = await supabase.from('questions').update(data).eq('id', id)
    if (error) throw new Error(error.message)

    if (q) {
        const { data: lesson } = await supabase.from('lessons').select('course_id').eq('id', q.lesson_id).single()
        if (lesson) {
            revalidatePath(`/admin/courses/${lesson.course_id}/lessons`)
            revalidatePath(`/courses/${lesson.course_id}/lessons`)
            revalidatePath(`/courses/${lesson.course_id}/lessons/${q.lesson_id}`)
        }
    }
}

export async function deleteQuestion(id: string) {
    const supabase = await createClient()
    const { data: q } = await supabase.from('questions').select('lesson_id').eq('id', id).single()
    if (!q || !await isAuthorizedForLesson(q.lesson_id)) throw new Error('Unauthorized')
    const { error } = await supabase.from('questions').delete().eq('id', id)
    if (error) throw new Error(error.message)

    if (q) {
        const { data: lesson } = await supabase.from('lessons').select('course_id').eq('id', q.lesson_id).single()
        if (lesson) {
            revalidatePath(`/admin/courses/${lesson.course_id}/lessons`)
            revalidatePath(`/courses/${lesson.course_id}/lessons`)
            revalidatePath(`/courses/${lesson.course_id}/lessons/${q.lesson_id}`)
        }
    }
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

    const { data: lesson } = await supabase.from('lessons').select('course_id').eq('id', lessonId).single()
    if (lesson) {
        revalidatePath(`/admin/courses/${lesson.course_id}/lessons`)
        revalidatePath(`/courses/${lesson.course_id}/lessons`)
        revalidatePath(`/courses/${lesson.course_id}/lessons/${lessonId}`)
    }
}

export async function deleteAllQuestions(lessonId: string) {
    if (!await isAuthorizedForLesson(lessonId)) throw new Error('Unauthorized')
    const supabase = await createClient()

    const { error } = await supabase.from('questions').delete().eq('lesson_id', lessonId)
    if (error) throw new Error(error.message)

    const { data: lesson } = await supabase.from('lessons').select('course_id').eq('id', lessonId).single()
    if (lesson) {
        revalidatePath(`/admin/courses/${lesson.course_id}/lessons`)
        revalidatePath(`/courses/${lesson.course_id}/lessons`)
        revalidatePath(`/courses/${lesson.course_id}/lessons/${lessonId}`)
    }
}
