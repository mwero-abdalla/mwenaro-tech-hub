import { getCourses } from '@/lib/courses'
import { CoursesClient } from '@/components/courses-client'

export const revalidate = 60

export default async function CoursesPage() {
    const courses = await getCourses()

    return <CoursesClient courses={courses} />
}
