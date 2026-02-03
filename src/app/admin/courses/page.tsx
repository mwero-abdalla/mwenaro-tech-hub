import { getCourses } from '@/lib/courses'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { deleteCourse } from '@/lib/admin'
import { CoursePublishToggle } from '@/components/admin/course-publish-toggle'
import { CourseForm } from '@/components/admin/course-form'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil } from 'lucide-react'

export default async function CoursesPage() {
    const courses = await getCourses()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black text-purple-600 dark:text-purple-400">Course Management</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List */}
                    <div className="lg:col-span-2 space-y-4">
                        {courses.length === 0 ? (
                            <Card className="p-12 text-center text-muted-foreground italic">
                                No courses found.
                            </Card>
                        ) : (
                            courses.map(course => (
                                <Card key={course.id} className="p-6 flex justify-between items-center group hover:border-purple-300 transition-all">
                                    <div>
                                        <h3 className="text-xl font-bold">{course.title}</h3>
                                        <p className="text-muted-foreground text-sm line-clamp-1">{course.description}</p>
                                        <p className="text-sm font-bold mt-2 text-purple-600">KSh {course.price.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <CoursePublishToggle courseId={course.id} initialIsPublished={course.is_published || false} />
                                        <div className="flex gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Course</DialogTitle>
                                                    </DialogHeader>
                                                    <CourseForm courseId={course.id} initialData={course} />
                                                </DialogContent>
                                            </Dialog>

                                            <Link href={`/admin/courses/${course.id}/lessons`}>
                                                <Button variant="outline" size="sm">Manage Lessons</Button>
                                            </Link>
                                            <form action={async () => {
                                                'use server'
                                                await deleteCourse(course.id)
                                            }}>
                                                <Button variant="destructive" size="sm">Delete</Button>
                                            </form>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Create Form */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-8">
                            <h2 className="text-xl font-bold mb-4">Add New Course</h2>
                            <CourseForm />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
