import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Separator } from "@/components/ui/separator"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Payment Gate: Check if user has any pending enrollments and no active ones
    const { data: enrollments } = await supabase
        .from('enrollments')
        .select('status, access_until')
        .eq('user_id', user.id)

    const now = new Date()
    const validEnrollments = enrollments?.filter(e =>
        e.status === 'active' ||
        (e.access_until && new Date(e.access_until) > now)
    )

    const hasAccess = validEnrollments && validEnrollments.length > 0

    // A user has pending only if they have at least one pending enrollment AND no active/valid access_until enrollments
    const hasPendingOnly = enrollments?.some(e => e.status === 'pending') && !hasAccess

    // If they have pending but nothing active/valid yet, send to pending page
    if (hasPendingOnly && user.user_metadata?.role !== 'admin' && user.user_metadata?.role !== 'instructor') {
        redirect("/payment-pending")
    }

    return (
        <SidebarProvider>
            <DashboardSidebar user={user} />
            <SidebarInset className="pt-20">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="font-semibold text-lg">My Learning Dashboard</div>
                </header>
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
