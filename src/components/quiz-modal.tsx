'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import type { Question } from '@/lib/lessons'
import { submitQuiz } from '@/lib/progress'

import { useRouter } from 'next/navigation'

interface QuizModalProps {
    lessonId: string
    questions: Question[]
}

export function QuizModal({ lessonId, questions }: QuizModalProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [result, setResult] = useState<{ passed: boolean; score: number; message: string } | null>(null)

    const handleSubmit = async () => {
        if (answers.includes(-1)) {
            alert('Please answer all questions')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await submitQuiz(lessonId, answers)
            setResult({ passed: res.passed, score: res.score, message: res.message })
            if (res.passed) {
                setTimeout(() => {
                    setIsOpen(false)
                    router.refresh()
                }, 2000)
            }
        } catch (e) {
            console.error(e)
            alert('Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full">Take Quiz</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Quiz</DialogTitle>
                </DialogHeader>

                {!result ? (
                    <div className="space-y-6 py-4">
                        {questions.map((q, qIdx) => (
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
                                        <div key={optIdx} className="flex items-center space-x-2">
                                            <RadioGroupItem value={optIdx.toString()} id={`q${q.id}-opt${optIdx}`} />
                                            <Label htmlFor={`q${q.id}-opt${optIdx}`}>{opt}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        ))}
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                        </Button>
                    </div>
                ) : (
                    <div className="py-8 text-center space-y-4">
                        <div className={`text-2xl font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                            {result.message}
                        </div>
                        <div className="text-xl">Score: {result.score}%</div>
                        {!result.passed && (
                            <Button onClick={() => { setResult(null); setAnswers(new Array(questions.length).fill(-1)) }}>
                                Try Again
                            </Button>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
