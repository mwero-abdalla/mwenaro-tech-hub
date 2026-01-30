'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { HelpCircle } from 'lucide-react'
import { QuizEditor } from './quiz-editor'
import type { Lesson, Question } from '@/lib/lessons'

interface ManageQuizModalProps {
    lesson: Lesson
    questions: Question[]
}

export function ManageQuizModal({ lesson, questions }: ManageQuizModalProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:text-purple-600 transition-colors gap-2">
                    <HelpCircle size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Quiz ({questions.length})</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Manage Quiz: {lesson.title}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <QuizEditor lessonId={lesson.id} questions={questions} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
