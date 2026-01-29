import Link from 'next/link'
import Image from 'next/image'
import { Course } from '@/lib/courses'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CourseCardProps {
    course: Course
}

export function CourseCard({ course }: CourseCardProps) {
    return (
        <Card className="flex flex-col overflow-hidden h-full">
            <div className="relative aspect-video w-full overflow-hidden">
                <Image
                    src={course.image_url || 'https://placehold.co/600x400/png'}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                />
            </div>
            <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="line-clamp-3 text-sm text-muted-foreground">
                    {course.description}
                </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
                <span className="text-lg font-bold">
                    ${course.price.toFixed(2)}
                </span>
                <Link href={`/courses/${course.id}`}>
                    <Button size="sm">View Course</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
