import { getLesson, getCourseLessons, getLessonQuestions } from '@/lib/lessons'
import { getCourse } from '@/lib/courses'
import { hasEnrolled } from '@/lib/enrollment'
import { getLessonProgress, isLessonLocked } from '@/lib/progress'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { QuizModal } from '@/components/quiz-modal'
import { ProjectSubmission } from '@/components/project-submission'

interface LessonPageProps {
    params: Promise<{
        id: string
        lessonId: string
    }>
}

export default async function LessonPage({ params }: LessonPageProps) {
    const { id: courseId, lessonId } = await params

    // Check enrollment first
    const isEnrolled = await hasEnrolled(courseId)
    if (!isEnrolled) {
        redirect(`/courses/${courseId}`)
    }

    // Check locking logic
    const locked = await isLessonLocked(courseId, lessonId)
    if (locked) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">This lesson is locked</h1>
                <p className="text-muted-foreground mb-8">Please complete the previous lessons to unlock this content.</p>
                <Link href={`/courses/${courseId}`}>
                    <Button>Back to Course</Button>
                </Link>
            </div>
        )
    }

    const lesson = await getLesson(lessonId)
    if (!lesson) {
        notFound()
    }

    const course = await getCourse(courseId)
    const questions = await getLessonQuestions(lessonId)
    const progress = await getLessonProgress(lessonId)
    const allLessons = await getCourseLessons(courseId)

    // Determine Navigation
    const currentIndex = allLessons.findIndex(l => l.id === lessonId)
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

    const showNextButton = progress?.is_completed && nextLesson

    return (
        <div className="container py-8 px-4 max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <Link href={`/courses/${courseId}`} className="text-sm font-medium text-muted-foreground hover:text-primary">
                    &larr; Back to Course
                </Link>
                <div className="text-sm text-muted-foreground">
                    {course?.title}
                </div>
            </div>

            <article className="prose prose-slate dark:prose-invert max-w-none">
                <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
                <div className="p-6 border rounded-lg bg-card">
                    {/* In a real app, use react-markdown here */}
                    <p className="whitespace-pre-wrap">{lesson.content}</p>
                </div>
            </article>

            {/* Quiz Section */}
            {questions.length > 0 && (
                <div className="mt-8 border-t pt-8">
                    <h2 className="text-2xl font-bold mb-4">Lesson Quiz</h2>
                    {progress?.is_completed ? (
                        <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                            <p className="text-green-800 dark:text-green-300 font-medium">
                                Quiz Passed! Score: {progress.highest_quiz_score}%
                            </p>
                        </div>
                    ) : (
                        <QuizModal
                            lessonId={lesson.id}
                            questions={questions}
                        />
                    )}
                </div>
            )}

            {/* Project Section */}
            {lesson.has_project && (
                <div className="mt-8 border-t pt-8">
                    <ProjectSubmission
                        lessonId={lesson.id}
                        isCompleted={progress?.is_completed || false}
                        existingLink={progress?.project_repo_link}
                    />
                </div>
            )}

            {/* Navigation Footer */}
            <div className="mt-12 flex justify-between items-center border-t pt-8">
                {prevLesson ? (
                    <Link href={`/courses/${courseId}/lessons/${prevLesson.id}`}>
                        <Button variant="outline">Previous Lesson</Button>
                    </Link>
                ) : (
                    <Button variant="outline" disabled>Previous Lesson</Button>
                )}

                {showNextButton ? (
                    <Link href={`/courses/${courseId}/lessons/${nextLesson!.id}`}>
                        <Button>Next Lesson &rarr;</Button>
                    </Link>
                ) : (
                    <Button disabled title="Complete current lesson task to continue">
                        {progress?.is_completed ? 'No More Lessons' : 'Complete Task to Continue'}
                    </Button>
                )}
            </div>
        </div>
    )
}
