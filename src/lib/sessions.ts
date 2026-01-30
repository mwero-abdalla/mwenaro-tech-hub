'use server'

import { createClient } from './supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notifications'
import { sendNotificationEmail } from './email'

export interface Session {
    id: string
    cohort_id: string
    title: string
    description: string | null
    start_time: string
    duration_minutes: number
    meeting_link: string | null
    created_by: string
    cohort?: {
        name: string
    }
}

export async function getInstructorSessions(): Promise<Session[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // 1. Get Instructor Cohorts
    const { data: cohorts } = await supabase
        .from('cohorts')
        .select('id, name')
        .eq('instructor_id', user.id)

    if (!cohorts || cohorts.length === 0) return []

    const cohortIds = cohorts.map(c => c.id)

    // 2. Get Sessions
    const { data, error } = await supabase
        .from('sessions')
        .select('*, cohorts(name)')
        .in('cohort_id', cohortIds)
        .order('start_time', { ascending: true })

    if (error) {
        console.error('Error fetching sessions:', error)
        return []
    }

    return data.map((s: any) => ({
        ...s,
        cohort: s.cohorts
    }))
}

export async function createSession(data: {
    cohort_id: string
    title: string
    description?: string
    start_time: string
    duration_minutes: number
    meeting_link?: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('sessions')
        .insert({
            ...data,
            created_by: user.id
        })

    if (error) {
        throw new Error(error.message)
    }

    // Notify students in the cohort
    try {
        const { data: enrollments } = await supabase
            .from('enrollments')
            .select('user_id')
            .eq('cohort_id', data.cohort_id)

        if (enrollments && enrollments.length > 0) {
            const studentIds = enrollments.map(e => e.user_id)

            for (const studentId of studentIds) {
                await createNotification({
                    user_id: studentId,
                    type: 'session',
                    title: 'New Session Scheduled',
                    content: `A new session "${data.title}" has been scheduled for ${new Date(data.start_time).toLocaleString()}.`,
                    link: '/dashboard'
                })

                // Fetch email and send
                const { data: sUser } = await supabase.auth.admin.getUserById(studentId)
                if (sUser.user?.email) {
                    await sendNotificationEmail(sUser.user.email, 'New Session Scheduled', `A new session "${data.title}" has been scheduled.`, '/dashboard')
                }
            }
        }
    } catch (e) {
        console.error('Failed to send session notifications:', e)
    }

    revalidatePath('/instructor/sessions')
}

export async function getStudentSessions(): Promise<Session[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // 1. Get User's Cohort(s)
    const { data: enrollments } = await supabase
        .from('enrollments')
        .select('cohort_id')
        .eq('user_id', user.id)

    if (!enrollments || enrollments.length === 0) return []

    const cohortIds = enrollments.map(e => e.cohort_id).filter(Boolean)
    if (cohortIds.length === 0) return []

    // 2. Get Sessions
    const { data, error } = await supabase
        .from('sessions')
        .select('*, cohorts(name)')
        .in('cohort_id', cohortIds)
        .gte('start_time', new Date().toISOString()) // Only future sessions
        .order('start_time', { ascending: true })

    if (error) {
        return []
    }

    return data.map((s: any) => ({
        ...s,
        cohort: s.cohorts
    }))
}

// Helper to get cohorts for dropdown
export async function getMyCohorts() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
        .from('cohorts')
        .select('id, name')
        .eq('instructor_id', user.id)

    return data || []
}
