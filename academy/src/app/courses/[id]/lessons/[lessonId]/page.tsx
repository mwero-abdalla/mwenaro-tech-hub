import { getLesson, getCourseLessons, getLessonQuestions } from '@/lib/lessons'
import { getLessonProgress, isLessonLocked, getLatestQuizSubmission, getQuizReview } from '@/lib/progress'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { QuizModal } from '@/components/quiz-modal'
import { ProjectSubmission } from '@/components/project-submission'
import { VideoPlayer } from '@/components/video-player'
import Mermaid from '@/components/mermaid'
import { LessonQuiz } from '@/components/course/lesson-quiz'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChevronLeft, ChevronRight, Monitor, PlayCircle, BookOpen, HelpCircle } from 'lucide-react'
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
                <div className="prose prose-slate lg:prose-xl dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-a:font-bold prose-strong:font-black">
                    <div className="rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/50 p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    if (!inline && match && match[1] === "mermaid") {
                                        return <Mermaid chart={String(children).replace(/\n$/, "")} />;
                                    }
                                    return (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {lesson.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>

            {/* Activity Sections */}
            <div className="grid gap-8">
                    {questions.length > 0 && (
                        <LessonQuiz 
                            questions={questions}
                            lessonId={lessonId}
                            userRole={user?.user_metadata?.role}
                            nextLessonHref={nextLesson ? `/courses/${courseId}/lessons/${nextLesson.id}` : undefined}
                        />
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
                <Button variant="ghost" asChild>
                    <Link href={prevLesson ? `/courses/${courseId}/lessons/${prevLesson.id}` : `/courses/${courseId}`}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        {prevLesson ? 'Previous' : 'Overview'}
                    </Link>
                </Button>

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
