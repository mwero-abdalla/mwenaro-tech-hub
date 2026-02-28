'use client'

import { useState } from 'react'
import { assignSharedLesson } from '@/lib/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import type { Lesson } from '@/lib/lessons'
import type { CoursePhase } from '@/lib/courses'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SharedLessonFormProps {
    courseId: string
    nextOrderIndex: number
    availableLessons: Lesson[]
    phases: CoursePhase[]
}

export function SharedLessonForm({ courseId, nextOrderIndex, availableLessons, phases }: SharedLessonFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedLessonId, setSelectedLessonId] = useState<string>('')
    const [phaseId, setPhaseId] = useState<string>(phases.length > 0 ? phases[0].id : '')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!selectedLessonId) {
            setError('Please select a lesson to add')
            return
        }

        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const orderIndex = parseInt(formData.get('order_index') as string)

        try {
            await assignSharedLesson(courseId, phaseId, selectedLessonId, orderIndex)
            router.refresh()
            setSelectedLessonId('')
            const form = e.target as HTMLFormElement
            form.reset()
        } catch (err: any) {
            setError(err.message || 'Failed to assign lesson')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-1 block">Course Phase</label>
                <Select value={phaseId} onValueChange={setPhaseId} required>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a phase" />
                    </SelectTrigger>
                    <SelectContent>
                        {phases.map((phase) => (
                            <SelectItem key={phase.id} value={phase.id}>
                                {phase.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="text-sm font-medium mb-1 block">Select Existing Lesson</label>
                <Select value={selectedLessonId} onValueChange={setSelectedLessonId}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Search library..." />
                    </SelectTrigger>
                    <SelectContent>
                        {availableLessons.map((lesson) => (
                            <SelectItem key={lesson.id} value={lesson.id}>
                                {lesson.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                    This will link the selected lesson to this course. Any changes made to it will reflect everywhere.
                </p>
            </div>

            <div>
                <label className="text-sm font-medium mb-1 block">Order Index</label>
                <Input type="number" name="order_index" defaultValue={nextOrderIndex} required />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 font-bold h-12 shadow-lg shadow-purple-500/10" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Required Lesson'}
            </Button>
        </form>
    )
}
