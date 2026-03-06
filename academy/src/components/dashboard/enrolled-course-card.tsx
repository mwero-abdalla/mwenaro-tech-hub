import Link from 'next/link'
import Image from 'next/image'
import { Progress } from "@/components/ui/progress"
import { PlayCircle, Award, BookOpen, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
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
    const isCompleted = progress === 100
    const href = isCompleted ? `/courses/${course.id}` : `/learn/${course.id}`

    return (
        <Link href={href} className="group block">
            <div className={cn(
                "relative rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white dark:bg-zinc-900",
                isCompleted
                    ? "border-green-200 dark:border-green-800/50"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-primary/30 dark:hover:border-primary/30"
            )}>
                {/* Thumbnail */}
                <div className="relative h-44 w-full bg-muted overflow-hidden">
                    {course.image_url ? (
                        <Image
                            src={course.image_url}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-purple-500/10">
                            <BookOpen className="h-14 w-14 text-primary/30" />
                        </div>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Completion badge */}
                    {isCompleted && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                        </div>
                    )}

                    {/* Level badge */}
                    {course.level && !isCompleted && (
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                            {course.level}
                        </div>
                    )}

                    {/* Progress % overlay at bottom */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                        <span className="text-white text-xs font-black drop-shadow">
                            {isCompleted ? "All done!" : `${progress}% complete`}
                        </span>
                        {averageQuizScore !== undefined && averageQuizScore > 0 && (
                            <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Quiz: {averageQuizScore}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    <div>
                        <h3 className="font-black text-base text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {course.title}
                        </h3>
                        {lastAccessed && (
                            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
                                Last accessed {lastAccessed}
                            </p>
                        )}
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                        <Progress
                            value={progress}
                            className={cn(
                                "h-2 rounded-full",
                                isCompleted ? "[&>div]:bg-green-500" : "[&>div]:bg-primary"
                            )}
                        />
                        <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                            <span>
                                {completedLessons !== undefined && totalLessons !== undefined
                                    ? `${completedLessons} of ${totalLessons} lessons`
                                    : `${progress}%`}
                            </span>
                            <span className="font-bold">{progress}%</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className={cn(
                        "flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-black transition-all",
                        isCompleted
                            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/30"
                            : "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white"
                    )}>
                        {isCompleted ? (
                            <>
                                <Award className="w-4 h-4" />
                                Review Course
                            </>
                        ) : (
                            <>
                                <PlayCircle className="w-4 h-4" />
                                Continue Learning
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
