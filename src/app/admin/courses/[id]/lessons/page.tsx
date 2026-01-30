import { getCourseLessons, getLessonQuestions } from '@/lib/lessons'
import { getCourse } from '@/lib/courses'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LessonForm } from '@/components/lesson-form'
import { EditLessonModal } from '@/components/edit-lesson-modal'
import { ManageQuizModal } from '@/components/manage-quiz-modal'
import { deleteLesson } from '@/lib/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'

interface LessonsPageProps {
    params: Promise<{ id: string }>
}

export default async function CourseLessonsPage({ params }: LessonsPageProps) {
    const { id: courseId } = await params
    const course = await getCourse(courseId)
    const lessons = await getCourseLessons(courseId)

    if (!course) {
        notFound()
    }

    const lessonsWithQuestions = await Promise.all(lessons.map(async (lesson) => {
        const questions = await getLessonQuestions(lesson.id)
        return { ...lesson, questions }
    }))

    const nextOrderIndex = lessons.length > 0
        ? Math.max(...lessons.map(l => l.order_index)) + 1
        : 1

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/courses">
                        <Button variant="ghost" size="sm">← Back</Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-purple-600 dark:text-purple-400 tracking-tight">Curriculum Designer</h1>
                        <p className="text-muted-foreground font-medium">{course.title}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lessons List */}
                    <div className="lg:col-span-2 space-y-4">
                        {lessons.length === 0 ? (
                            <Card className="p-12 text-center text-muted-foreground italic border-dashed">
                                No lessons added to this course yet.
                            </Card>
                        ) : (
                            lessonsWithQuestions.map(lesson => (
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
                                        <EditLessonModal lesson={lesson} />
                                        <form action={async () => {
                                            'use server'
                                            await deleteLesson(lesson.id)
                                        }}>
                                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all">
                                                <Trash2 size={16} />
                                            </Button>
                                        </form>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Add Lesson Form */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-8 shadow-md ring-1 ring-black/5 dark:ring-white/5">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-purple-600">
                                <span className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/40">+</span>
                                Add New Lesson
                            </h2>
                            <LessonForm courseId={courseId} nextOrderIndex={nextOrderIndex} />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
