'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import type { Question } from '@/lib/lessons'
import { submitQuiz } from '@/lib/progress'

import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle } from 'lucide-react'
import { QuizReview } from './quiz-review'

interface QuizModalProps {
    lessonId: string
    questions: Question[]
    initialProgress?: {
        highest_quiz_score: number
        quiz_attempts: number
    }
}

export function QuizModal({ lessonId, questions, initialProgress }: QuizModalProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [result, setResult] = useState<{ passed: boolean; score: number; message: string } | null>(null)
    const [correctAnswers, setCorrectAnswers] = useState<number[] | null>(null)
    const [showReview, setShowReview] = useState(false)

    const hasTaken = (initialProgress?.quiz_attempts || 0) > 0
    const highestScore = initialProgress?.highest_quiz_score || 0

    const handleSubmit = async () => {
        if (answers.includes(-1)) {
            alert('Please answer all questions')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await submitQuiz(lessonId, answers)
            setResult({ passed: res.passed, score: res.score, message: res.message })
            if (res.correctAnswers) {
                setCorrectAnswers(res.correctAnswers)
            }
            if (res.passed) {
                setTimeout(() => {
                    if (!showReview) {
                        setIsOpen(false)
                        router.refresh()
                    }
                }, 3000)
            }
        } catch (e) {
            console.error(e)
            alert('Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetQuiz = () => {
        setResult(null)
        setAnswers(new Array(questions.length).fill(-1))
        setCorrectAnswers(null)
        setShowReview(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) resetQuiz()
        }}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full">
                    {!hasTaken ? 'Take Quiz' : `Retake Quiz (Best: ${highestScore}%)`}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{showReview ? 'Quiz Review' : 'Quiz'}</DialogTitle>
                </DialogHeader>

                {(!result || showReview) ? (
                    <div className="space-y-6 py-4">
                        {!showReview ? (
                            questions.map((q, qIdx) => (
                                <div key={q.id} className="space-y-3">
                                    <h3 className="font-medium text-lg">{qIdx + 1}. {q.question_text}</h3>
                                    <RadioGroup
                                        onValueChange={(val) => {
                                            const newAnswers = [...answers]
                                            newAnswers[qIdx] = parseInt(val)
                                            setAnswers(newAnswers)
                                        }}
                                    >
                                        {q.options.map((opt, optIdx) => (
                                            <div key={optIdx} className="flex items-center space-x-2 p-2">
                                                <RadioGroupItem value={optIdx.toString()} id={`q${q.id}-opt${optIdx}`} />
                                                <Label htmlFor={`q${q.id}-opt${optIdx}`} className="cursor-pointer flex-1">{opt}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            ))
                        ) : (
                            <QuizReview
                                questions={questions}
                                answers={answers}
                                correctAnswers={correctAnswers!}
                            />
                        )}

                        {!showReview ? (
                            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                            </Button>
                        ) : (
                            <Button onClick={() => setIsOpen(false)} className="w-full">
                                Close Review
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="py-8 text-center space-y-4">
                        <div className={`text-2xl font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                            {result.message}
                        </div>
                        <div className="text-xl">Score: {result.score}%</div>

                        <div className="flex flex-col gap-2 pt-4">
                            {correctAnswers && (
                                <Button variant="outline" onClick={() => setShowReview(true)}>
                                    Review Answers
                                </Button>
                            )}
                            {!result.passed && (
                                <Button onClick={resetQuiz}>
                                    Try Again
                                </Button>
                            )}
                            {result.passed && (
                                <Button variant="ghost" onClick={() => setIsOpen(false)}>
                                    Continue
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
