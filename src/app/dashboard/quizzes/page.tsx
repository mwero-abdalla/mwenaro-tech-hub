import { getUserQuizzes } from '@/lib/progress'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileQuestion, ChevronRight, Calendar, Trophy } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function StudentQuizzesPage() {
    const quizzes = await getUserQuizzes()

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Quiz Dashboard</h1>
                    <p className="text-muted-foreground text-lg">Track your performance and review your answers.</p>
                </div>
                <div className="hidden md:flex gap-4">
                    <Card className="p-4 flex items-center gap-4 bg-primary/5 border-primary/20">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-muted-foreground uppercase">Average Score</div>
                            <div className="text-2xl font-black">
                                {quizzes.length > 0
                                    ? Math.round(quizzes.reduce((acc, q) => acc + q.score, 0) / quizzes.length)
                                    : 0}%
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid gap-6">
                {quizzes.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileQuestion className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-black mb-2">No quizzes taken yet</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto mb-8">
                            Start learning and test your knowledge with lesson quizzes!
                        </p>
                        <Link href="/courses">
                            <Button className="font-bold">Browse Courses</Button>
                        </Link>
                    </Card>
                ) : (
                    quizzes.map((quiz) => (
                        <Card key={quiz.id} className="group hover:border-primary/50 transition-all duration-300 overflow-hidden">
                            <Link href={`/dashboard/quizzes/${quiz.id}`} className="block">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row items-stretch">
                                        <div className={`w-2 md:w-3 ${quiz.passed ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-widest">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(quiz.created_at), 'PPP')}
                                                </div>
                                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                                    {quiz.lessons?.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1 font-medium">
                                                    From your enrolled courses
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="text-center">
                                                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Score</div>
                                                    <div className={`text-3xl font-black ${quiz.passed ? 'text-green-600' : 'text-red-600'}`}>
                                                        {quiz.score}%
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center gap-2">
                                                    <Badge variant={quiz.passed ? "secondary" : "destructive"} className="px-4 py-1 font-black uppercase tracking-widest text-[10px]">
                                                        {quiz.passed ? 'Passed' : 'Failed'}
                                                    </Badge>
                                                    <Button variant="ghost" size="sm" className="font-bold text-xs gap-1">
                                                        View Details
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
