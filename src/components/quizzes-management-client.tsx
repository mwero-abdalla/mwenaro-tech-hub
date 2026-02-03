'use client'

import { useState } from 'react'
import { QuizSubmission } from '@/lib/progress'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    CheckCircle2,
    XCircle,
    Search,
    ChevronRight,
    ArrowLeft,
    Clock
} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'

export function QuizzesManagementClient({ initialSubmissions }: { initialSubmissions: QuizSubmission[] }) {
    const [searchQuery, setSearchQuery] = useState('')

    const filtered = initialSubmissions.filter(s =>
        (s.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.lessons?.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.lessons?.courses?.title.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        placeholder="Filter by student, lesson or course..."
                        className="pl-10 h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/50 shadow-2xl shadow-zinc-200/50 dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                                <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Student Identity</th>
                                <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Lesson / Course</th>
                                <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Result</th>
                                <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Attempt Date</th>
                                <th className="text-right p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-zinc-500 italic">
                                        No quiz submissions found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((s) => (
                                    <tr key={s.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {s.profiles?.email?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{s.profiles?.full_name || 'Anonymous'}</p>
                                                    <p className="text-sm text-zinc-500 font-medium">{s.profiles?.email || 'No email'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-primary uppercase tracking-tight">{s.lessons?.courses?.title || 'Unknown Course'}</p>
                                                <p className="text-sm text-zinc-500 font-medium line-clamp-1">{s.lessons?.title}</p>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <span className={`text-lg font-black ${s.passed ? 'text-green-500' : 'text-red-500'}`}>
                                                        {s.score}%
                                                    </span>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${s.passed ? 'text-green-500/60' : 'text-red-500/60'}`}>
                                                        {s.passed ? 'PASSED' : 'FAILED'}
                                                    </span>
                                                </div>
                                                {s.passed ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-500" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                {format(new Date(s.created_at), 'MMM d, yyyy')}
                                            </p>
                                            <p className="text-xs text-zinc-500 font-medium">
                                                {format(new Date(s.created_at), 'h:mm a')}
                                            </p>
                                        </td>
                                        <td className="p-6 text-right">
                                            <Link href={`/dashboard/quizzes?id=${s.id}`}>
                                                <Button variant="ghost" className="rounded-xl h-10 w-10 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
