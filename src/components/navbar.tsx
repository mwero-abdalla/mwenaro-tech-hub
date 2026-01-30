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
                    <div className="hidden md:flex gap-8">
                        <Link href="/" className="text-sm font-bold transition-all hover:text-primary relative group">
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                        </Link>
                        <Link href="/courses" className="text-sm font-bold transition-all hover:text-primary relative group">
                            Courses
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                        </Link>
                        {user && (
                            <Link href="/dashboard" className="text-sm font-bold transition-all hover:text-primary relative group">
                                My Learning
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>
                        )}
                        {user?.user_metadata?.role === 'instructor' && (
                            <Link href="/instructor/dashboard" className="text-sm font-bold transition-all hover:text-primary text-secondary dark:text-secondary-foreground px-3 py-1 bg-secondary/5 dark:bg-white/5 rounded-full border border-secondary/10 hover:border-primary/30">
                                Instructor Portal
                            </Link>
                        )}
                        {user?.user_metadata?.role === 'admin' && (
                            <Link href="/admin/dashboard" className="text-sm font-bold transition-all hover:text-primary text-primary px-3 py-1 bg-primary/5 rounded-full border border-primary/10 hover:border-primary/30">
                                Admin Dashboard
                            </Link>
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
