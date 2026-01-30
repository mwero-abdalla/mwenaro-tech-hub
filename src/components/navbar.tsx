import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'
import { NotificationBell } from './notification-bell'

export async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const isAdmin = user?.user_metadata?.role === 'admin'
    const isInstructor = user?.user_metadata?.role === 'instructor'

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                        M
                    </div>
                    <span className="text-xl font-black tracking-tighter text-secondary dark:text-white">
                        Mwenaro<span className="text-primary">.</span>Tech
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-10">
                    <Link href="/courses" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">Courses</Link>
                    {user && (
                        <Link href="/dashboard" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">My Learning</Link>
                    )}
                    <Link href="#" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">About</Link>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-6">
                            {isAdmin && (
                                <Link href="/admin/dashboard" className="hidden md:block">
                                    <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">Admin</span>
                                </Link>
                            )}
                            {isInstructor && (
                                <Link href="/instructor/dashboard" className="hidden md:block">
                                    <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest">Instructor</span>
                                </Link>
                            )}
                            <NotificationBell />
                            <Link href="/dashboard">
                                <Button size="sm" className="font-black h-11 px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 rounded-xl">
                                    Dashboard
                                </Button>
                            </Link>
                            <form action={signOut}>
                                <Button variant="ghost" size="sm" type="submit" className="text-xs font-bold text-muted-foreground uppercase">
                                    Exit
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-primary uppercase tracking-widest px-4">Sign In</Link>
                            <Link href="/signup">
                                <Button size="sm" className="font-black h-11 px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 rounded-xl">
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
