'use client'

import { useState } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, FileJson, Edit2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createQuestion, updateQuestion, deleteQuestion, createQuestionsBulk, deleteAllQuestions } from '@/lib/admin'
import type { Question } from '@/lib/lessons'
import { useRouter } from 'next/navigation'

interface QuizEditorProps {
    lessonId: string
    questions: Question[]
}

export function QuizEditor({ lessonId, questions }: QuizEditorProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isBulkImporting, setIsBulkImporting] = useState(false)
    const [bulkJson, setBulkJson] = useState('')

    const [questionForm, setQuestionForm] = useState({
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        explanation: ''
    })

    const handleAddOrUpdateQuestion = async () => {
        if (!questionForm.question_text || questionForm.options.some(opt => !opt)) {
            alert('Please fill in the question and all options')
            return
        }

        setIsSubmitting(true)
        try {
            if (editingId) {
                await updateQuestion(editingId, questionForm)
                setEditingId(null)
            } else {
                await createQuestion({
                    lesson_id: lessonId,
                    ...questionForm
                })
            }
            setQuestionForm({ question_text: '', options: ['', '', '', ''], correct_answer: 0, explanation: '' })
            setIsAdding(false)
            router.refresh()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBulkImport = async () => {
        try {
            const data = JSON.parse(bulkJson)
            if (!Array.isArray(data)) throw new Error('Input must be a JSON array')

            const formatted = data.map((q: any) => ({
                question_text: q.question || q.question_text,
                options: q.options,
                correct_answer: q.correctIndex !== undefined ? q.correctIndex : q.correct_answer,
                explanation: q.explanation || q.explanation_text
            }))

            setIsSubmitting(true)
            await createQuestionsBulk(lessonId, formatted)
            setBulkJson('')
            setIsBulkImporting(false)
            router.refresh()
        } catch (error: any) {
            alert('Invalid JSON or error importing: ' + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteQuestion = async (id: string) => {
        if (!confirm('Are you sure you want to delete this question?')) return
        try {
            await deleteQuestion(id)
            router.refresh()
        } catch (error: any) {
            alert(error.message)
        }
    }

    const handleDeleteAll = async () => {
        if (!confirm('CRITICAL: Are you sure you want to delete ALL questions for this lesson? This cannot be undone.')) return
        setIsSubmitting(true)
        try {
            await deleteAllQuestions(lessonId)
            router.refresh()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const startEditing = (q: Question) => {
        setEditingId(q.id)
        setQuestionForm({
            question_text: q.question_text,
            options: [...q.options],
            correct_answer: q.correct_answer,
            explanation: q.explanation || ''
        })
        setIsAdding(true)
        setIsBulkImporting(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-purple-600">Quiz Questions ({questions.length})</h3>
                    {questions.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-1 text-[10px] font-black uppercase tracking-tighter"
                            onClick={handleDeleteAll}
                            disabled={isSubmitting}
                        >
                            <AlertTriangle size={12} />
                            Delete All
                        </Button>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setIsBulkImporting(!isBulkImporting)
                            setIsAdding(false)
                            setEditingId(null)
                        }}
                        className="gap-2 text-xs font-bold uppercase"
                    >
                        <FileJson size={14} />
                        {isBulkImporting ? 'Cancel' : 'Bulk Import'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (isAdding && editingId) {
                                setEditingId(null)
                                setQuestionForm({ question_text: '', options: ['', '', '', ''], correct_answer: 0, explanation: '' })
                            } else {
                                setIsAdding(!isAdding)
                            }
                            setIsBulkImporting(false)
                        }}
                        className="gap-2 text-xs font-bold uppercase"
                    >
                        {isAdding ? 'Cancel' : <><Plus size={14} /> Add Question</>}
                    </Button>
                </div>
            </div>

            {isBulkImporting && (
                <Card className="p-4 border-2 border-purple-200 dark:border-purple-900 bg-purple-50/30 dark:bg-purple-900/10 space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">JSON Array Input</Label>
                        <Textarea
                            placeholder='[ { "question": "...", "options": [...], "correctIndex": 0, "explanation": "..." } ]'
                            value={bulkJson}
                            onChange={(e) => setBulkJson(e.target.value)}
                            rows={10}
                            className="font-mono text-xs"
                        />
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleBulkImport} disabled={isSubmitting || !bulkJson}>
                        {isSubmitting ? 'Importing...' : 'Start Bulk Import'}
                    </Button>
                </Card>
            )}

            {isAdding && (
                <Card className={`p-4 border-2 ${editingId ? 'border-blue-200 dark:border-blue-900 bg-blue-50/30' : 'border-purple-200 dark:border-purple-900 bg-purple-50/30 dark:bg-purple-900/10'}`}>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                {editingId ? 'Edit Question' : 'New Question'}
                            </Label>
                            {editingId && (
                                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase">Editing Mode</span>
                            )}
                        </div>
                        <div>
                            <Input
                                value={questionForm.question_text}
                                onChange={e => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                                placeholder="Question text..."
                                className="mt-1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Options (Select Correct Answer)</Label>
                            {questionForm.options.map((opt, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={questionForm.correct_answer === i ? "text-green-600" : "text-muted-foreground"}
                                        onClick={() => setQuestionForm({ ...questionForm, correct_answer: i })}
                                    >
                                        {questionForm.correct_answer === i ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                    </Button>
                                    <Input
                                        value={opt}
                                        onChange={e => {
                                            const newOptions = [...questionForm.options]
                                            newOptions[i] = e.target.value
                                            setQuestionForm({ ...questionForm, options: newOptions })
                                        }}
                                        placeholder={`Option ${i + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Explanation (Optional)</Label>
                            <Textarea
                                value={questionForm.explanation}
                                onChange={e => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                                placeholder="Explain why this is the correct answer..."
                                rows={2}
                                className="mt-1"
                            />
                        </div>
                        <Button className={`w-full ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}`} onClick={handleAddOrUpdateQuestion} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : editingId ? 'Update Question' : 'Save Question'}
                        </Button>
                    </div>
                </Card>
            )}

            <div className="space-y-3">
                {questions.length === 0 && !isAdding && !isBulkImporting && (
                    <p className="text-center text-muted-foreground py-8 border border-dashed rounded-xl">
                        No questions added yet.
                    </p>
                )}
                {questions.map((q, idx) => (
                    <Card key={q.id} className="p-4 group relative overflow-hidden">
                        {editingId === q.id && (
                            <div className="absolute inset-0 bg-blue-50/20 pointer-events-none border-l-4 border-blue-500" />
                        )}
                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-purple-600 bg-purple-100 dark:bg-purple-900/40 px-1.5 py-0.5 rounded">Q{idx + 1}</span>
                                    <h4 className="font-bold text-sm">{q.question_text}</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pl-6">
                                    {q.options.map((opt, i) => (
                                        <div key={i} className={`text-xs p-2 rounded border ${q.correct_answer === i ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 font-bold' : 'bg-muted/30 border-transparent'}`}>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                                {q.explanation && (
                                    <p className="text-[10px] text-muted-foreground italic pl-6 mt-2 border-l-2 border-purple-200 ml-1">
                                        <span className="font-bold uppercase tracking-tighter mr-1">Exp:</span>
                                        {q.explanation}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                    onClick={() => startEditing(q)}
                                >
                                    <Edit2 size={14} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDeleteQuestion(q.id)}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
