import { getQuizSubmission } from '@/lib/progress'
import { getLessonQuestions } from '@/lib/lessons'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuizReview } from '@/components/quiz-review'
import { ArrowLeft, Calendar, Trophy, User } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'

export default async function QuizDetailPage({ params }: { params: { id: string } }) {
    const submission = await getQuizSubmission(params.id)
    if (!submission) notFound()

    const questions = await getLessonQuestions(submission.lesson_id)
    const courseId = submission.lessons?.phase_lessons?.[0]?.phases?.courses?.id || ''

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
            <Link href="/dashboard/quizzes">
                <Button variant="ghost" className="gap-2 font-bold mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Back to History
                </Button>
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
                        <Calendar className="w-4 h-4" />
                        Attempted on {format(new Date(submission.created_at), 'PPP p')}
                    </div>
                    <h1 className="text-4xl font-black tracking-tight uppercase leading-tight">
                        {submission.lessons?.title}
                    </h1>
                    <p className="text-muted-foreground text-lg flex items-center gap-2">
                        Detailed feedback for your quiz attempt.
                    </p>
                </div>

                <Card className={`p-6 bg-gradient-to-br ${submission.passed ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600'} text-white border-none shadow-xl shadow-primary/20`}>
                    <div className="text-center space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Final Score</div>
                        <div className="text-5xl font-black">{submission.score}%</div>
                        <div className="text-xs font-bold uppercase pt-2 bg-white/20 rounded-full px-3 inline-block">
                            {submission.passed ? 'PASSED' : 'FAILED'}
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="border-none shadow-xl bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden">
                <CardHeader className="bg-white dark:bg-zinc-900 border-b p-8">
                    <CardTitle className="text-2xl font-black uppercase">How you were marked</CardTitle>
                    <CardDescription className="text-base font-medium">Review each question to see the correct answers and explanations.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <QuizReview
                        questions={questions}
                        answers={submission.answers}
                        correctAnswers={questions.map(q => q.correct_answer)}
                    />
                </CardContent>
            </Card>

            <div className="flex justify-center pt-8">
                <Link href={`/courses/${courseId}/lessons/${submission.lesson_id}`}>
                    <Button size="lg" className="rounded-2xl px-12 h-14 font-black text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
                        {submission.passed ? 'Continue Learning' : 'Try Again'}
                    </Button>
                </Link>
            </div>
        </div>
    )
}
