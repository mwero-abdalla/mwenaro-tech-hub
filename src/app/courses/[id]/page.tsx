import { getCourseLessons } from '@/lib/lessons'
import { getCourse } from '@/lib/courses'
import { hasEnrolled, enrollUser } from '@/lib/enrollment'
import { getCourseProgress } from '@/lib/progress'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, Lock, PlayCircle, Maximize2 } from 'lucide-react'

interface CoursePageProps {
    params: Promise<{
        id: string
    }>
}

export default async function CoursePage({ params }: CoursePageProps) {
    const { id } = await params
    const course = await getCourse(id)
    const lessons = await getCourseLessons(id)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const isAdmin = user?.user_metadata?.role === 'admin'
    const isEnrolled = await hasEnrolled(id)
    const canPreview = isEnrolled || isAdmin

    if (!course) {
        notFound()
    }

    const progressRecords = isEnrolled ? await getCourseProgress(id) : []
    const completedCount = progressRecords.filter(p => p.is_completed).length
    const progressPercentage = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0

    return (
        <div className="container py-12 px-4 max-w-6xl mx-auto">
            <Link href="/courses" className="text-muted-foreground hover:text-primary mb-6 flex items-center gap-2 transition-colors">
                <span className="text-xl">&larr;</span> Back to Courses
            </Link>

            <div className="grid gap-12 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-4 border-white shadow-2xl bg-muted group">
                        <Image
                            src={course.image_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop'}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <h1 className="text-4xl font-extrabold tracking-tight">{course.title}</h1>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold tracking-tight">About this Course</h2>
                            {!canPreview && (
                                <div className="text-3xl font-black text-primary drop-shadow-sm">
                                    ${course.price.toFixed(2)}
                                </div>
                            )}
                        </div>
                        <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                            {course.description}
                        </div>
                    </div>

                    {isEnrolled && (
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 shadow-inner">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                                    Your Progress
                                    <span className="text-sm font-normal text-muted-foreground">({completedCount}/{lessons.length} lessons)</span>
                                </h3>
                                <span className="text-2xl font-black text-primary">{progressPercentage}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-3 shadow-sm" />
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <div className="p-8 rounded-2xl border-2 border-primary/10 bg-card shadow-xl sticky top-8">
                        <h2 className="text-2xl font-black mb-6 tracking-tight flex items-center gap-2">
                            Course Content
                        </h2>

                        {!canPreview ? (
                            <div className="space-y-6">
                                <p className="text-muted-foreground">Enroll now to access all lessons and track your progress.</p>
                                <form action={enrollUser.bind(null, course.id)} className="w-full">
                                    <Button size="lg" className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1">
                                        Enroll in Course
                                    </Button>
                                </form>
                                <div className="space-y-4 pt-4 border-t">
                                    {lessons.map((lesson, index) => (
                                        <div key={lesson.id} className="flex items-center gap-4 text-muted-foreground/60">
                                            <Lock size={16} />
                                            <span className="text-sm font-medium">{lesson.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {isEnrolled && lessons.length > 0 && (
                                    <Link href={`/learn/${course.id}/${lessons[0].id}`}>
                                        <Button className="w-full mb-6 font-black h-14 rounded-xl shadow-xl shadow-primary/20 gap-2 border-primary/20 bg-gradient-to-r from-primary to-primary/90 hover:scale-[1.02] transition-transform">
                                            <Maximize2 className="w-5 h-5" />
                                            Launch Immersive Player
                                        </Button>
                                    </Link>
                                )}
                                {lessons.map((lesson, index) => {
                                    const progress = progressRecords.find(p => p.lesson_id === lesson.id)
                                    const isCompleted = progress?.is_completed || false

                                    // Logic for locking:
                                    // Lesson 1 is always unlocked.
                                    // Other lessons are unlocked if the previous lesson is completed.
                                    const isFirst = index === 0
                                    const prevLessonId = !isFirst ? lessons[index - 1].id : null
                                    const prevProgress = prevLessonId ? progressRecords.find(p => p.lesson_id === prevLessonId) : null
                                    const isUnlocked = isFirst || (prevProgress?.is_completed ?? false) || isAdmin

                                    let statusContent;
                                    if (isCompleted) {
                                        statusContent = (
                                            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-1.5 rounded-full">
                                                <CheckCircle2 size={18} />
                                            </div>
                                        )
                                    } else if (isUnlocked) {
                                        statusContent = (
                                            <div className="bg-primary/10 text-primary p-1.5 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <PlayCircle size={18} />
                                            </div>
                                        )
                                    } else {
                                        statusContent = (
                                            <div className="text-muted-foreground/40 p-1.5">
                                                <Lock size={18} />
                                            </div>
                                        )
                                    }

                                    return (
                                        <div key={lesson.id} className="group">
                                            {isUnlocked ? (
                                                <Link
                                                    href={`/courses/${course.id}/lessons/${lesson.id}`}
                                                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md ${isCompleted ? 'border-green-100 bg-green-50/30' : 'border-primary/5 bg-muted/30'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-black text-muted-foreground/40 group-hover:text-primary/40 transition-colors">
                                                            {(index + 1).toString().padStart(2, '0')}
                                                        </span>
                                                        <span className={`font-bold text-sm tracking-tight ${isCompleted ? 'text-green-800 dark:text-green-300' : 'text-foreground/80'}`}>
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                    {statusContent}
                                                </Link>
                                            ) : (
                                                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-muted/50 bg-muted/10 opacity-60">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-black text-muted-foreground/20">
                                                            {(index + 1).toString().padStart(2, '0')}
                                                        </span>
                                                        <span className="font-bold text-sm tracking-tight text-muted-foreground/40">
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                    {statusContent}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
