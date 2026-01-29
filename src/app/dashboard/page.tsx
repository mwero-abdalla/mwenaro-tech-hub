import { getEnrolledCourses } from '@/lib/enrollment'
import { CourseCard } from '@/components/course-card'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 0 // Ensure dynamic data

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const enrolledCourses = await getEnrolledCourses()

    return (
        <div className="container py-12 px-4">
            <h1 className="text-3xl font-bold tracking-tight mb-8">My Dashboard</h1>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Enrolled Courses</h2>
                    {enrolledCourses.length === 0 ? (
                        <div className="bg-muted p-8 rounded-lg text-center">
                            <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {enrolledCourses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
