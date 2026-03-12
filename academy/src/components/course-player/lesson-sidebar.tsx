"use client"

import { CheckCircle, Circle, Play, Clock, ChevronDown, ChevronUp, Lock, LayoutDashboard, LayoutList, PlayCircle } from "lucide-react"
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
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-lg text-zinc-900 dark:text-white truncate tracking-tight">{courseTitle}</h3>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg lg:hidden"
                    >
                        {isCollapsed ? <ChevronDown className="w-5 h-5 text-zinc-500" /> : <ChevronUp className="w-5 h-5 text-zinc-500" />}
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-black tracking-[0.2em] uppercase text-zinc-500">
                        <span>Course Completion</span>
                        <span className="text-primary">{Math.round(progressPercent)}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-1.5 bg-zinc-200 dark:bg-zinc-800 shadow-inner" />
                </div>
            </div>

            {/* Lessons List */}
            <ScrollArea className={cn("flex-1", isCollapsed && "hidden lg:block")}>
                <div className="p-4 space-y-4">
                    {/* Course Overview Link */}
                    <Link
                        href={`/courses/${courseId}`}
                        className={cn(
                            "flex items-start gap-3 p-4 rounded-2xl transition-all group border border-transparent",
                            "hover:bg-zinc-100 dark:hover:bg-zinc-900"
                        )}
                    >
                        <div className="mt-0.5">
                            <LayoutList className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">Course</p>
                            <p className="text-sm font-bold leading-tight text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                Overview
                            </p>
                        </div>
                    </Link>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-4 mx-2" />

                    <div className="space-y-1">
                        {lessons.map((lesson: Lesson, index: number) => {
                            const isCurrent = lesson.id === currentLessonId
                            const isCompleted = lesson.is_completed
                            const isLocked = lesson.is_locked && !isCompleted && !isCurrent

                            const content = (
                                <div className={cn(
                                    "w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all duration-300 group border border-transparent",
                                    isCurrent
                                        ? "bg-primary/10 border-primary/20 shadow-sm"
                                        : "hover:bg-zinc-100 dark:hover:bg-zinc-900",
                                    isLocked ? "opacity-40 grayscale cursor-not-allowed" : "cursor-pointer",
                                    isCompleted && !isCurrent && "bg-green-50/50 dark:bg-green-900/5"
                                )}>
                                    <div className="flex-shrink-0 mt-1">
                                        {isLocked ? (
                                            <Lock className="w-4 h-4 text-zinc-400" />
                                        ) : isCompleted ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : isCurrent ? (
                                            <PlayCircle className="w-4 h-4 text-primary animate-pulse" />
                                        ) : (
                                            <PlayCircle className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-0.5">Module {(index + 1).toString().padStart(2, '0')}</p>
                                        <p className={cn(
                                            "text-sm font-bold leading-tight",
                                            isCurrent ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300",
                                            isCompleted && "text-green-800 dark:text-green-400"
                                        )}>
                                            {lesson.title}
                                        </p>
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
                </div>
            </ScrollArea>

            {/* Footer Navigation */}
            <div className={cn("p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50", isCollapsed && "hidden lg:block")}>
                <Link href="/dashboard" className="flex items-center justify-center gap-2 p-4 w-full rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all text-sm font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:text-primary group">
                    <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Dashboard
                </Link>
            </div>
        </div>
    )
}
