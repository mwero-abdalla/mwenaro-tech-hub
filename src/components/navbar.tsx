import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'
import { NotificationBell } from './notification-bell'

export async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="font-bold text-xl">
                        Mwenaro Tech
                    </Link>
                    <div className="hidden md:flex gap-6">
                        <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                            Home
                        </Link>
                        <Link href="/courses" className="text-sm font-medium transition-colors hover:text-primary">
                            Courses
                        </Link>
                        {user && (
                            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                                Dashboard
                            </Link>
                        )}
                        {user?.user_metadata?.role === 'instructor' && (
                            <>
                                <Link href="/instructor/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                                    Dashboard
                                </Link>
                                <Link href="/instructor/sessions" className="text-sm font-medium transition-colors hover:text-primary">
                                    Sessions
                                </Link>
                                <Link href="/instructor/payments" className="text-sm font-medium transition-colors hover:text-primary">
                                    Payments
                                </Link>
                                <Link href="/instructor/messages" className="text-sm font-medium transition-colors hover:text-primary">
                                    Messages
                                </Link>
                            </>
                        )}
                        {user?.user_metadata?.role === 'admin' && (
                            <>
                                <Link href="/admin/dashboard" className="text-sm font-medium transition-colors hover:text-primary text-red-600 dark:text-red-400">
                                    Admin
                                </Link>
                                <Link href="/admin/messages" className="text-sm font-medium transition-colors hover:text-primary">
                                    Messages
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-2">
                            <NotificationBell />
                            <form action={signOut}>
                                <Button variant="ghost" size="sm" type="submit">
                                    Sign Out
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
