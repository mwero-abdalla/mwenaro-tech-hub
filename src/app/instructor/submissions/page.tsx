import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllSubmissions } from '@/lib/instructor'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function SubmissionsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const role = user.user_metadata?.role || 'student'
    if (role !== 'instructor') {
        redirect('/dashboard')
    }

    const submissions = await getAllSubmissions()
    const pending = submissions.filter(s => !s.project_reviewed)
    const reviewed = submissions.filter(s => s.project_reviewed)

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="max-w-7xl mx-auto p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">All Submissions</h1>
                        <p className="text-muted-foreground text-lg">
                            {submissions.length} total submissions ({pending.length} pending, {reviewed.length} reviewed)
                        </p>
                    </div>
                    <Link href="/instructor/dashboard">
                        <Button variant="outline">
                            ← Back to Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="inline-flex p-1 bg-muted rounded-lg">
                        <button className="px-4 py-2 rounded-md bg-background font-bold shadow-sm">
                            All ({submissions.length})
                        </button>
                        <button className="px-4 py-2 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                            Pending ({pending.length})
                        </button>
                        <button className="px-4 py-2 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                            Reviewed ({reviewed.length})
                        </button>
                    </div>
                </div>

                {/* Submissions Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="text-left p-4 font-bold">Student</th>
                                    <th className="text-left p-4 font-bold">Course</th>
                                    <th className="text-left p-4 font-bold">Lesson</th>
                                    <th className="text-left p-4 font-bold">Status</th>
                                    <th className="text-left p-4 font-bold">Rating</th>
                                    <th className="text-right p-4 font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((submission) => (
                                    <tr
                                        key={`${submission.user_id}-${submission.lesson_id}`}
                                        className="border-b hover:bg-accent/30 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div>
                                                <p className="font-medium">{submission.student_name || 'Student'}</p>
                                                <p className="text-sm text-muted-foreground">{submission.student_email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm font-medium">{submission.course_title}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm">{submission.lesson_title}</p>
                                        </td>
                                        <td className="p-4">
                                            {submission.project_reviewed ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                                    Reviewed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {submission.project_rating !== null ? (
                                                <span className="font-bold text-lg">{submission.project_rating}/100</span>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">—</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={`/instructor/review/${submission.user_id}/${submission.lesson_id}`}>
                                                <Button size="sm" variant={submission.project_reviewed ? "outline" : "default"}>
                                                    {submission.project_reviewed ? 'View Review' : 'Review'}
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    )
}
