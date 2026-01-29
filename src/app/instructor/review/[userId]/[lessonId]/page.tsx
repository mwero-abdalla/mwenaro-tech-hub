import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getStudentSubmission } from '@/lib/instructor'
import { getLesson } from '@/lib/lessons'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReviewForm } from '@/components/review-form'

export default async function ReviewPage({
    params,
}: {
    params: Promise<{ userId: string; lessonId: string }>
}) {
    const { userId, lessonId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const role = user.user_metadata?.role || 'student'
    if (role !== 'instructor') {
        redirect('/dashboard')
    }

    const submission = await getStudentSubmission(userId, lessonId)
    if (!submission) {
        notFound()
    }

    const lesson = await getLesson(lessonId)

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="max-w-5xl mx-auto p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Review Project</h1>
                        <p className="text-muted-foreground text-lg">
                            {submission.course_title} • {submission.lesson_title}
                        </p>
                    </div>
                    <Link href="/instructor/dashboard">
                        <Button variant="outline">
                            ← Back to Dashboard
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Student & Project Info */}
                    <div className="space-y-6">
                        {/* Student Info */}
                        <Card className="p-6">
                            <h2 className="text-xl font-black mb-4">Student Information</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="font-bold">{submission.student_name || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{submission.student_email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Submitted</p>
                                    <p className="font-medium">
                                        {submission.submitted_at
                                            ? new Date(submission.submitted_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : 'Unknown'}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Project Submission */}
                        <Card className="p-6">
                            <h2 className="text-xl font-black mb-4">Submitted Project</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Project Link</p>
                                    <a
                                        href={submission.project_repo_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium break-all"
                                    >
                                        {submission.project_repo_link}
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                    </a>
                                </div>
                                <div className="pt-3">
                                    <a
                                        href={submission.project_repo_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button className="w-full font-bold">
                                            Open Project in New Tab
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </Card>

                        {/* Lesson Content */}
                        {lesson && (
                            <Card className="p-6">
                                <h2 className="text-xl font-black mb-4">Lesson Requirements</h2>
                                <div
                                    className="prose prose-sm dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                                />
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Review Form */}
                    <div>
                        <Card className="p-6 sticky top-8">
                            <h2 className="text-xl font-black mb-6">
                                {submission.project_reviewed ? 'Review Details' : 'Submit Review'}
                            </h2>
                            <ReviewForm
                                userId={userId}
                                lessonId={lessonId}
                                existingRating={submission.project_rating}
                                existingFeedback={submission.project_feedback}
                                isReviewed={submission.project_reviewed}
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
