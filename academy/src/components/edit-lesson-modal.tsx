'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { LessonForm } from './lesson-form'
import type { Lesson } from '@/lib/lessons'
import { Edit2 } from 'lucide-react'

interface EditLessonModalProps {
    lesson: Lesson
    phases: any[]
}

export function EditLessonModal({ lesson, phases }: EditLessonModalProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:text-purple-600 transition-colors">
                    <Edit2 size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Lesson: {lesson.title}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <LessonForm
                        courseId={lesson.course_id || ""}
                        initialData={lesson}
                        phases={phases}
                        onSuccess={() => setIsOpen(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
