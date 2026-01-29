import { getCourses } from '@/lib/courses'
import { CourseCard } from '@/components/course-card'

export const revalidate = 60 // Revalidate potentially

export default async function CoursesPage() {
    const courses = await getCourses()

    return (
        <div className="container py-12 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Available Courses</h1>
                <p className="mt-2 text-muted-foreground">
                    Explore our wide range of technology courses designed to help you succeed.
                </p>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-20">
                    <h3 className="text-lg font-medium">No courses found</h3>
                    <p className="text-muted-foreground">Check back later for new content.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}
        </div>
    )
}
