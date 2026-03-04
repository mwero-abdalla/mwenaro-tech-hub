import { getCourseLessons, getLessonQuestions, getAllLessons } from '@/lib/lessons'
import { getCourse, getCoursePhases } from '@/lib/courses'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LessonForm } from '@/components/lesson-form'
import { SharedLessonForm } from '@/components/shared-lesson-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EditLessonModal } from '@/components/edit-lesson-modal'
import { ManageQuizModal } from '@/components/manage-quiz-modal'
import { ManagePhasesModal } from '@/components/manage-phases-modal'
import { removeLessonFromPhase } from '@/lib/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Trash2, Link as LinkIcon, Layers } from 'lucide-react'

interface LessonsPageProps {
    params: Promise<{ id: string }>
}

export default async function CourseLessonsPage({ params }: LessonsPageProps) {
    const { id: courseId } = await params
    const course = await getCourse(courseId)
    const phases = await getCoursePhases(courseId)
    const lessons = await getCourseLessons(courseId)
    const allLessons = await getAllLessons()

    if (!course) {
        notFound()
    }

    // Filter out lessons that are already in this course for the dropdown
    const availableLessons = allLessons.filter(l => !lessons.some(cl => cl.id === l.id))

    const lessonsWithQuestions = await Promise.all(lessons.map(async (lesson) => {
        const questions = await getLessonQuestions(lesson.id)
        return { ...lesson, questions }
    }))

    const nextOrderIndex = lessons.length > 0
        ? Math.max(...lessons.map(l => l.order_index || 0)) + 1
        : 1

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/courses">
                            <Button variant="ghost" size="sm" className="rounded-xl h-10 w-10 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                <span className="text-xl">←</span>
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">Curriculum Designer</h1>
                            <p className="text-zinc-500 font-medium mt-1">{course.title}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ManagePhasesModal courseId={courseId} phases={phases} />
                        <Link href={`/learn/${courseId}`}>
                            <Button variant="ghost" size="sm" className="font-bold text-primary">
                                Preview Live
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lessons List */}
                    <div className="lg:col-span-2 space-y-8">
                        {phases.length === 0 ? (
                            <Card className="p-12 text-center text-muted-foreground italic border-dashed">
                                No phases or lessons added to this course yet.
                            </Card>
                        ) : (
                            phases.map(phase => {
                                const phaseLessons = lessonsWithQuestions.filter(l => l.phase_id === phase.id)
                                return (
                                    <div key={phase.id} className="space-y-4 group/phase">
                                        <div className="flex items-center justify-between pb-3 border-b-2 border-zinc-100 dark:border-zinc-800 transition-colors group-hover/phase:border-primary/20">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover/phase:bg-primary/5 transition-colors">
                                                    <Layers className="w-5 h-5 text-zinc-400 group-hover/phase:text-primary transition-colors" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{phase.title}</h2>
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phase {phase.order_index}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                {phaseLessons.length} {phaseLessons.length === 1 ? 'Lesson' : 'Lessons'}
                                            </span>
                                        </div>
                                        {phaseLessons.length === 0 ? (
                                            <div className="p-8 text-center text-sm text-muted-foreground italic border border-dashed rounded-xl">
                                                No lessons in this phase.
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {phaseLessons.map(lesson => (
                                                    <Card key={lesson.id} className="p-4 flex justify-between items-center group hover:border-purple-300 transition-all shadow-sm">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold text-xs ring-1 ring-purple-200 dark:ring-purple-700">
                                                                {lesson.order_index}
                                                            </div>
                                                            <div>
                                                                <h3 className="text-base font-bold tracking-tight">{lesson.title}</h3>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    {lesson.has_project && (
                                                                        <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-sm">
                                                                            Project
                                                                        </span>
                                                                    )}
                                                                    <span className="text-[10px] text-muted-foreground font-mono">
                                                                        {lesson.content.length} chars
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <ManageQuizModal lesson={lesson} questions={lesson.questions} />
                                                            <EditLessonModal lesson={lesson} phases={phases} />
                                                            <form action={async () => {
                                                                'use server'
                                                                if (lesson.phase_id) await removeLessonFromPhase(courseId, lesson.phase_id, lesson.id)
                                                            }}>
                                                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all" title="Remove from course">
                                                                    <Trash2 size={16} />
                                                                </Button>
                                                            </form>
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-8 shadow-md ring-1 ring-black/5 dark:ring-white/5">
                            <Tabs defaultValue="new" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6 bg-purple-100/50 dark:bg-purple-900/20">
                                    <TabsTrigger value="new" className="text-xs font-bold data-[state=active]:bg-purple-600 data-[state=active]:text-white">New Lesson</TabsTrigger>
                                    <TabsTrigger value="existing" className="text-xs font-bold data-[state=active]:bg-purple-600 data-[state=active]:text-white">From Library</TabsTrigger>
                                </TabsList>
                                <TabsContent value="new">
                                    <LessonForm courseId={courseId} nextOrderIndex={nextOrderIndex} phases={phases} />
                                </TabsContent>
                                <TabsContent value="existing">
                                    <SharedLessonForm courseId={courseId} nextOrderIndex={nextOrderIndex} availableLessons={availableLessons} phases={phases} />
                                </TabsContent>
                            </Tabs>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
