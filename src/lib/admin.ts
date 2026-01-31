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

    // This is approximate, real apps might use count aggregation queries
    const { count: usersCount } = await supabase.from('lesson_progress').select('*', { count: 'exact', head: true }) // Using lesson_progress as proxy for activity? No, let's use listUsers for users
    // Actually listUsers is admin only and pagination limits apply. For stats, better to query a public profiles table if it existed.
    // We will stick to what we can access.

    // Courses
    const { count: coursesCount } = await supabase.from('courses').select('*', { count: 'exact', head: true })

    // Submissions
    const { count: submissionsCount } = await supabase.from('lesson_progress').select('*', { count: 'exact', head: true }).not('project_repo_link', 'is', null)

    return {
        totalCourses: coursesCount || 0,
        totalSubmissions: submissionsCount || 0
    }
}

// --- Course Management ---

export async function createCourse(data: { title: string, description: string, price: number, image_url: string }) {
    if (!await isAdmin()) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { error } = await supabase.from('courses').insert(data)
    if (error) throw new Error(error.message)
    revalidatePath('/admin/courses')
    revalidatePath('/courses')
}

export async function updateCourse(id: string, data: Partial<Course>) {
    if (!await isAdmin()) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { error } = await supabase.from('courses').update(data).eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/admin/courses')
    revalidatePath(`/courses/${id}`)
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
    if (!await isAdmin()) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { error } = await supabase.from('lessons').insert(data)
    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${data.course_id}/lessons`)
    revalidatePath(`/courses/${data.course_id}/lessons`)
}

export async function updateLesson(id: string, data: Partial<Lesson>) {
    if (!await isAdmin()) throw new Error('Unauthorized')
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
    if (!await isAdmin()) throw new Error('Unauthorized')
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
    if (!await isAdmin()) throw new Error('Unauthorized')
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
    if (!await isAdmin()) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { data: q } = await supabase.from('questions').select('lesson_id').eq('id', id).single()
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
    if (!await isAdmin()) throw new Error('Unauthorized')
    const supabase = await createClient()
    const { data: q } = await supabase.from('questions').select('lesson_id').eq('id', id).single()
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
    if (!await isAdmin()) throw new Error('Unauthorized')
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
    if (!await isAdmin()) throw new Error('Unauthorized')
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
