import { getEnrolledCourses } from '@/lib/enrollment'
import { getStudentSessions } from '@/lib/sessions'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserProgress } from '@/lib/progress'
import { getCourseLessons } from '@/lib/lessons'
import { getLearningStreak, isStreakActive } from '@/lib/streaks'
import { getRecommendedCourses } from '@/lib/ai'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCards } from '@/components/dashboard/stats-cards'
import { EnrolledCourseCard } from '@/components/dashboard/enrolled-course-card'
import { UpcomingSessionCard } from '@/components/dashboard/upcoming-session-card'
import { ArrowRight, BookOpen, Calendar, Award, ShieldCheck, Sparkles, PlayCircle } from "lucide-react"
import { format } from 'date-fns'
import { getProfile } from '@/lib/user'

export const revalidate = 0 // Ensure dynamic data

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Role-based redirection
    const role = user.user_metadata?.role
    if (role === 'admin') {
        redirect('/admin/dashboard')
    } else if (role === 'instructor') {
        redirect('/instructor/dashboard')
    }

    // Proceed as Learner
    const [enrolledCourses, upcomingSessions, allProgress, streakData, recommendations, profile] = await Promise.all([
        getEnrolledCourses(),
        getStudentSessions(),
        getUserProgress(),
        getLearningStreak(user.id),
        getRecommendedCourses(user.id),
        getProfile()
    ])

    // Calculate current streak (0 if not active)
    const currentStreak = streakData && isStreakActive(streakData.last_activity_date)
        ? streakData.current_streak
        : 0

    // Calculate total quizzes attempted across all courses
    const totalQuizzes = allProgress.reduce((acc, curr) => acc + (curr.quiz_attempts || 0), 0)

    // Prepare enrolled courses with progress
    const courseIds = enrolledCourses.map(c => c.id)
    let coursesWithProgress: any[] = []

    if (courseIds.length > 0) {
        // Fetch lessons per course correctly via phases → phase_lessons → lessons
        const allCourseLessons = await Promise.all(
            enrolledCourses.map(course => getCourseLessons(course.id))
        )

        coursesWithProgress = enrolledCourses.map((course, idx) => {
            const courseLessons = allCourseLessons[idx] || []
            const lessonCount = courseLessons.length

            const courseProgressRecords = allProgress.filter(p =>
                courseLessons.some(cl => cl.id === p.lesson_id)
            )

            const completedLessons = courseProgressRecords.filter(p => p.is_completed).length
            const progressPercentage = lessonCount > 0 ? Math.round((completedLessons / lessonCount) * 100) : 0

            // Estimate last accessed as the most recent completion
            const lastActivity = courseProgressRecords
                .filter(p => p.completed_at)
                .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())[0]

            return {
                ...course,
                progress: progressPercentage,
                lastAccessedAt: lastActivity?.completed_at,
                completedLessonsCount: completedLessons,
                totalLessonsCount: lessonCount,
                lessons: courseLessons
            }
        })

        // Sort by last active course if available, then by lastAccessedAt
        coursesWithProgress.sort((a, b) => {
            if (profile?.last_course_id) {
                if (a.id === profile.last_course_id) return -1
                if (b.id === profile.last_course_id) return 1
            }

            if (a.lastAccessedAt && b.lastAccessedAt) {
                return new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
            }
            return 0
        })
    }

    // Calculate total learning hours
    const completedLessonIds = allProgress.filter(p => p.is_completed).map(p => p.lesson_id)
    const { data: completedLessonsData } = await supabase
        .from('lessons')
        .select('duration_minutes')
        .in('id', completedLessonIds)

    const totalLearningMinutes = completedLessonsData?.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0) || 0
    const totalLearningHours = Math.round(totalLearningMinutes / 60)

    const firstName = user.user_metadata?.full_name?.split(' ')[0] || 'Learner'

    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-3">
                <h1 className="text-4xl font-black tracking-tight text-foreground">
                    Welcome back, <span className="text-primary">{firstName}</span>!
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                    {profile?.last_course_id
                        ? "Pick up right where you left off and keep the momentum going."
                        : "Track your progress, explore new skills, and continue your learning journey."
                    }
                </p>
            </div>

            <StatsCards
                courses={coursesWithProgress}
                streak={currentStreak}
                quizzesAttempted={totalQuizzes}
                learningHours={totalLearningHours}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content: Enrolled Courses */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground">
                            Continue Learning
                        </h2>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/courses">
                                View all <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {coursesWithProgress.length === 0 ? (
                            <Card className="border-none bg-zinc-50/50 dark:bg-zinc-900/50 shadow-none ring-1 ring-inset ring-zinc-200/50 dark:ring-zinc-800/50">
                                <CardContent className="py-16 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                                    <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                        <BookOpen className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-3">Your Journey Begins Here</h3>
                                    <p className="text-muted-foreground mb-8">
                                        Start building real-world skills today by enrolling in a project-based course.
                                    </p>
                                    <Button asChild size="lg" className="w-full sm:w-auto relative overflow-hidden group">
                                        <Link href="/courses">
                                            <span className="relative z-10 flex items-center gap-2">Explore the Catalog <ArrowRight className="h-4 w-4" /></span>
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            coursesWithProgress.slice(0, 3).map((course) => {
                                // Calculate course-specific average quiz score
                                const courseLessons = course.lessons || []
                                const progressRecords = allProgress.filter(p =>
                                    courseLessons.some((cl: any) => cl.id === p.lesson_id)
                                )
                                const quizScores = progressRecords
                                    .map(p => p.highest_quiz_score)
                                    .filter(s => s > 0)
                                const avgQuizScore = quizScores.length > 0
                                    ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
                                    : 0

                                return (
                                    <EnrolledCourseCard
                                        key={course.id}
                                        course={course}
                                        progress={course.progress}
                                        lastAccessed={course.lastAccessedAt ? format(new Date(course.lastAccessedAt), 'MMM d, yyyy') : undefined}
                                        completedLessons={progressRecords.filter(p => p.is_completed).length}
                                        totalLessons={courseLessons.length}
                                        averageQuizScore={avgQuizScore}
                                    />
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Sidebar: Recommendations & Sessions */}
                <div className="space-y-6">
                    {recommendations.length > 0 && (
                        <Card className="border-primary/20 bg-primary/5 overflow-hidden shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2 text-primary">
                                    <Sparkles className="h-4 w-4" />
                                    <CardTitle className="text-sm font-bold uppercase tracking-wider">Recommended for You</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recommendations.map((course: any) => (
                                    <Link
                                        key={course.id}
                                        href={`/courses/${course.id}`}
                                        className="flex gap-3 group items-center"
                                    >
                                        <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                            {course.image_url ? (
                                                <img src={course.image_url} alt={course.title} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                                                    <BookOpen className="h-5 w-5" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold line-clamp-1 group-hover:text-primary transition-colors">{course.title}</p>
                                            <p className="text-[10px] text-muted-foreground">{course.level || 'All Levels'}</p>
                                        </div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-foreground">
                                Upcoming Sessions
                            </h2>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard/sessions">
                                    <Calendar className="mr-1 h-4 w-4" />
                                    All
                                </Link>
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {upcomingSessions.length === 0 ? (
                                <Card className="border-none bg-zinc-50/50 dark:bg-zinc-900/50 shadow-none ring-1 ring-inset ring-zinc-200/50 dark:ring-zinc-800/50">
                                    <CardContent className="py-10 text-center flex flex-col items-center">
                                        <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                            <Calendar className="h-6 w-6 text-primary" />
                                        </div>
                                        <p className="font-semibold text-foreground mb-1">
                                            Your schedule is clear
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            No live sessions scheduled at the moment.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                upcomingSessions.slice(0, 3).map((session) => (
                                    <UpcomingSessionCard
                                        key={session.id}
                                        id={session.id}
                                        title={session.title}
                                        courseName={session.cohort?.name}
                                        scheduledAt={session.start_time}
                                        durationMinutes={session.duration_minutes}
                                        meetingUrl={session.meeting_link}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start rounded-xl" asChild>
                                <Link href="/courses">
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Browse Courses
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start rounded-xl" asChild>
                                <Link href="/dashboard/certificates">
                                    <Award className="mr-2 h-4 w-4" />
                                    View Certificates
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
