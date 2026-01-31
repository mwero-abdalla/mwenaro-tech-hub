import { getCourseLessons } from '@/lib/lessons'
import { getCourse } from '@/lib/courses'
import { getCourseProgress } from '@/lib/progress'
import { createClient } from '@/lib/supabase/server'
import { LessonSidebar } from '@/components/course-player/lesson-sidebar'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function LearnLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ id: string }>
}) {
    const { id: courseId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const [course, lessons, progress] = await Promise.all([
        getCourse(courseId),
        getCourseLessons(courseId),
        getCourseProgress(courseId)
    ])

    if (!course) {
        notFound()
    }

    const isAdmin = user?.user_metadata?.role === 'admin'
    const isInstructor = user?.user_metadata?.role === 'instructor'
    const canBypass = isAdmin || isInstructor

    // Enrich lessons with status
    const enrichedLessons = lessons.map((lesson, index) => {
        const lessonProgress = progress.find(p => p.lesson_id === lesson.id)

        // Locking logic:
        // 1. Is it the first lesson?
        // 2. Is the previous lesson completed?
        const isFirst = index === 0
        const prevLessonId = !isFirst ? lessons[index - 1].id : null
        const prevProgress = prevLessonId ? progress.find(p => p.lesson_id === prevLessonId) : null
        const isUnlocked = isFirst || (prevProgress?.is_completed ?? false) || canBypass

        return {
            id: lesson.id,
            title: lesson.title,
            duration_minutes: null, // Placeholder since schema doesn't have it yet
            order_index: lesson.order_index,
            is_completed: lessonProgress?.is_completed || false,
            is_locked: !isUnlocked
        }
    })

    const completedCount = enrichedLessons.filter(l => l.is_completed).length

    return (
        <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-80 flex-col flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800">
                <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <Link href={isInstructor ? "/instructor/courses" : `/courses/${courseId}`}>
                        <Button variant="ghost" size="sm" className="font-bold -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            {isInstructor ? "Instructor Panel" : "Back to Overview"}
                        </Button>
                    </Link>
                </div>
                <div className="flex-1 overflow-hidden">
                    <LessonSidebar
                        courseId={courseId}
                        lessons={enrichedLessons}
                        courseTitle={course.title}
                        completedCount={completedCount}
                    />
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 lg:hidden">
                    <Link href={isInstructor ? "/instructor/courses" : `/courses/${courseId}`}>
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-bold truncate px-4 text-sm uppercase tracking-widest text-zinc-500">{course.title}</h1>
                    <div className="w-5" /> {/* Spacer */}
                </header>
                <main className="flex-1 overflow-y-auto relative bg-zinc-50 dark:bg-zinc-950">
                    {children}
                </main>
            </div>
        </div>
    )
}
