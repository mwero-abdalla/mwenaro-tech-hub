'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { submitProject } from '@/lib/progress'

interface ProjectSubmissionProps {
    lessonId: string
    isCompleted: boolean
    existingLink?: string | null
}

export function ProjectSubmission({ lessonId, isCompleted, existingLink }: ProjectSubmissionProps) {
    const [repoLink, setRepoLink] = useState(existingLink || '')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!repoLink) return

        setIsSubmitting(true)
        try {
            await submitProject(lessonId, repoLink)
            alert('Project submitted successfully!')
        } catch (e) {
            console.error(e)
            alert('Failed to submit project')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isCompleted && existingLink) {
        return (
            <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900 rounded-lg">
                <h3 className="font-medium text-green-800 dark:text-green-300">Project Submitted</h3>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">Repo: <a href={existingLink} target="_blank" rel="noopener noreferrer" className="underline">{existingLink}</a></p>
            </div>
        )
    }

    return (
        <div className="p-6 border rounded-lg bg-card mt-8">
            <h3 className="text-xl font-bold mb-4">Final Project Submission</h3>
            <p className="text-muted-foreground mb-4">
                Please submit your GitHub repository link for this project.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-4">
                <Input
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={repoLink}
                    onChange={(e) => setRepoLink(e.target.value)}
                    required
                    className="flex-1"
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Project'}
                </Button>
            </form>
        </div>
    )
}
