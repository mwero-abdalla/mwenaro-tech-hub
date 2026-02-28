'use client'

import { useState } from 'react'
import { createLesson, updateLesson } from '@/lib/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import type { Lesson } from '@/lib/lessons'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CoursePhase } from '@/lib/courses'

interface LessonFormProps {
    courseId: string
    initialData?: Lesson
    nextOrderIndex?: number
    phases: CoursePhase[]
    onSuccess?: () => void
}

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function LessonForm({ courseId, initialData, nextOrderIndex, phases, onSuccess }: LessonFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [previewMode, setPreviewMode] = useState(false)
    const [content, setContent] = useState(initialData?.content || '')
    const [phaseId, setPhaseId] = useState<string>(initialData?.phase_id || (phases.length > 0 ? phases[0].id : ''))

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const data = {
            course_id: courseId,
            phase_id: phaseId,
            title: formData.get('title') as string,
            content: content,
            video_url: formData.get('video_url') as string,
            order_index: parseInt(formData.get('order_index') as string),
            has_project: formData.get('has_project') === 'on'
        }

        try {
            if (initialData) {
                await updateLesson(initialData.id, data)
            } else {
                await createLesson(data)
            }

            if (!initialData) {
                const form = e.target as HTMLFormElement
                form.reset()
                setContent('')
            }

            router.refresh()
            onSuccess?.()
        } catch (err: any) {
            setError(err.message || 'Failed to save lesson')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
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
                    <label className="text-sm font-medium mb-1 block">Lesson Title</label>
                    <Input name="title" defaultValue={initialData?.title} placeholder="e.g. Intro to Hooks" required />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1 block">Order Index</label>
                    <Input type="number" name="order_index" defaultValue={initialData?.order_index ?? nextOrderIndex} required />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium mb-1 block">Video URL (YouTube, Vimeo, etc.)</label>
                <Input name="video_url" defaultValue={initialData?.video_url} placeholder="e.g. https://www.youtube.com/watch?v=..." />
            </div>

            <div>
                <label className="text-sm font-medium mb-1 block flex items-center gap-2">
                    <input type="checkbox" name="has_project" defaultChecked={initialData?.has_project} className="w-4 h-4" />
                    <span>Requires Project Submission</span>
                </label>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                        Content ({previewMode ? 'Preview' : 'Editor'})
                    </label>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewMode(!previewMode)}
                        className="text-[10px] h-6 px-2 font-bold uppercase"
                    >
                        {previewMode ? 'Edit' : 'Preview'}
                    </Button>
                </div>

                {previewMode ? (
                    <div className="p-4 border rounded-xl bg-muted/30 prose prose-sm dark:prose-invert max-w-none min-h-[300px] max-h-[500px] overflow-y-auto">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                    </div>
                ) : (
                    <Textarea
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Structure your lesson with beautiful Markdown..."
                        required
                        rows={12}
                        className="font-mono text-sm leading-relaxed rounded-xl focus-visible:ring-purple-500"
                    />
                )}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 font-bold h-12 shadow-lg shadow-purple-500/10" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : initialData ? 'Update Lesson' : 'Create Lesson'}
            </Button>
        </form>
    )
}
