import { getCourseLessons } from '@/lib/lessons'
import { redirect, notFound } from 'next/navigation'

export default async function LearnOverviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const lessons = await getCourseLessons(id)

    if (lessons.length === 0) {
        notFound()
    }

    // Redirect to the first lesson
    redirect(`/learn/${id}/${lessons[0].id}`)
}
