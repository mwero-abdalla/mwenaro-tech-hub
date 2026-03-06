import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginForm from './login-form'

export default async function LoginPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const role = user.user_metadata?.role
        if (role === 'admin') redirect('/admin/dashboard')
        else if (role === 'instructor') redirect('/instructor/dashboard')
        else redirect('/dashboard')
    }

    return <LoginForm />
}
