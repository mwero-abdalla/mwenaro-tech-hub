import { createAdminClient } from '@/lib/supabase/admin'
import { getAllCohorts, isAdmin, getAllPayments } from '@/lib/admin'
import { redirect } from 'next/navigation'
import AdminPaymentsClient from '@/components/admin/admin-payments-client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
    title: 'Manual Payments | Admin Dashboard',
}

export default async function AdminPaymentsPage() {
    if (!await isAdmin()) {
        redirect('/login')
    }

    const adminSupabase = createAdminClient()

    // Fetch users (auth), profiles, cohorts, and payments
    const [{ data: authData }, { data: profiles }, cohorts, payments] = await Promise.all([
        adminSupabase.auth.admin.listUsers(),
        adminSupabase.from('profiles').select('id, full_name'),
        getAllCohorts(),
        getAllPayments()
    ])

    const authUsers = authData?.users || []
    
    // Map profiles
    const profileMap = new Map((profiles || []).map(p => [p.id, p.full_name]))

    // We only want learners (role: student) typically, or just all users for flexibility
    // Using user_metadata.role
    const users = authUsers
        .filter(u => !u.user_metadata?.role || u.user_metadata.role === 'student')
        .map(u => ({
            id: u.id,
            email: u.email || '',
            name: profileMap.get(u.id) || undefined
        }))

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-primary">Record Payment</h1>
                            <p className="text-muted-foreground mt-1 text-sm md:text-base">
                                Manually record payments made outside the platform (M-Pesa, Cash, Bank Transfer).
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <AdminPaymentsClient 
                        users={users} 
                        cohorts={cohorts || []} 
                        initialPayments={payments || []}
                    />
                </div>
            </div>
        </div>
    )
}
