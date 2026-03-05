import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Refresh the session if it exists
    const { data: { user } } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    // If a logged-in user tries to visit /login or /signup, redirect them
    if (user && (pathname === '/login' || pathname === '/signup')) {
        const role = user.user_metadata?.role

        let destination = '/dashboard'
        if (role === 'admin') destination = '/admin/dashboard'
        else if (role === 'instructor') destination = '/instructor/dashboard'

        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = destination
        return NextResponse.redirect(redirectUrl)
    }

    return supabaseResponse
}

export const config = {
    matcher: ['/login', '/signup'],
}
