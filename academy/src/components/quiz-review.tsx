'use client'

import { CheckCircle2, XCircle } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import type { Question } from '@/lib/lessons'

interface QuizReviewProps {
    questions: Question[]
    answers: number[]
    correctAnswers: number[]
}

export function QuizReview({ questions, answers, correctAnswers }: QuizReviewProps) {
    return (
        <div className="space-y-6 py-4">
            {questions.map((q, qIdx) => {
                const userAnswer = answers[qIdx]
                const correctAnswer = correctAnswers[qIdx]
                const isCorrect = userAnswer === correctAnswer

                return (
                    <div key={q.id} className={`space-y-3 p-4 rounded-xl transition-colors ${isCorrect ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'}`}>
                        <div className="flex items-start justify-between gap-4">
                            <h3 className="font-medium text-lg">{qIdx + 1}. {q.question_text}</h3>
                            {isCorrect ?
                                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" /> :
                                <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                            }
                        </div>
                        <RadioGroup
                            disabled
                            value={userAnswer?.toString() ?? ""}
                        >
                            {q.options.map((opt, optIdx) => {
                                const isThisCorrect = optIdx === correctAnswer
                                const isThisWrongSelection = optIdx === userAnswer && !isCorrect

                                return (
                                    <div key={optIdx} className={`flex items-center space-x-2 p-2 rounded-lg ${isThisCorrect ? 'bg-green-100 dark:bg-green-900/30' : ''} ${isThisWrongSelection ? 'bg-red-100 dark:bg-red-900/30' : ''}`}>
                                        <RadioGroupItem value={optIdx.toString()} id={`review-q${q.id}-opt${optIdx}`} />
                                        <Label
                                            htmlFor={`review-q${q.id}-opt${optIdx}`}
                                            className={`flex-1 ${isThisCorrect ? 'font-bold text-green-700 dark:text-green-400' : ''} ${isThisWrongSelection ? 'text-red-700 dark:text-red-400' : ''}`}
                                        >
                                            {opt}
                                            {isThisCorrect && <span className="ml-2 text-xs font-normal">(Correct Answer)</span>}
                                        </Label>
                                    </div>
                                )
                            })}
                        </RadioGroup>
                        {q.explanation && (
                            <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg text-sm italic">
                                <strong>Explanation:</strong> {q.explanation}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
