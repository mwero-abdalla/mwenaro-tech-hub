import { getCourseLessons } from '@/lib/lessons'
import { redirect, notFound } from 'next/navigation'
import { updateLastCourse } from '@/lib/user'

export default async function LearnOverviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const lessons = await getCourseLessons(id)

    if (lessons.length === 0) {
        notFound()
    }

    // Update last active course
    await updateLastCourse(id)

    // Redirect to the first lesson
    redirect(`/learn/${id}/${lessons[0].id}`)
}
