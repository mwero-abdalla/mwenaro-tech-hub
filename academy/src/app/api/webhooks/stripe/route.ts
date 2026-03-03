import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { enrollUser } from '@/lib/enrollment'
import Stripe from 'stripe'

export async function POST(req: Request) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
        apiVersion: '2025-01-27-ac.0' as any,
    })

    const payload = await req.text()
    const sig = req.headers.get('stripe-signature') as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET || '')
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    const supabase = await createClient()

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const { courseId, userId } = session.metadata || {}

        if (courseId && userId) {
            // Find or create the payment record
            const { data: payment } = await supabase
                .from('course_payments')
                .insert({
                    user_id: userId,
                    course_id: courseId,
                    amount: (session.amount_total || 0) / 100,
                    currency: session.currency || 'usd',
                    status: 'completed',
                    provider: 'stripe',
                    provider_reference: session.id
                })
                .select()
                .single()

            if (payment) {
                // Update enrollment status to active
                await supabase
                    .from('enrollments')
                    .update({ status: 'active' })
                    .eq('user_id', userId)
                    .eq('course_id', courseId)

                // Enroll the user
                await enrollUser(courseId, payment.id)
            }
        }
    }

    return NextResponse.json({ received: true })
}
