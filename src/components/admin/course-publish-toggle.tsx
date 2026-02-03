'use client'

import { useState } from 'react'
import { updateCourse } from '@/lib/admin'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CoursePublishToggleProps {
    courseId: string
    initialIsPublished: boolean
}

export function CoursePublishToggle({ courseId, initialIsPublished }: CoursePublishToggleProps) {
    const [isPublished, setIsPublished] = useState(initialIsPublished)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleToggle = async (checked: boolean) => {
        setIsPublished(checked) // Optimistic update
        setIsLoading(true)

        try {
            await updateCourse(courseId, { is_published: checked })
            toast.success(checked ? 'Course published' : 'Course unpublished')
            router.refresh()
        } catch (error) {
            setIsPublished(!checked) // Revert on error
            toast.error('Failed to update status')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <Switch
                checked={isPublished}
                onCheckedChange={handleToggle}
                disabled={isLoading}
            />
            <span className="text-sm font-medium text-muted-foreground w-16">
                {isPublished ? 'Published' : 'Draft'}
            </span>
        </div>
    )
}
