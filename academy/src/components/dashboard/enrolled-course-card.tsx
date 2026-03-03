import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PlayCircle, Award, Clock } from "lucide-react"
import type { Course } from "@/lib/courses"

interface EnrolledCourseCardProps {
    course: Course
    progress: number
    lastAccessed?: string
    completedLessons?: number
    totalLessons?: number
    averageQuizScore?: number
}

export function EnrolledCourseCard({
    course,
    progress,
    lastAccessed,
    completedLessons,
    totalLessons,
    averageQuizScore
}: EnrolledCourseCardProps) {
    return (
        <Card className="overflow-hidden border-border hover:shadow-lg transition-shadow">
            <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-32 sm:h-auto bg-muted flex-shrink-0 relative">
                    {course.image_url ? (
                        <Image
                            src={course.image_url}
                            alt={course.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                            <PlayCircle className="h-12 w-12 text-primary/50" />
                        </div>
                    )}
                </div>

                <CardContent className="flex-1 p-4">
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                    {course.level && (
                                        <Badge variant="outline" className="mb-2 text-xs uppercase tracking-wider">
                                            {course.level}
                                        </Badge>
                                    )}
                                    <h3 className="font-semibold text-foreground text-lg line-clamp-2">
                                        {course.title}
                                    </h3>
                                </div>
                            </div>
                            {/* Placeholder for Last Accessed if we had it */}
                            {lastAccessed && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>Last accessed {lastAccessed}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground text-xs flex items-center gap-2">
                                        {progress === 100 ? "Completed" : `${progress}% Complete`}
                                        {completedLessons !== undefined && totalLessons !== undefined && (
                                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                                                {completedLessons}/{totalLessons} Lessons
                                            </span>
                                        )}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        {averageQuizScore !== undefined && averageQuizScore > 0 && (
                                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 text-[10px] h-5 py-0 px-1.5 font-bold border-green-200">
                                                {averageQuizScore}% Avg Quiz
                                            </Badge>
                                        )}
                                        <span className="font-medium text-foreground text-xs">{progress}%</span>
                                    </div>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>

                            <div className="flex gap-2">
                                <Button size="sm" className="w-full sm:w-auto text-xs" asChild>
                                    <Link href={progress === 100 ? `/courses/${course.id}` : `/learn/${course.id}`}>
                                        {progress === 100 ? (
                                            <>
                                                <Award className="mr-2 h-4 w-4" />
                                                Review Course
                                            </>
                                        ) : (
                                            <>
                                                <PlayCircle className="mr-2 h-4 w-4" />
                                                Continue Learning
                                            </>
                                        )}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    )
}
