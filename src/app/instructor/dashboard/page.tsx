import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPendingSubmissions } from '@/lib/instructor'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function InstructorDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if user is instructor
    const role = user.user_metadata?.role || 'student'
    if (role !== 'instructor') {
        redirect('/dashboard')
    }

    const pendingSubmissions = await getPendingSubmissions()

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="max-w-7xl mx-auto p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black tracking-tight mb-2">Instructor Dashboard</h1>
                    <p className="text-muted-foreground text-lg">Review and rate student project submissions</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-900/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Pending Reviews</p>
                                <p className="text-3xl font-black text-blue-900 dark:text-blue-100">{pendingSubmissions.length}</p>
                            </div>
                            <div className="p-3 bg-blue-500 rounded-full">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-900/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">View All</p>
                                <p className="text-lg font-bold text-green-900 dark:text-green-100">Submissions</p>
                            </div>
                            <Link href="/instructor/submissions">
                                <Button variant="default" className="bg-green-600 hover:bg-green-700">
                                    View All
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-900/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">Quick Access</p>
                                <p className="text-lg font-bold text-purple-900 dark:text-purple-100">Courses</p>
                            </div>
                            <Link href="/courses">
                                <Button variant="outline" className="border-purple-300 dark:border-purple-700">
                                    Browse
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>

                {/* Pending Submissions List */}
                <Card className="p-6">
                    <h2 className="text-2xl font-black mb-6">Pending Reviews</h2>

                    {pendingSubmissions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-block p-4 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">All Caught Up!</h3>
                            <p className="text-muted-foreground">No pending submissions to review at the moment.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingSubmissions.map((submission) => (
                                <div
                                    key={`${submission.user_id}-${submission.lesson_id}`}
                                    className="flex items-center justify-between p-4 border rounded-xl hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{submission.student_name || submission.student_email}</h3>
                                                <p className="text-sm text-muted-foreground">{submission.student_email}</p>
                                            </div>
                                        </div>
                                        <div className="ml-14">
                                            <p className="text-sm font-medium text-primary">{submission.course_title}</p>
                                            <p className="text-sm text-muted-foreground">{submission.lesson_title}</p>
                                            <a
                                                href={submission.project_repo_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                                            >
                                                {submission.project_repo_link}
                                            </a>
                                        </div>
                                    </div>
                                    <Link href={`/instructor/review/${submission.user_id}/${submission.lesson_id}`}>
                                        <Button className="font-bold">
                                            Review Project
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
