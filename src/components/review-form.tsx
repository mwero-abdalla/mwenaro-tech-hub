'use client'

import { useState } from 'react'
import { reviewProject } from '@/lib/progress'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { useRouter } from 'next/navigation'

interface ReviewFormProps {
    userId: string
    lessonId: string
    existingRating?: number | null
    existingFeedback?: string | null
    isReviewed?: boolean
}

export function ReviewForm({
    userId,
    lessonId,
    existingRating,
    existingFeedback,
    isReviewed = false
}: ReviewFormProps) {
    const router = useRouter()
    const [rating, setRating] = useState(existingRating || 70)
    const [feedback, setFeedback] = useState(existingFeedback || '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            await reviewProject(lessonId, userId, rating, feedback)
            router.push('/instructor/dashboard')
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to submit review')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Slider */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold uppercase tracking-wider">
                        Project Rating
                    </label>
                    <span className="text-3xl font-black text-primary">{rating}/100</span>
                </div>
                <Slider
                    value={[rating]}
                    onValueChange={(value) => setRating(value[0])}
                    max={100}
                    min={0}
                    step={5}
                    disabled={isSubmitting || isReviewed}
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 - Needs Improvement</span>
                    <span>50 - Average</span>
                    <span>100 - Excellent</span>
                </div>
            </div>

            {/* Feedback Textarea */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-bold uppercase tracking-wider">
                        Feedback (Optional)
                    </label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setFeedback("Detailed code review:\n\n1. Project Structure: Well organized components structure.\n2. Logic: The implementation of hooks is correct and efficient.\n3. Styling: Good use of Tailwind utilities.\n\nSuggestion: Consider extracting the form logic into a custom hook for better reusability.\n\nGrade: Excellent work!");
                            setRating(95);
                        }}
                        disabled={isSubmitting || isReviewed}
                        className="text-xs flex items-center gap-1 border-primary/20 text-primary hover:bg-primary/5 font-bold uppercase tracking-tighter shadow-sm"
                    >
                        <span className="animate-pulse">✨</span> Generate AI Review
                    </Button>
                </div>
                <Textarea
                    placeholder="Provide constructive feedback to help the student improve..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    disabled={isSubmitting || isReviewed}
                    rows={6}
                    className="resize-none rounded-xl"
                />
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl">
                    <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                </div>
            )}

            {/* Submit Button */}
            {!isReviewed && (
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-lg font-bold shadow-lg"
                >
                    {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
                </Button>
            )}

            {isReviewed && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-xl text-center">
                    <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                        This project has already been reviewed. Students cannot update their submission after review.
                    </p>
                </div>
            )}
        </form>
    )
}
