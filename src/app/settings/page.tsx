import { getProfile } from '@/lib/user'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from '@/components/settings/profile-form'
import { PasswordForm } from '@/components/settings/password-form'
import { User, ShieldCheck } from 'lucide-react'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const profile = await getProfile()
    const role = user.user_metadata?.role || 'student'
    const isInstructor = role === 'instructor' || role === 'admin'

    if (!profile) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
                <p className="text-muted-foreground">We couldn't load your profile. Please try refreshing the page.</p>
            </div>
        )
    }

    return (
        <div className="container py-12 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Account Settings</h1>
                <p className="text-zinc-500 font-medium">Manage your personal information, professional details, and security.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-8">
                <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl w-full sm:w-auto h-auto grid grid-cols-2">
                    <TabsTrigger value="profile" className="rounded-lg py-2.5 font-bold data-[state=active]:shadow-sm flex items-center gap-2">
                        <User size={18} />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-lg py-2.5 font-bold data-[state=active]:shadow-sm flex items-center gap-2">
                        <ShieldCheck size={18} />
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                    <ProfileForm profile={profile} isInstructor={isInstructor} />
                </TabsContent>

                <TabsContent value="security" className="focus-visible:outline-none focus-visible:ring-0">
                    <PasswordForm />
                </TabsContent>
            </Tabs>
        </div>
    )
}
