'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Layers, Plus, Trash2, Save, X } from 'lucide-react'
import { createPhase, updatePhase, deletePhase } from '@/lib/admin'
import { CoursePhase } from '@/lib/courses'
import { toast } from 'sonner'

interface ManagePhasesModalProps {
    courseId: string
    phases: CoursePhase[]
}

export function ManagePhasesModal({ courseId, phases }: ManagePhasesModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [newPhaseTitle, setNewPhaseTitle] = useState('')
    const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleCreatePhase = async () => {
        if (!newPhaseTitle.trim()) return
        setIsSubmitting(true)
        try {
            await createPhase(courseId, newPhaseTitle)
            setNewPhaseTitle('')
            toast.success('Phase created successfully')
        } catch (error: any) {
            toast.error(error.message || 'Failed to create phase')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdatePhase = async (id: string) => {
        if (!editTitle.trim()) return
        setIsSubmitting(true)
        try {
            await updatePhase(id, { title: editTitle })
            setEditingPhaseId(null)
            toast.success('Phase updated successfully')
        } catch (error: any) {
            toast.error(error.message || 'Failed to update phase')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeletePhase = async (id: string) => {
        if (!confirm('Are you sure you want to delete this phase? It must be empty.')) return
        setIsSubmitting(true)
        try {
            await deletePhase(id)
            toast.success('Phase deleted successfully')
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete phase')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="font-bold border-zinc-200 dark:border-zinc-800">
                    <Layers className="w-4 h-4 mr-2" />
                    Manage Phases
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black">Course Phases</DialogTitle>
                    <DialogDescription className="font-medium">
                        Organize your curriculum into logical sections or chapters.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Create New Phase */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="New phase title (e.g. Getting Started)"
                            value={newPhaseTitle}
                            onChange={(e) => setNewPhaseTitle(e.target.value)}
                            className="rounded-xl"
                            onKeyDown={(e) => e.key === 'Enter' && handleCreatePhase()}
                        />
                        <Button
                            onClick={handleCreatePhase}
                            disabled={isSubmitting || !newPhaseTitle.trim()}
                            className="bg-primary hover:bg-primary/90 rounded-xl px-3"
                        >
                            <Plus className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Phases List */}
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {phases.length === 0 ? (
                            <p className="text-center text-zinc-500 italic py-8">No phases created yet.</p>
                        ) : (
                            phases.map((phase) => (
                                <div
                                    key={phase.id}
                                    className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 group border border-zinc-100 dark:border-zinc-800 transition-all hover:border-primary/30"
                                >
                                    {editingPhaseId === phase.id ? (
                                        <div className="flex items-center gap-2 flex-1 mr-2">
                                            <Input
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="h-9 rounded-lg"
                                                autoFocus
                                                onKeyDown={(e) => e.key === 'Enter' && handleUpdatePhase(phase.id)}
                                            />
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                onClick={() => handleUpdatePhase(phase.id)}
                                            >
                                                <Save className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-zinc-400"
                                                onClick={() => setEditingPhaseId(null)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-md bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                                                    {phase.order_index}
                                                </div>
                                                <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
                                                    {phase.title}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 px-2 text-zinc-500 font-bold text-xs"
                                                    onClick={() => {
                                                        setEditingPhaseId(phase.id)
                                                        setEditTitle(phase.title)
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                                                    onClick={() => handleDeletePhase(phase.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="pt-2 text-[10px] text-zinc-400 font-medium text-center">
                    Note: To delete a phase, you must first remove or move all lessons within it.
                </div>
            </DialogContent>
        </Dialog>
    )
}
