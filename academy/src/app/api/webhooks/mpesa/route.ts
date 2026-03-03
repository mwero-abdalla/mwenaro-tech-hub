import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { enrollUser } from '@/lib/enrollment'

export async function POST(req: Request) {
    const data = await req.json()
    console.log('M-Pesa Callback Received:', JSON.stringify(data))

    const result = data.Body.stkCallback
    const checkoutRequestID = result.CheckoutRequestID
    const resultCode = result.ResultCode

    const supabase = await createClient()

    if (resultCode === 0) {
        // Success
        // Find the payment record in our course_payments table
        const { data: payment, error: fetchError } = await supabase
            .from('course_payments')
            .select('*')
            .eq('provider_reference', checkoutRequestID)
            .single()

        if (payment) {
            // Update status to completed
            await supabase
                .from('course_payments')
                .update({ status: 'completed' })
                .eq('id', payment.id)

            // Update enrollment status to active
            await supabase
                .from('enrollments')
                .update({ status: 'active' })
                .eq('user_id', payment.user_id)
                .eq('course_id', payment.course_id)

            // Enroll the user (this will revalidate paths)
            await enrollUser(payment.course_id, payment.id)
        }
    } else {
        // Failed
        await supabase
            .from('course_payments')
            .update({ status: 'failed' })
            .eq('provider_reference', checkoutRequestID)
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' })
}
