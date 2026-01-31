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

                {/* Center Links - Only show for public/logged-out users */}
                {!user && (
                    <div className="hidden md:flex items-center gap-10">
                        <Link href="/courses" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">Courses</Link>
                        <Link href="/about" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">About</Link>
                        <Link href="/contact" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">Contact</Link>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-6">
                            <NotificationBell />
                            <Link href="/dashboard">
                                <Button size="sm" className="font-black h-11 px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 rounded-xl">
                                    {isAdmin ? 'Admin Portal' : isInstructor ? 'Instructor Hub' : 'Dashboard'}
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
