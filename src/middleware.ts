import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Protect instructor routes
    if (pathname.startsWith('/instructor')) {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            // Redirect to login if not authenticated
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Check if user has instructor role
        const role = user.user_metadata?.role || 'student'
        if (role !== 'instructor') {
            // Redirect to dashboard if not an instructor
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/instructor/:path*']
}
