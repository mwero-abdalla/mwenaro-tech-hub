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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                        <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Total Courses</p>
                        <p className="text-5xl font-black">{stats.totalCourses}</p>
                    </Card>
                    <Card className="p-6 bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20">
                        <p className="text-sm font-bold uppercase tracking-widest text-secondary dark:text-secondary-foreground mb-2">Total Submissions</p>
                        <p className="text-5xl font-black">{stats.totalSubmissions}</p>
                    </Card>
                    <Card className="p-6 bg-gradient-to-br from-green-600/10 to-transparent border-green-600/20">
                        <p className="text-sm font-bold uppercase tracking-widest text-green-600 mb-2">Platform Revenue (Est)</p>
                        <p className="text-5xl font-black text-green-600">$12,450</p>
                    </Card>
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
                </div>
            </div>
        </div>
    )
}
