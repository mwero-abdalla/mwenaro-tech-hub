import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPendingSubmissions, getInstructorStats } from '@/lib/instructor'
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
    const stats = await getInstructorStats(user.id)

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="max-w-7xl mx-auto p-8">
                {/* Header */}
                <div className="mb-8 p-8 rounded-3xl bg-white/50 dark:bg-card/50 backdrop-blur-sm border border-white/20 shadow-xl">
                    <h1 className="text-4xl font-black tracking-tight mb-2 text-primary">Instructor Hub</h1>
                    <p className="text-muted-foreground text-lg italic">Guidance • Mentorship • Future Leaders</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-widest text-primary mb-1 text-primary">Pending Reviews</p>
                                <p className="text-5xl font-black">{pendingSubmissions.length}</p>
                            </div>
                            <div className="p-4 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20 shadow-sm border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-widest text-secondary dark:text-secondary-foreground mb-1">Total Students</p>
                                <p className="text-5xl font-black">{stats.totalStudents}</p>
                            </div>
                            <div className="p-4 bg-secondary rounded-2xl shadow-lg shadow-secondary/20">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/10 shadow-sm border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Courses Led</p>
                                <p className="text-5xl font-black">{stats.totalCourses}</p>
                            </div>
                            <div className="p-4 bg-muted rounded-2xl shadow-lg shadow-zinc-200 dark:shadow-none">
                                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                            </div>
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
