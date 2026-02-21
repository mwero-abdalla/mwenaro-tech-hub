'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Course } from '@/lib/courses'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { Lock } from 'lucide-react'

interface CourseCardProps {
    course: Course
    progress?: number
}

export function CourseCard({ course, progress }: CourseCardProps) {
    const isPublished = course.is_published ?? true // Default to true if undefined, though usually should be false if strictly checking

    const handleExploreClick = (e: React.MouseEvent) => {
        if (!isPublished) {
            e.preventDefault()
            toast.info('Coming Soon!', {
                description: 'This course is currently being prepared. Stay tuned!',
            })
        }
    }

    return (
        <Card className={`flex flex-col overflow-hidden h-full group transition-all duration-500 hover:shadow-[0_20px_50px_rgba(232,93,59,0.15)] border-white/5 bg-white dark:bg-zinc-900 rounded-[2rem] hover:-translate-y-2 ${!isPublished ? 'opacity-75 grayscale-[0.5] hover:opacity-100 hover:grayscale-0' : ''}`}>
            <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                    src={course.image_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop'}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                    {!isPublished ? (
                        <div className="px-3 py-1 backdrop-blur-md bg-zinc-900/90 border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-xl flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Coming Soon
                        </div>
                    ) : (
                        <>
                            <div className="px-3 py-1 backdrop-blur-md bg-primary/90 border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
                                {course.price > 20000 ? 'Bestseller' : 'New'}
                            </div>
                            <div className="px-3 py-1 backdrop-blur-md bg-white/10 border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
                                {course.level || 'Advanced'}
                            </div>
                        </>
                    )}
                </div>

                {progress !== undefined && (
                    <div className="absolute bottom-4 left-4 right-4 p-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl">
                        <div className="flex items-center justify-between text-[11px] font-black text-white mb-2 uppercase tracking-widest opacity-90">
                            <span>Your Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5 bg-white/20" />
                    </div>
                )}
            </div>

            <CardHeader className="p-8 pb-3">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-500 scale-75 origin-left">
                        {[1, 2, 3, 4, 5].map(i => (
                            <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">4.9 (120 reviews)</span>
                </div>
                <CardTitle className="text-2xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors duration-300">
                    {course.title}
                </CardTitle>
            </CardHeader>

            <CardContent className="px-8 pb-8 flex-1">
                <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed font-medium mb-6">
                    {course.description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Enrolled Price</span>
                        <span className="text-2xl font-black text-secondary dark:text-white">
                            KSh {course.price.toLocaleString()}
                            {course.original_price && course.original_price > course.price && (
                                <span className="ml-2 text-sm font-bold text-muted-foreground line-through opacity-60">
                                    KSh {course.original_price.toLocaleString()}
                                </span>
                            )}
                        </span>
                    </div>
                    {isPublished ? (
                        <Link href={`/courses/${course.id}`}>
                            <Button className="font-black bg-primary hover:bg-primary/90 px-6 h-12 rounded-xl shadow-lg shadow-primary/10 transition-all hover:-translate-y-1">
                                Explore
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            onClick={handleExploreClick}
                            variant="secondary"
                            className="font-black px-6 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-muted-foreground cursor-not-allowed hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-foreground transition-all"
                        >
                            Coming Soon
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
