import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function Navbar() {
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
                    </div>
                </div>
                <div className="flex items-center gap-4">
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
                </div>
            </div>
        </nav>
    )
}
