'use client'

import { CheckCircle, Circle, Play, Clock, ChevronDown, ChevronUp, Lock } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Lesson {
    id: string
    title: string
    duration_minutes: number | null
    order_index?: number
    is_completed?: boolean
    is_locked?: boolean
}

interface LessonSidebarProps {
    courseId: string
    lessons: Lesson[]
    courseTitle: string
    completedCount: number
}

export function LessonSidebar({
    courseId,
    lessons,
    courseTitle,
    completedCount,
}: LessonSidebarProps) {
    const params = useParams()
    const currentLessonId = params.lessonId as string
    const [isCollapsed, setIsCollapsed] = useState(false)
    const progressPercent = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0

    return (
        <div className="bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-lg text-zinc-900 dark:text-white truncate">{courseTitle}</h3>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg lg:hidden"
                    >
                        {isCollapsed ? <ChevronDown className="w-5 h-5 text-zinc-500" /> : <ChevronUp className="w-5 h-5 text-zinc-500" />}
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold tracking-wider uppercase text-zinc-500">
                        <span>Progress</span>
                        <span className="text-primary">{Math.round(progressPercent)}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-2 bg-zinc-100 dark:bg-zinc-900" />
                    <p className="text-[10px] font-medium text-zinc-400 italic">
                        {completedCount} of {lessons.length} lessons completed
                    </p>
                </div>
            </div>

            {/* Lessons List */}
            <ScrollArea className={cn("flex-1", isCollapsed && "hidden lg:block")}>
                <div className="p-3 space-y-1">
                    {lessons.map((lesson: Lesson, index: number) => {
                        const isCurrent = lesson.id === currentLessonId
                        const isCompleted = lesson.is_completed
                        const isLocked = lesson.is_locked && !isCompleted && !isCurrent

                        const content = (
                            <div className={cn(
                                "w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all duration-200 group",
                                isCurrent
                                    ? "bg-primary/5 border border-primary/20 shadow-sm"
                                    : "hover:bg-zinc-100 dark:hover:bg-zinc-900",
                                isLocked ? "opacity-40 grayscale cursor-not-allowed" : "cursor-pointer",
                                isCompleted && !isCurrent && "bg-green-50/30 dark:bg-green-900/5"
                            )}>
                                <div className="flex-shrink-0 mt-0.5">
                                    {isLocked ? (
                                        <div className="p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                            <Lock className="w-4 h-4 text-zinc-400" />
                                        </div>
                                    ) : isCompleted ? (
                                        <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        </div>
                                    ) : isCurrent ? (
                                        <div className="p-1 bg-primary text-white rounded-lg animate-pulse">
                                            <Play className="w-4 h-4 fill-current" />
                                        </div>
                                    ) : (
                                        <div className="p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg group-hover:bg-primary/20 transition-colors">
                                            <Circle className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        "text-sm font-bold leading-tight",
                                        isCurrent ? "text-primary" : "text-zinc-700 dark:text-zinc-300",
                                        isCompleted && "text-green-700 dark:text-green-500"
                                    )}>
                                        {index + 1}. {lesson.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        {lesson.duration_minutes && (
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                                <Clock className="w-3 h-3" />
                                                <span>{lesson.duration_minutes}m</span>
                                            </div>
                                        )}
                                        {isCurrent && (
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Ongoing</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )

                        if (isLocked) {
                            return <div key={lesson.id}>{content}</div>
                        }

                        return (
                            <Link
                                key={lesson.id}
                                href={`/learn/${courseId}/${lesson.id}`}
                                className="block no-underline"
                            >
                                {content}
                            </Link>
                        )
                    })}
                </div>
            </ScrollArea>
        </div>
    )
}
