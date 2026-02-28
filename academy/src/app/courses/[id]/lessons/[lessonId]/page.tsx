import { getLesson, getCourseLessons, getLessonQuestions } from '@/lib/lessons'
import { getLessonProgress, isLessonLocked, getLatestQuizSubmission, getQuizReview } from '@/lib/progress'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { QuizModal } from '@/components/quiz-modal'
import { ProjectSubmission } from '@/components/project-submission'
import { VideoPlayer } from '@/components/video-player'
import { QuizReview } from '@/components/quiz-review'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChevronLeft, ChevronRight, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LessonPageProps {
    params: Promise<{
        id: string
        lessonId: string
    }>
}

export default async function LessonPage({ params }: LessonPageProps) {
    const { id: courseId, lessonId } = await params

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const isAdmin = user?.user_metadata?.role === 'admin'
    const isInstructor = user?.user_metadata?.role === 'instructor'
    const canBypass = isAdmin || isInstructor

    // Check locking logic
    const locked = await isLessonLocked(courseId, lessonId)
    if (locked && !canBypass) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                    <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h1 className="text-2xl font-bold mb-2">Lesson Locked</h1>
                <p className="text-muted-foreground mb-8">Please complete the previous lessons to unlock this content.</p>
                <Link href={`/courses/${courseId}`}>
                    <Button variant="outline">Back to Course Overview</Button>
                </Link>
            </div>
        )
    }

    const lesson = await getLesson(lessonId)
    if (!lesson) {
        notFound()
    }

    const [questions, progress, allLessons, latestSubmission] = await Promise.all([
        getLessonQuestions(lessonId),
        getLessonProgress(lessonId),
        getCourseLessons(courseId),
        getLatestQuizSubmission(lessonId)
    ])

    let reviewData = null
    if (latestSubmission) {
        reviewData = await getQuizReview(latestSubmission.id)
    }

    // Determine Navigation
    const currentIndex = allLessons.findIndex(l => l.id === lessonId)
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

    const canContinue = (progress?.is_completed || isAdmin)

    return (
        <div className="space-y-10 pb-20">
            {/* Lesson Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-bold text-primary">Lesson {currentIndex + 1}</span>
                    <span>•</span>
                    <span>{allLessons.length} lessons total</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-4xl font-black tracking-tight">{lesson.title}</h1>
                    <Link href={`/learn/${courseId}/${lessonId}`}>
                        <Button variant="outline" className="rounded-xl font-bold shadow-sm">
                            <Monitor className="w-4 h-4 mr-2" />
                            Immersive Mode
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-8">
                {lesson.video_url && (
                    <VideoPlayer url={lesson.video_url} />
                )}
                <div className="prose prose-slate lg:prose-lg dark:prose-invert max-w-none">
                    <div className="rounded-2xl border bg-card p-8 shadow-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {lesson.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>

            {/* Activity Sections */}
            <div className="grid gap-8">
                {/* Quiz Section */}
                {questions.length > 0 && (
                    <div className="rounded-2xl border bg-muted/30 p-8">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight">Knowledge Check</h2>
                            {progress?.is_completed && (
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    Passed
                                </span>
                            )}
                        </div>
                        {isInstructor ? (
                            <p className="text-primary font-bold italic bg-primary/5 p-4 rounded-xl border border-primary/10">
                                Instructor Preview: Quizzes are disabled.
                            </p>
                        ) : progress?.is_completed ? (
                            <div className="space-y-6">
                                <p className="text-muted-foreground">
                                    You've already passed this quiz with a score of <span className="font-bold text-foreground">{progress.highest_quiz_score}%</span>.
                                </p>
                                {reviewData && (
                                    <div className="border rounded-xl p-6 bg-background/50">
                                        <h3 className="text-xl font-bold mb-4">Quiz Feedback</h3>
                                        <QuizReview
                                            questions={reviewData.questions as any}
                                            answers={reviewData.user_answers}
                                            correctAnswers={reviewData.questions.map((q: any) => q.correct_answer)}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : latestSubmission ? (
                            <div className="space-y-6 mt-6">
                                <p className="text-muted-foreground">
                                    Your latest attempt scored <span className="font-bold text-red-500">{latestSubmission.score}%</span>. You need 70% to pass.
                                </p>
                                {reviewData && (
                                    <div className="border rounded-xl p-6 bg-red-50/10 border-red-100 dark:border-red-900/30">
                                        <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-4">Review Your Mistakes</h3>
                                        <QuizReview
                                            questions={reviewData.questions as any}
                                            answers={reviewData.user_answers}
                                            correctAnswers={reviewData.questions.map((q: any) => q.correct_answer)}
                                        />
                                    </div>
                                )}
                                <QuizModal
                                    lessonId={lesson.id}
                                    questions={questions}
                                    initialProgress={progress ? {
                                        highest_quiz_score: progress.highest_quiz_score,
                                        quiz_attempts: progress.quiz_attempts
                                    } : undefined}
                                />
                            </div>
                        ) : (
                            <QuizModal
                                lessonId={lesson.id}
                                questions={questions}
                                initialProgress={progress ? {
                                    highest_quiz_score: progress.highest_quiz_score,
                                    quiz_attempts: progress.quiz_attempts
                                } : undefined}
                            />
                        )}
                    </div>
                )}

                {/* Project Section */}
                {lesson.has_project && (
                    <div className="rounded-2xl border bg-muted/30 p-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-6">Hands-on Project</h2>
                        {isInstructor ? (
                            <p className="text-primary font-bold italic bg-primary/5 p-4 rounded-xl border border-primary/10">
                                Instructor Preview: Submissions are disabled.
                            </p>
                        ) : (
                            <ProjectSubmission
                                lessonId={lesson.id}
                                isCompleted={progress?.is_completed || false}
                                existingLink={progress?.project_repo_link}
                                quizRequired={questions.length > 0}
                                quizPassed={(progress?.highest_quiz_score || 0) >= 70}
                                isReviewed={progress?.project_reviewed || false}
                                rating={progress?.project_rating}
                                feedback={progress?.project_feedback}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Sticky Navigation Footer */}
            <div className="sticky bottom-8 z-10 flex items-center justify-between rounded-2xl border bg-background/80 p-4 shadow-xl backdrop-blur-md">
                {prevLesson ? (
                    <Button variant="ghost" asChild>
                        <Link href={`/courses/${courseId}/lessons/${prevLesson.id}`}>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Previous
                        </Link>
                    </Button>
                ) : (
                    <div />
                )}

                <div className="hidden text-sm font-medium text-muted-foreground md:block">
                    {Math.round(((currentIndex + (progress?.is_completed ? 1 : 0)) / allLessons.length) * 100)}% Complete
                </div>

                {nextLesson ? (
                    <Button
                        disabled={!canContinue}
                        asChild={canContinue}
                        className={cn(!canContinue && "cursor-not-allowed")}
                    >
                        {canContinue ? (
                            <Link href={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                                Next Lesson
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        ) : (
                            <span>Complete task to continue</span>
                        )}
                    </Button>
                ) : (
                    <Button disabled variant="outline">
                        Course End
                    </Button>
                )}
            </div>
        </div>
    )
}
