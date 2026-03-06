'use server'

import { createClient } from './supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Course } from './courses'

export async function enrollUser(courseId: string, paymentIdOrFormData?: string | FormData): Promise<void> {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        if (typeof paymentIdOrFormData !== 'string') {
            redirect('/login')
        }
        return
    }

    const paymentId = typeof paymentIdOrFormData === 'string' ? paymentIdOrFormData : undefined

    // Check if already enrolled
    const isEnrolled = await hasEnrolled(courseId)
    if (isEnrolled) {
        if (typeof paymentIdOrFormData !== 'string') {
            redirect('/dashboard')
        }
        return
    }

    const { data: course } = await supabase.from('courses').select('price').eq('id', courseId).single()
    const isFree = course && course.price === 0
    const initialStatus = isFree ? 'active' : 'pending'

    const { error } = await supabase
        .from('enrollments')
        .insert({
            user_id: user.id,
            course_id: courseId,
            status: initialStatus
        })

    if (error) {
        console.error('Error enrolling user:', error)
        if (typeof paymentIdOrFormData === 'string') {
            throw new Error('Failed to enroll student')
        }
        return
    }

    revalidatePath(`/courses/${courseId}`)
    revalidatePath('/dashboard')

    if (typeof paymentIdOrFormData !== 'string') {
        if (isFree) {
            redirect('/dashboard')
        } else {
            redirect(`/checkout/${courseId}`)
        }
    }
}

export async function hasEnrolled(courseId: string, onlyActive: boolean = true): Promise<boolean> {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return false
    }

    const { data: enrollment, error } = await supabase
        .from('enrollments')
        .select('course_id, status, access_until')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single()

    if (error || !enrollment) {
        return false
    }

    // Check if actively enrolled
    if (enrollment.status === 'active') {
        return true
    }

    // Check if temporary access is granted and not expired
    if (enrollment.access_until) {
        const now = new Date()
        const accessUntil = new Date(enrollment.access_until)
        if (accessUntil > now) {
            return true
        }
    }

    return false
}

export async function getEnrollmentStatus(courseId: string): Promise<{ status: string, accessUntil: string | null } | null> {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data } = await supabase
        .from('enrollments')
        .select('status, access_until')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single()

    if (!data) return null
    return {
        status: data.status,
        accessUntil: data.access_until
    }
}

export async function grantTemporaryAccess(studentId: string, courseId: string, untilDate: string): Promise<void> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user?.user_metadata?.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required')
    }

    // Upsert avoids duplicate enrollments if student already has one
    const { error } = await supabase
        .from('enrollments')
        .upsert({
            user_id: studentId,
            course_id: courseId,
            access_until: untilDate,
            status: 'pending' // Keep pending if not paid, but access_until grants bypass
        }, { onConflict: 'user_id,course_id' })

    if (error) throw new Error(error.message)

    revalidatePath(`/courses/${courseId}`)
    revalidatePath('/dashboard')
    revalidatePath('/admin/users')
}

export async function getEnrolledCourses(onlyActive: boolean = true): Promise<Course[]> {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    // Fetch ALL enrollments for this user including pending (for temp-access learners)
    const { data, error } = await supabase
        .from('enrollments')
        .select(`
            course_id,
            status,
            access_until,
            courses (*)
        `)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error fetching enrolled courses:', error)
        return []
    }

    const now = new Date()

    // Filter in-code to support both 'active' (paid) and valid temporary access (access_until in future)
    const validEnrollments = onlyActive
        ? data.filter((enrollment: any) => {
            const isActive = enrollment.status === 'active'
            const hasTempAccess = enrollment.access_until && new Date(enrollment.access_until) > now
            return isActive || hasTempAccess
        })
        : data

    return validEnrollments
        .map((enrollment: any) => enrollment.courses)
        .filter(Boolean) as Course[]
}
