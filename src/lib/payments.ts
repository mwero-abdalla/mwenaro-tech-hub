'use server'

import { createClient } from './supabase/server'

export interface Payment {
    id: string
    amount: number
    currency: string
    status: 'pending' | 'paid' | 'failed'
    period_start: string | null
    period_end: string | null
    description: string | null
    created_at: string
}

export async function getMyPayments(): Promise<Payment[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('instructor_payments')
        .select('*')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching payments:', error)
        return []
    }

    return data as Payment[]
}
