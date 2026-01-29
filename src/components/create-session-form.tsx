'use client'

import { useState } from 'react'
import { createSession } from '@/lib/sessions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

interface CreateSessionFormProps {
    cohorts: { id: string; name: string }[]
}

export function CreateSessionForm({ cohorts }: CreateSessionFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const data = {
            cohort_id: formData.get('cohort_id') as string,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            start_time: formData.get('start_time') as string,
            duration_minutes: parseInt(formData.get('duration_minutes') as string),
            meeting_link: formData.get('meeting_link') as string
        }

        try {
            await createSession(data)
            const form = e.target as HTMLFormElement
            form.reset()
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to create session')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (cohorts.length === 0) {
        return (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                You are not assigned to any cohorts.
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-1 block">Cohort</label>
                <select
                    name="cohort_id"
                    required
                    className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {cohorts.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input name="title" required placeholder="e.g. React Hooks Deep Dive" />
            </div>

            <div>
                <label className="text-sm font-medium mb-1 block">Start Time</label>
                <Input type="datetime-local" name="start_time" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium mb-1 block">Duration (mins)</label>
                    <Input type="number" name="duration_minutes" defaultValue={60} min={15} required />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium mb-1 block">Meeting Link</label>
                <Input type="url" name="meeting_link" placeholder="https://meet.google.com/..." />
            </div>

            <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea name="description" placeholder="Optional details..." />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Scheduling...' : 'Schedule Session'}
            </Button>
        </form>
    )
}
