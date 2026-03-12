"use client"

import Link from "next/link"
import { CheckCircle2, Lock, PlayCircle, ChevronLeft, Menu, LayoutList, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { usePathname } from "next/navigation"

interface LessonSidebarProps {
    course: {
        id: string
        title: string
    }
    lessons: {
        id: string
        title: string
        isCompleted: boolean
        isLocked: boolean
        phase_id?: string
        phase_title?: string
    }[]
}

export function LessonSidebar({ course, lessons }: LessonSidebarProps) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    const isOverviewActive = pathname === `/courses/${course.id}`

    const SidebarContent = () => (
        <div className="flex h-full flex-col border-r bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-xl">
            <div className="flex h-20 items-center border-b px-6">
                <Link href="/courses" className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors font-bold text-sm">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Library
                </Link>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-none">
                <div className="space-y-8">
                    {/* Course Header in Sidebar */}
                    <div className="px-2 mb-4">
                        <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white line-clamp-2 leading-tight">
                            {course.title}
                        </h2>
                    </div>

                    <div className="space-y-2">
                        <Link
                            href={`/courses/${course.id}`}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "flex items-start gap-3 p-3 rounded-xl transition-all group border border-transparent",
                                isOverviewActive 
                                    ? "bg-primary/10 text-primary border-primary/20" 
                                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            )}
                        >
                            <div className="mt-0.5">
                                <LayoutList className={cn("w-4 h-4", isOverviewActive ? "text-primary" : "text-zinc-400")} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">Course</p>
                                <p className={cn("text-sm font-bold leading-tight", isOverviewActive ? "text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-400")}>
                                    Overview
                                </p>
                            </div>
                        </Link>

                        <div className="border-t border-zinc-100 dark:border-zinc-800 my-4 mx-2" />

                        {Object.entries(lessons.reduce((acc, lesson) => {
                            const phase = lesson.phase_title || 'Main Content'
                            if (!acc[phase]) acc[phase] = []
                            acc[phase].push(lesson)
                            return acc
                        }, {} as Record<string, typeof lessons>)).map(([phaseTitle, phaseLessons]) => (
                            <div key={phaseTitle} className="space-y-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-3 mb-2">{phaseTitle}</h3>
                                <div className="flex flex-col gap-1">
                                    {phaseLessons.map((lesson) => {
                                        const index = lessons.findIndex(l => l.id === lesson.id)
                                        const isActive = pathname.includes(lesson.id)
                                        const isLocked = lesson.isLocked && !lesson.isCompleted

                                        return (
                                            <Link
                                                key={lesson.id}
                                                href={isLocked ? "#" : `/courses/${course.id}/lessons/${lesson.id}`}
                                                onClick={() => setOpen(false)}
                                                className={cn(
                                                    "group flex items-start gap-3 rounded-xl p-3 text-sm transition-all border border-transparent",
                                                    isActive
                                                        ? "bg-primary/10 text-primary border-primary/20"
                                                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                                                    isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
                                                )}
                                            >
                                                <div className="mt-1 shrink-0">
                                                    {lesson.isCompleted ? (
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    ) : isLocked ? (
                                                        <Lock className="h-4 w-4 text-zinc-400" />
                                                    ) : (
                                                        <PlayCircle className={cn("h-4 w-4", isActive ? "text-primary" : "text-zinc-400")} />
                                                    )}
                                                </div>
                                                <div className="grid gap-0.5">
                                                    <span className={cn("text-xs font-black uppercase tracking-widest opacity-40")}>Module {(index + 1).toString().padStart(2, '0')}</span>
                                                    <span className={cn("font-bold leading-tight", isActive ? "text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-400")}>{lesson.title}</span>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden border-r bg-white dark:bg-zinc-950 lg:block lg:w-80 lg:shrink-0 lg:fixed lg:inset-y-0 lg:left-0 lg:z-10 shadow-xl shadow-black/5">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar Trigger */}
            <div className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-6 py-4 lg:hidden">
                <div className="flex items-center gap-3">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 lg:hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-80 p-0 border-none">
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                    <div className="font-black text-sm truncate tracking-tight">{course.title}</div>
                </div>
            </div>
        </>
    )
}
