import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, CheckCircle, Clock, ShieldCheck } from "lucide-react"
import type { Course } from "@/lib/courses"

interface StatsCardsProps {
    courses: (Course & { progress: number })[]
    streak?: number
    quizzesAttempted?: number
    learningHours?: number
}

export function StatsCards({ courses, streak = 0, quizzesAttempted = 0, learningHours = 0 }: StatsCardsProps) {
    const enrolledCount = courses.length
    const completedCount = courses.filter(c => c.progress === 100).length

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Enrolled Courses
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{enrolledCount}</div>
                    <p className="text-xs text-muted-foreground">
                        Active courses
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Completed
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completedCount}</div>
                    <p className="text-xs text-muted-foreground">
                        Courses finished
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Learning Hours
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{learningHours}h</div>
                    <p className="text-xs text-muted-foreground">
                        Time spent learning
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Day Streak
                    </CardTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4 text-orange-500"
                    >
                        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
                    </svg>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{streak}</div>
                    <p className="text-xs text-muted-foreground">
                        {streak === 1 ? 'day' : 'days'} in a row
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
