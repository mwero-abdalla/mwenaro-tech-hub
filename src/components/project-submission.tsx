'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { submitProject } from '@/lib/progress'

interface ProjectSubmissionProps {
    lessonId: string
    isCompleted: boolean
    existingLink?: string | null
    quizRequired?: boolean
    quizPassed?: boolean
}

export function ProjectSubmission({
    lessonId,
    isCompleted,
    existingLink,
    quizRequired = false,
    quizPassed = false
}: ProjectSubmissionProps) {
    const [repoLink, setRepoLink] = useState(existingLink || '')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isLocked = quizRequired && !quizPassed

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!repoLink || isLocked) return

        setIsSubmitting(true)
        try {
            await submitProject(lessonId, repoLink)
            // Redirect or refresh is handled by the page revalidation
        } catch (e) {
            console.error(e)
            alert('Failed to submit project')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isCompleted && existingLink) {
        return (
            <div className="p-6 bg-green-50 dark:bg-green-900/10 border-2 border-green-200 dark:border-green-900/30 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-500 text-white p-1 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 className="font-bold text-green-800 dark:text-green-300">Project Submitted Successfully</h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-400">
                    <span className="font-medium">Link:</span> <a href={repoLink} target="_blank" rel="noopener noreferrer" className="underline break-all hover:text-green-600 transition-colors">{repoLink}</a>
                </p>
                <p className="text-xs text-green-600/70 mt-2 italic">You can update the link below if needed.</p>
            </div>
        )
    }

    return (
        <div className={`p-8 border-2 rounded-2xl bg-card shadow-lg transition-all ${isLocked ? 'opacity-75 grayscale-[0.5]' : ''}`}>
            <h3 className="text-2xl font-black mb-2 tracking-tight">Project Submission</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
                Submit your project to complete this lesson. We accept **public GitHub repositories**, **Google Docs**, or any other **publicly accessible link**.
            </p>

            {isLocked ? (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl mb-6 flex items-start gap-3">
                    <span className="text-xl">🔒</span>
                    <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                        Please pass the lesson quiz first to unlock project submission.
                    </p>
                </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">
                        Public Link
                    </label>
                    <Input
                        type="url"
                        placeholder="https://github.com/yourname/project or https://docs.google.com/..."
                        value={repoLink}
                        onChange={(e) => setRepoLink(e.target.value)}
                        required
                        disabled={isLocked || isSubmitting}
                        className="h-12 rounded-xl border-primary/10 focus-visible:ring-primary shadow-inner"
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isLocked || isSubmitting || !repoLink}
                    className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98]"
                >
                    {isSubmitting ? 'Submitting...' : isCompleted ? 'Update Submission' : 'Submit Project'}
                </Button>
            </form>
        </div>
    )
}
