import { getAllQuizzes } from '@/lib/progress'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileQuestion, Search, User, BookOpen, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'

export default async function AdminQuizzesPage() {
    const quizzes = await getAllQuizzes()

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-purple-600 dark:text-purple-400 uppercase tracking-tight">Quiz Monitoring</h1>
                        <p className="text-muted-foreground font-medium">See how students are performing across all courses.</p>
                    </div>
                </div>

                <Card className="border-none shadow-xl overflow-hidden">
                    <CardHeader className="p-8 bg-white dark:bg-zinc-900 border-b">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-xl font-bold">Recent Submissions</CardTitle>
                                <CardDescription>A complete history of all quiz attempts.</CardDescription>
                            </div>
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input className="pl-10" placeholder="Search student or lesson..." />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 text-xs font-black uppercase tracking-widest text-muted-foreground border-b">
                                        <th className="px-8 py-4">Student</th>
                                        <th className="px-8 py-4">Lesson</th>
                                        <th className="px-8 py-4">Score</th>
                                        <th className="px-8 py-4">Date</th>
                                        <th className="px-8 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {quizzes.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-20 text-center italic text-muted-foreground">
                                                No submissions found.
                                            </td>
                                        </tr>
                                    ) : (
                                        quizzes.map((quiz) => (
                                            <tr key={quiz.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold uppercase">
                                                            {quiz.profiles?.full_name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold">{quiz.profiles?.full_name || 'Unknown User'}</div>
                                                            <div className="text-xs text-muted-foreground">{quiz.profiles?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                                                        <span className="font-medium">{quiz.lessons?.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 text-lg font-black">{quiz.score}%</div>
                                                        <Badge variant={quiz.passed ? "secondary" : "destructive"} className="px-3 py-0.5 text-[10px] font-black uppercase tracking-widest">
                                                            {quiz.passed ? 'PASSED' : 'FAILED'}
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-sm text-muted-foreground">
                                                    {format(new Date(quiz.created_at), 'MMM d, yyyy p')}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <Link href={`/dashboard/quizzes/${quiz.id}`}>
                                                        <Button variant="outline" size="sm" className="font-bold gap-2">
                                                            Review
                                                            <ExternalLink className="w-3 h-3" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
