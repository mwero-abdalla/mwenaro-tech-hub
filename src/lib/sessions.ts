'use server'

import { createClient } from './supabase/server'
import { revalidatePath } from 'next/cache'

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
