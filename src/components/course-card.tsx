import Link from 'next/link'
import Image from 'next/image'
import { Course } from '@/lib/courses'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface CourseCardProps {
    course: Course
    progress?: number
}

export function CourseCard({ course, progress }: CourseCardProps) {
    return (
        <Card className="flex flex-col overflow-hidden h-full group transition-all duration-300 hover:shadow-2xl hover:border-primary/20">
            <div className="relative aspect-video w-full overflow-hidden">
                <Image
                    src={course.image_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop'}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {progress !== undefined && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex items-center justify-between text-[10px] font-black text-white mb-1.5 uppercase tracking-widest">
                            <span>Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5 bg-white/20 shadow-sm" />
                    </div>
                )}
            </div>
            <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 text-xl font-extrabold tracking-tight group-hover:text-primary transition-colors">
                    {course.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-6">
                <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                    {course.description}
                </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t border-primary/5 bg-muted/20 p-4 mt-auto">
                <span className="text-xl font-black text-primary">
                    ${course.price.toFixed(2)}
                </span>
                <Link href={`/courses/${course.id}`}>
                    <Button size="sm" className="font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                        View Course
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
