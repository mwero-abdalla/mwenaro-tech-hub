"use client"

import Link from "next/link"
import { CheckCircle2, Lock, PlayCircle, ChevronLeft, Menu } from "lucide-react"
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

    const SidebarContent = () => (
        <div className="flex h-full flex-col border-r bg-muted/10">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href={`/courses/${course.id}`} className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="truncate">{course.title}</span>
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col gap-6 p-4">
                    {Object.entries(lessons.reduce((acc, lesson) => {
                        const phase = lesson.phase_title || 'Main Content'
                        if (!acc[phase]) acc[phase] = []
                        acc[phase].push(lesson)
                        return acc
                    }, {} as Record<string, typeof lessons>)).map(([phaseTitle, phaseLessons]) => (
                        <div key={phaseTitle} className="space-y-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-3">{phaseTitle}</h3>
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
                                                "group flex items-start gap-3 rounded-lg p-3 text-sm transition-all",
                                                isActive
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "hover:bg-muted",
                                                isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
                                            )}
                                        >
                                            <div className="mt-0.5 shrink-0">
                                                {lesson.isCompleted ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                ) : isLocked ? (
                                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <div className={cn(
                                                        "flex h-4 w-4 items-center justify-center rounded-full border text-[10px]",
                                                        isActive ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"
                                                    )}>
                                                        {index + 1}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="grid gap-1">
                                                <span className="leading-tight">{lesson.title}</span>
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
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden border-r bg-background lg:block lg:w-80 lg:shrink-0 lg:fixed lg:inset-y-0 lg:left-0 lg:z-10">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar Trigger */}
            <div className="sticky top-0 z-50 flex items-center gap-4 border-b bg-background px-4 py-3 lg:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="shrink-0 lg:hidden">
                            <Menu className="h-4 w-4 mr-2" />
                            Menu
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
                <div className="font-semibold truncate flex-1">{course.title}</div>
            </div>
        </>
    )
}
