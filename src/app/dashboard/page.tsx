import { getEnrolledCourses } from '@/lib/enrollment'
import { CourseCard } from '@/components/course-card'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserProgress } from '@/lib/progress'

export const revalidate = 0 // Ensure dynamic data

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const enrolledCourses = await getEnrolledCourses()
    const allProgress = await getUserProgress()

    // Fetch lesson counts for all enrolled courses
    const { data: lessonsData } = await supabase
        .from('lessons')
        .select('id, course_id')
        .in('course_id', enrolledCourses.map(c => c.id))

    const coursesWithProgress = enrolledCourses.map(course => {
        const courseLessons = lessonsData?.filter(l => l.course_id === course.id) || []
        const lessonCount = courseLessons.length

        const completedLessons = allProgress.filter(p =>
            p.is_completed && courseLessons.some(cl => cl.id === p.lesson_id)
        ).length

        const progressPercentage = lessonCount > 0 ? Math.round((completedLessons / lessonCount) * 100) : 0

        return {
            ...course,
            progress: progressPercentage
        }
    })

    return (
        <div className="container py-12 px-4 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-4xl font-black tracking-tight mb-2">My Dashboard</h1>
                <p className="text-muted-foreground text-lg">Continue where you left off and track your learning journey.</p>
            </header>

            <div className="space-y-12">
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold tracking-tight">Active Courses</h2>
                        <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                            {enrolledCourses.length} {enrolledCourses.length === 1 ? 'Course' : 'Courses'}
                        </span>
                    </div>

                    {enrolledCourses.length === 0 ? (
                        <div className="bg-muted/50 border-2 border-dashed rounded-2xl p-16 text-center">
                            <h3 className="text-xl font-bold mb-2">No active courses</h3>
                            <p className="text-muted-foreground mb-8 max-w-md mx-auto">You haven't enrolled in any courses yet. Start your journey by exploring our available courses.</p>
                            <a href="/courses">
                                <Button size="lg" className="font-bold">Browse Courses</Button>
                            </a>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {coursesWithProgress.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    progress={course.progress}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

import { Button } from '@/components/ui/button' // For the empty state button 

