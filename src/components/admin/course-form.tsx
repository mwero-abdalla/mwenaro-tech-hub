'use client'

import { useState } from 'react'
import { createCourse, updateCourse } from '@/lib/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { Course } from '@/lib/courses'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { toast } from 'sonner'

interface CourseFormProps {
    courseId?: string
    initialData?: Partial<Course>
    onSuccess?: () => void
}

export function CourseForm({ courseId, initialData, onSuccess }: CourseFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isEditing = !!courseId

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const data = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            price: parseFloat(formData.get('price') as string),
            image_url: formData.get('image_url') as string || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
            category: formData.get('category') as string,
            level: formData.get('level') as string,
            // Preserve existing fields if editing
            ...(isEditing ? {} : { is_published: false })
        }

        try {
            if (isEditing && courseId) {
                await updateCourse(courseId, data)
                toast.success('Course updated successfully')
            } else {
                await createCourse(data)
                toast.success('Course created successfully')
            }

            const form = e.target as HTMLFormElement
            form.reset()
            router.refresh()
            if (onSuccess) onSuccess()
        } catch (err: any) {
            setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} course`)
            toast.error(err.message || 'Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
                <label className="text-sm font-medium mb-1 block">Course Title</label>
                <Input
                    name="title"
                    placeholder="e.g. Master React.js"
                    defaultValue={initialData?.title}
                    required
                />
            </div>
            <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                    name="description"
                    placeholder="What will they learn?"
                    defaultValue={initialData?.description}
                    required
                    rows={4}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium mb-1 block">Price (KSh)</label>
                    <Input
                        type="number"
                        name="price"
                        defaultValue={initialData?.price ?? 16000}
                        step="any"
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1 block">Level</label>
                    <Select name="level" required defaultValue={initialData?.level || "Beginner"}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select name="category" required defaultValue={initialData?.category || "Web Development"}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                        <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                        <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                        <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="text-sm font-medium mb-1 block">Image URL (Optional)</label>
                <Input
                    name="image_url"
                    placeholder="https://..."
                    defaultValue={initialData?.image_url}
                />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 font-bold" disabled={isSubmitting}>
                {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Course' : 'Create Course')}
            </Button>
        </form>
    )
}
