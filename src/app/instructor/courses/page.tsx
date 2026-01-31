import { getInstructorWorkload } from '@/lib/courses'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Eye, Layout, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function InstructorCoursesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const workload = await getInstructorWorkload(user.id)

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Instructional Units</h1>
                        <p className="text-zinc-500 font-medium mt-1">Courses and cohorts under your supervision</p>
                    </div>
                    <Link href="/courses">
                        <Button variant="outline" className="font-bold rounded-xl border-zinc-200 dark:border-zinc-800">
                            Browse All Courses
                        </Button>
                    </Link>
                </div>

                {workload.length === 0 ? (
                    <Card className="p-20 text-center border-dashed bg-transparent border-2 border-zinc-200 dark:border-zinc-800">
                        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="w-10 h-10 text-zinc-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No workload assigned yet</h3>
                        <p className="text-zinc-500 max-w-sm mx-auto mb-8">
                            Once you are assigned to a cohort or course, it will appear here for you to manage.
                        </p>
                        <Link href="/instructor/dashboard">
                            <Button className="font-bold h-12 px-8 rounded-xl bg-primary hover:bg-primary/90">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workload.map(item => (
                            <Card key={item.id} className="group overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 rounded-3xl">
                                <Link href={`/learn/${item.course_id}`}>
                                    <div className="aspect-video w-full bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden cursor-pointer">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                                <Layout className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            {item.cohort_name && (
                                                <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 shadow-sm">
                                                    <Users className="w-3 h-3" />
                                                    Cohort
                                                </Badge>
                                            )}
                                            <Badge className={item.is_published ? "bg-green-500/10 text-green-500 border-green-500/20 shadow-sm" : "bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-sm"}>
                                                {item.is_published ? 'Published' : 'Draft'}
                                            </Badge>
                                        </div>
                                    </div>
                                </Link>
                                <div className="p-6">
                                    <Link href={`/learn/${item.course_id}`}>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors italic cursor-pointer">
                                            {item.title} {item.cohort_name ? `(${item.cohort_name})` : ''}
                                        </h3>
                                    </Link>
                                    <p className="text-zinc-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                                        {item.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href={`/admin/courses/${item.course_id}/lessons`} className="w-full">
                                            <Button variant="secondary" className="w-full font-bold h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700">
                                                Curriculum
                                            </Button>
                                        </Link>
                                        <Link href={`/learn/${item.course_id}`} className="w-full">
                                            <Button className="w-full font-black h-11 rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95">
                                                <Eye className="w-4 h-4 mr-2" />
                                                Go to Preview
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
