import { getDashboardStats } from '@/lib/admin'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default async function AdminDashboard() {
    const stats = await getDashboardStats()

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="max-w-7xl mx-auto p-8">
                <div className="mb-8 p-8 rounded-3xl bg-white/50 dark:bg-card/50 backdrop-blur-sm border border-white/20 shadow-xl">
                    <h1 className="text-4xl font-black tracking-tight mb-2 text-primary">Admin Command Center</h1>
                    <p className="text-muted-foreground text-lg italic">Platform Oversight • Resource Management • System Growth</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <Link href="/admin/users?role=student">
                        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-2">Total Students</p>
                            <p className="text-5xl font-black">{stats.totalStudents}</p>
                            <p className="text-xs text-muted-foreground mt-1">Active learners</p>
                        </Card>
                    </Link>
                    <Link href="/admin/users?role=instructor">
                        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                            <p className="text-sm font-bold uppercase tracking-widest text-purple-600 mb-2">Instructors</p>
                            <p className="text-5xl font-black">{stats.totalInstructors}</p>
                            <p className="text-xs text-muted-foreground mt-1">Teaching staff</p>
                        </Card>
                    </Link>
                    <Link href="/admin/courses">
                        <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Total Courses</p>
                            <p className="text-5xl font-black">{stats.totalCourses}</p>
                            <p className="text-xs text-muted-foreground mt-1">Available courses</p>
                        </Card>
                    </Link>
                    <Link href="/admin/cohorts">
                        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                            <p className="text-sm font-bold uppercase tracking-widest text-green-600 mb-2">Active Cohorts</p>
                            <p className="text-5xl font-black">{stats.activeCohorts}</p>
                            <p className="text-xs text-muted-foreground mt-1">Learning groups</p>
                        </Card>
                    </Link>
                    <Link href="/admin/analytics">
                        <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                            <p className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-2">Enrollments</p>
                            <p className="text-5xl font-black">{stats.totalEnrollments}</p>
                            <p className="text-xs text-muted-foreground mt-1">Course enrollments</p>
                        </Card>
                    </Link>
                    <Link href="/admin/analytics">
                        <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                            <p className="text-sm font-bold uppercase tracking-widest text-cyan-600 mb-2">Completed</p>
                            <p className="text-5xl font-black">{stats.completedLessons}</p>
                            <p className="text-xs text-muted-foreground mt-1">Lessons finished</p>
                        </Card>
                    </Link>
                    <Link href="/admin/analytics">
                        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                            <p className="text-sm font-bold uppercase tracking-widest text-orange-600 mb-2">Active Streaks</p>
                            <p className="text-5xl font-black">{stats.activeStreaks}</p>
                            <p className="text-xs text-muted-foreground mt-1">Learning streaks</p>
                        </Card>
                    </Link>
                    <Link href="/admin/analytics">
                        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                            <p className="text-sm font-bold uppercase tracking-widest text-secondary dark:text-secondary-foreground mb-2">Submissions</p>
                            <p className="text-5xl font-black">{stats.totalSubmissions}</p>
                            <p className="text-xs text-muted-foreground mt-1">Project submissions</p>
                        </Card>
                    </Link>
                </div>

                {/* Management Links */}
                <h2 className="text-3xl font-black mb-8 px-2 border-l-4 border-primary ml-1">Management Hub</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/admin/users">
                        <Card className="group p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-t-4 border-t-primary bg-card/50 backdrop-blur-sm">
                            <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors">User Management</h3>
                            <p className="text-muted-foreground leading-relaxed">Promote instructors, manage roles, and monitor user acquisition.</p>
                        </Card>
                    </Link>

                    <Link href="/admin/courses">
                        <Card className="group p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-t-4 border-t-primary bg-card/50 backdrop-blur-sm">
                            <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors">Course Management</h3>
                            <p className="text-muted-foreground leading-relaxed">Add new courses, edit curriculum, and manage educational content.</p>
                        </Card>
                    </Link>

                    <Link href="/admin/cohorts">
                        <Card className="group p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-t-4 border-t-primary bg-card/50 backdrop-blur-sm">
                            <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors">Cohort Management</h3>
                            <p className="text-muted-foreground leading-relaxed">Create and manage cohorts, assign instructors, and view enrollments.</p>
                        </Card>
                    </Link>

                    <Link href="/admin/analytics">
                        <Card className="group p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-t-4 border-t-secondary bg-card/50 backdrop-blur-sm">
                            <h3 className="text-xl font-black mb-2 group-hover:text-secondary transition-colors">Platform Intelligence</h3>
                            <p className="text-muted-foreground leading-relaxed">Monitor AI grading accuracy, view platform trends, and system logs.</p>
                        </Card>
                    </Link>
                    <Link href="/settings">
                        <Card className="group p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-t-4 border-t-zinc-400 bg-card/50 backdrop-blur-sm">
                            <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors">Personal Settings</h3>
                            <p className="text-muted-foreground leading-relaxed">Update your profile information, manage security, and preferences.</p>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    )
}
