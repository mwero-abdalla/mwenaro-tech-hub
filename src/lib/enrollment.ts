'use server'

import { createClient } from './supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Course } from './courses'

export async function enrollUser(courseId: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { error } = await supabase
        .from('enrollments')
        .insert({
            user_id: user.id,
            course_id: courseId,
        })

    if (error) {
        console.error('Error enrolling user:', error)
        throw new Error('Failed to enroll in course')
    }

    revalidatePath(`/courses/${courseId}`)
    revalidatePath('/dashboard')
    redirect('/dashboard')
}

export async function hasEnrolled(courseId: string): Promise<boolean> {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return false
    }

    const { data, error } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Relation not found" or "No rows found" depending on context, usually no rows for single()
        // actually for .single(), if no row is found it returns an error.
        return false
    }

    return !!data
}

export async function getEnrolledCourses(): Promise<Course[]> {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('enrollments')
        .select(`
            course_id,
            courses (*)
        `)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error fetching enrolled courses:', error)
        return []
    }

    // Map the result to return just the course objects
    return data.map((enrollment: any) => enrollment.courses) as Course[]
}
