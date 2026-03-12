import { getLesson, getCourseLessons, getLessonQuestions } from '@/lib/lessons'
import { getCourse } from '@/lib/courses'
import { getLessonProgress } from '@/lib/progress'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { updateLastCourse } from '@/lib/user'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { QuizModal } from '@/components/quiz-modal'
import { ProjectSubmission } from '@/components/project-submission'
import { VideoPlayer } from '@/components/video-player'
import Mermaid from '@/components/mermaid'
import { LessonQuiz } from '@/components/course/lesson-quiz'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChevronLeft, ChevronRight, Maximize2, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LessonPageProps {
    params: Promise<{
        id: string
        lessonId: string
    }>
}

export default async function ImmersiveLessonPage({ params }: LessonPageProps) {
    const { id: courseId, lessonId } = await params

    // Update last active course
    await updateLastCourse(courseId)

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
        <div className="max-w-5xl mx-auto px-6 pt-32 pb-10 space-y-12 pb-32">
            {/* Top Bar / Metadata */}
            <div className="flex items-center justify-between group">
                <div className="space-y-2">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                Module {currentIndex + 1} of {allLessons.length}
                            </p>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                        {lesson.title}
                    </h1>
                </div>
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
                <div className="prose prose-zinc lg:prose-xl dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-a:font-bold hover:prose-a:text-primary/80 prose-img:rounded-3xl prose-img:shadow-xl prose-strong:font-black">
                    <div className="rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-900/50 p-8 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl">
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

                <div className="grid gap-8">
                    {questions.length > 0 && (
                        <LessonQuiz 
                            questions={questions}
                            lessonId={lessonId}
                            userRole={user?.user_metadata?.role}
                            nextLessonHref={nextLesson ? `/learn/${courseId}/${nextLesson.id}` : undefined}
                        />
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
                <div className="bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/50 dark:border-zinc-800/50 px-6 py-4 rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl flex items-center justify-between gap-10 w-full max-w-2xl transition-all duration-300 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1">
                    <Link href={prevLesson ? `/learn/${courseId}/${prevLesson.id}` : `/courses/${courseId}`}>
                        <Button variant="ghost" className="font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-4 rounded-xl">
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            {prevLesson ? 'Previous' : 'Overview'}
                        </Button>
                    </Link>

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
