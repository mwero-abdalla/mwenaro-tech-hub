import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllQuizzes } from '@/lib/progress'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { QuizzesManagementClient } from '@/components/quizzes-management-client'
import { ArrowLeft } from 'lucide-react'

export default async function InstructorQuizzesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const role = user.user_metadata?.role || 'student'
    if (role !== 'instructor' && role !== 'admin') {
        redirect('/dashboard')
    }

    const quizzes = await getAllQuizzes()

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Quiz Analytics</h1>
                        <p className="text-zinc-500 font-medium mt-1">Monitor student performance and learning trends.</p>
                    </div>
                    <Link href="/instructor/dashboard">
                        <Button variant="ghost" className="font-bold h-12 px-6 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Hub
                        </Button>
                    </Link>
                </div>

                <QuizzesManagementClient initialSubmissions={quizzes} />
            </div>
        </div>
    )
}
