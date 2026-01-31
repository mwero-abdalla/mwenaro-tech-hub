import { getLesson, getCourseLessons, getLessonQuestions } from '@/lib/lessons'
import { getCourse } from '@/lib/courses'
import { getLessonProgress } from '@/lib/progress'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { QuizModal } from '@/components/quiz-modal'
import { ProjectSubmission } from '@/components/project-submission'
import { VideoPlayer } from '@/components/video-player'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LessonPageProps {
    params: Promise<{
        id: string
        lessonId: string
    }>
}

export default async function ImmersiveLessonPage({ params }: LessonPageProps) {
    const { id: courseId, lessonId } = await params

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const lesson = await getLesson(lessonId)
    if (!lesson) {
        notFound()
    }

    const [course, questions, progress, allLessons] = await Promise.all([
        getCourse(courseId),
        getLessonQuestions(lessonId),
        getLessonProgress(lessonId),
        getCourseLessons(courseId)
    ])

    const isAdmin = user?.user_metadata?.role === 'admin'
    const isInstructor = user?.user_metadata?.role === 'instructor'
    const canBypass = isAdmin || isInstructor

    // Determine Navigation
    const currentIndex = allLessons.findIndex((l: any) => l.id === lessonId)
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

    const canContinue = (progress?.is_completed || canBypass)

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-12 pb-32">
            {/* Top Bar / Metadata */}
            <div className="flex items-center justify-between group">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        Module {currentIndex + 1} of {allLessons.length}
                    </p>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                        {lesson.title}
                    </h1>
                </div>
                <Link href={`/courses/${courseId}/lessons/${lessonId}`}>
                    <Button variant="outline" size="sm" className="rounded-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-4 h-4 mr-2" />
                        Simple View
                    </Button>
                </Link>
            </div>

            {/* Video Section */}
            {lesson.video_url && (
                <div className="shadow-2xl rounded-3xl overflow-hidden border border-white/20">
                    <VideoPlayer url={lesson.video_url} className="aspect-video" />
                </div>
            )}

            {/* Content & Activities */}
            <div className="grid grid-cols-1 gap-12">
                <div className="prose prose-slate lg:prose-xl dark:prose-invert max-w-none">
                    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-8 shadow-sm backdrop-blur-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {lesson.content}
                        </ReactMarkdown>
                    </div>
                </div>

                <div className="grid gap-8">
                    {/* Quiz Section */}
                    {questions.length > 0 && (
                        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/30 p-10">
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight mb-1">Knowledge Check</h2>
                                    <p className="text-sm text-zinc-500 font-medium">Verify your understanding of this module.</p>
                                </div>
                                {progress?.is_completed && (
                                    <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-green-500/20">
                                        Passed
                                    </div>
                                )}
                            </div>
                            {isInstructor ? (
                                <p className="text-primary font-bold bg-primary/5 p-6 rounded-2xl border border-primary/20 italic">
                                    Instructor Preview: Quizzes are disabled in this mode.
                                </p>
                            ) : progress?.is_completed ? (
                                <p className="text-zinc-600 dark:text-zinc-400 font-medium bg-white dark:bg-zinc-800/50 p-6 rounded-2xl border border-green-500/20">
                                    Bravo! You've mastered this quiz with a score of <span className="font-black text-zinc-900 dark:text-white">{progress.highest_quiz_score}%</span>.
                                </p>
                            ) : (
                                <QuizModal
                                    lessonId={lesson.id}
                                    questions={questions}
                                />
                            )}
                        </div>
                    )}

                    {/* Project Section */}
                    {lesson.has_project && (
                        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-primary/5 p-10">
                            <div className="mb-8">
                                <h2 className="text-2xl font-black tracking-tight mb-1">Hands-on Challenge</h2>
                                <p className="text-sm text-primary/70 font-medium">Apply what you've learned in a real-world project.</p>
                            </div>
                            {isInstructor ? (
                                <p className="text-primary font-bold bg-primary/5 p-6 rounded-2xl border border-primary/20 italic">
                                    Instructor Preview: Submissions are disabled in this mode.
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
            </div>

            {/* Float Navigation */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 lg:pl-[340px] lg:pr-8 lg:max-w-none lg:left-0 lg:translate-x-0 lg:flex lg:justify-center">
                <div className="bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between gap-10 w-full max-w-2xl">
                    {prevLesson ? (
                        <Link href={`/learn/${courseId}/${prevLesson.id}`}>
                            <Button variant="ghost" className="font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-4">
                                <ChevronLeft className="w-5 h-5 mr-2" />
                                Previous
                            </Button>
                        </Link>
                    ) : (
                        <div />
                    )}

                    <div className="hidden sm:flex flex-col items-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Progress</p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black">{Math.round(((currentIndex + (progress?.is_completed ? 1 : 0)) / allLessons.length) * 100)}%</span>
                        </div>
                    </div>

                    {nextLesson ? (
                        <Link href={canContinue ? `/learn/${courseId}/${nextLesson.id}` : '#'}>
                            <Button
                                disabled={!canContinue}
                                className={cn(
                                    "font-black rounded-xl h-12 px-6 shadow-xl transition-all active:scale-95",
                                    canContinue
                                        ? "bg-primary text-white shadow-primary/25 hover:shadow-primary/40"
                                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 grayscale cursor-not-allowed shadow-none"
                                )}
                            >
                                {canContinue ? (
                                    <>
                                        Next Module
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </>
                                ) : (
                                    "Complete to Continue"
                                )}
                            </Button>
                        </Link>
                    ) : (
                        <Link href={`/courses/${courseId}`}>
                            <Button variant="outline" className="font-black rounded-xl h-12 border-zinc-200 dark:border-zinc-800 px-6">
                                Finish Course
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
