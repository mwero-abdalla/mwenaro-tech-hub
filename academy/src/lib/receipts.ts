'use server'

import { createClient } from './supabase/server'

export interface Receipt {
    id: string
    course_id: string
    course_title: string
    amount: number
    currency: string
    status: string
    provider: string
    provider_reference: string
    description?: string
    created_at: string
}

export async function getMyReceipts(): Promise<Receipt[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // Fetch payments and join with course titles
    const { data, error } = await supabase
        .from('course_payments')
        .select(`
            id,
            course_id,
            amount,
            currency,
            status,
            provider,
            provider_reference,
            description,
            created_at,
            courses (
                title
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching receipts:', error)
        return []
    }

    return data.map((p: any) => ({
        id: p.id,
        course_id: p.course_id,
        course_title: p.courses?.title || 'Unknown Course',
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        provider: p.provider,
        provider_reference: p.provider_reference,
        description: p.description,
        created_at: p.created_at
    }))
}
