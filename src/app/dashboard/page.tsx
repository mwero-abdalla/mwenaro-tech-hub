import { getEnrolledCourses } from '@/lib/enrollment'
import { CourseCard } from '@/components/course-card'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserProgress } from '@/lib/progress'
import { Button } from '@/components/ui/button'

export const revalidate = 0 // Ensure dynamic data

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const enrolledCourses = await getEnrolledCourses()
    const allProgress = await getUserProgress()

    // Fetch lesson counts for ONLY the enrolled courses to avoid any leakage
    const courseIds = enrolledCourses.map(c => c.id)

    let coursesWithProgress: any[] = []

    if (courseIds.length > 0) {
        const { data: lessonsData } = await supabase
            .from('lessons')
            .select('id, course_id')
            .in('course_id', courseIds)

        coursesWithProgress = enrolledCourses.map(course => {
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
    }

    return (
        <div className="container py-12 px-4 max-w-7xl mx-auto">
            <header className="mb-12 border-b pb-8">
                <h1 className="text-4xl font-black tracking-tight mb-2">Learner Dashboard</h1>
                <p className="text-muted-foreground text-lg">You are currently enrolled in {enrolledCourses.length} {enrolledCourses.length === 1 ? 'course' : 'courses'}.</p>
            </header>

            <div className="space-y-12">
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold tracking-tight">My Enrolled Courses</h2>
                    </div>

                    {enrolledCourses.length === 0 ? (
                        <div className="bg-muted/30 border-2 border-dashed rounded-3xl p-16 text-center max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold mb-4">Your dashboard is empty</h3>
                            <p className="text-muted-foreground mb-8 text-lg">
                                You haven't started any courses yet. Explore our curriculum to begin your learning journey.
                            </p>
                            <Link href="/courses">
                                <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                    Browse Available Courses
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
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
