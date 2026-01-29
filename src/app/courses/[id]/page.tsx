import { getCourse } from '@/lib/courses'
import { hasEnrolled, enrollUser } from '@/lib/enrollment'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface CoursePageProps {
    params: Promise<{
        id: string
    }>
}

export default async function CoursePage({ params }: CoursePageProps) {
    const { id } = await params
    const course = await getCourse(id)
    const isEnrolled = await hasEnrolled(id)

    if (!course) {
        notFound()
    }

    return (
        <div className="container py-12 px-4">
            <Link href="/courses" className="text-muted-foreground hover:text-primary mb-6 inline-block">
                &larr; Back to Courses
            </Link>
            <div className="grid gap-8 lg:grid-cols-2">
                <div>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                        <Image
                            src={course.image_url || 'https://placehold.co/600x400/png'}
                            alt={course.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold">{course.title}</h1>
                        <p className="mt-4 text-2xl font-bold text-primary">
                            ${course.price.toFixed(2)}
                        </p>
                    </div>

                    <div className="prose max-w-none text-muted-foreground">
                        <p>{course.description}</p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        {isEnrolled ? (
                            <Link href="/dashboard">
                                <Button size="lg" className="w-full sm:w-auto">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <form action={enrollUser.bind(null, course.id)}>
                                <Button size="lg" className="w-full sm:w-auto" type="submit">
                                    Enroll Now
                                </Button>
                            </form>
                        )}
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                            View Syllabus
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
