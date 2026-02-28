import { getCourseLessons } from '@/lib/lessons'
import { getCourse } from '@/lib/courses'
import { hasEnrolled } from '@/lib/enrollment'
import { getCourseProgress } from '@/lib/progress'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { LessonSidebar } from '@/components/course/lesson-sidebar'

interface LessonsLayoutProps {
    children: React.ReactNode
    params: Promise<{
        id: string
        lessonId?: string
    }>
}

export default async function LessonsLayout({ children, params }: LessonsLayoutProps) {
    const { id: courseId } = await params

    // Auth & Enrollment Check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const isAdmin = user?.user_metadata?.role === 'admin'
    const isEnrolled = await hasEnrolled(courseId)

    if (!isEnrolled && !isAdmin) {
        redirect(`/courses/${courseId}`)
    }

    // Data Fetching
    const [course, lessons, progressRecords] = await Promise.all([
        getCourse(courseId),
        getCourseLessons(courseId),
        getCourseProgress(courseId)
    ])

    if (!course) {
        notFound()
    }

    // Map progress to lessons for the sidebar
    const lessonsWithStatus = lessons.map((lesson, index) => {
        const progress = progressRecords.find(p => p.lesson_id === lesson.id)
        const isCompleted = progress?.is_completed || false

        const isFirst = index === 0
        const prevLessonId = !isFirst ? lessons[index - 1].id : null
        const prevProgress = prevLessonId ? progressRecords.find(p => p.lesson_id === prevLessonId) : null
        const isLocked = !isFirst && !(prevProgress?.is_completed || false) && !isAdmin

        return {
            id: lesson.id,
            title: lesson.title,
            isCompleted,
            isLocked,
            phase_id: lesson.phase_id,
            phase_title: lesson.phase_title || 'Main Content'
        }
    })

    return (
        <div className="flex min-h-screen bg-background">
            <LessonSidebar
                course={{ id: course.id, title: course.title }}
                lessons={lessonsWithStatus}
            />
            <main className="flex-1 lg:pl-80">
                <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
