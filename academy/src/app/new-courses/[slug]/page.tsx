import fs from 'fs'
import path from 'path'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { VideoPlayer } from '@/components/video-player'
import Mermaid from '@/components/mermaid'
import { CheckCircle2, PlayCircle, BookOpen, HelpCircle, LayoutList } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LessonQuiz } from '@/components/course/lesson-quiz'

interface Question {
    question_text: string
    options: string[]
    correct_answer: number
    explanation: string
}

interface Lesson {
    title: string
    has_project: boolean
    video_url?: string
    content: string
    questions: Question[]
    slug: string
    phase: string
}

interface CourseData {
    title: string
    description: string
    course_overview: string
    course_outline: string
    total_modules: number
    difficulty: string
    duration: number
}

const CONTENT_DIR = path.join(process.cwd(), '../.docs/content')
const COURSES_DIR = path.join(process.cwd(), '../.docs/courses')

const PHASE_MAPPING: Record<string, string[]> = {
    'fullstack': [
        'phase-1-web-foundations',
        'phase-2-react-frontend',
        'phase-3-backend-api',
        'phase-4-fullstack-synergy',
        'phase-5-advanced-production'
    ],
    'web-foundations': ['phase-1-web-foundations'],
    'react-frontend': ['phase-2-react-frontend'],
    'backend-api': ['phase-3-backend-api'],
    'fullstack-synergy': ['phase-4-fullstack-synergy'],
    'advanced-production': ['phase-5-advanced-production']
}

async function getCourseData(courseSlug: string): Promise<CourseData | null> {
    const filePath = path.join(COURSES_DIR, `${courseSlug}.json`)
    if (!fs.existsSync(filePath)) return null
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

async function getLessonsForCourse(courseSlug: string) {
    const phases = PHASE_MAPPING[courseSlug]
    if (!phases) return null

    const allLessons: Lesson[] = []

    for (const phase of phases) {
        const phasePath = path.join(CONTENT_DIR, phase)
        if (!fs.existsSync(phasePath)) continue

        const files = fs.readdirSync(phasePath)
            .filter(f => f.endsWith('.json'))
            .sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)?.[0] || '0')
                const numB = parseInt(b.match(/\d+/)?.[0] || '0')
                return numA - numB
            })

        for (const file of files) {
            const filePath = path.join(phasePath, file)
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
            allLessons.push({
                ...content,
                slug: file.replace('.json', ''),
                phase: phase.replace('phase-', '').replace(/-/g, ' ').toUpperCase()
            })
        }
    }

    return allLessons
}

export default async function NewCoursePreviewPage({ 
    params, 
    searchParams 
}: { 
    params: Promise<{ slug: string }>
    searchParams: Promise<{ lesson?: string }> 
}) {
    const { slug } = await params
    const { lesson: activeLessonSlug } = await searchParams
    
    const [lessons, courseData] = await Promise.all([
        getLessonsForCourse(slug),
        getCourseData(slug)
    ])

    if (!lessons || lessons.length === 0) {
        notFound()
    }

    // If no lesson selected, show course overview
    const showOverview = !activeLessonSlug

    const activeLessonIndex = activeLessonSlug 
        ? lessons.findIndex(l => l.slug === activeLessonSlug)
        : 0
    
    const activeLesson = lessons[activeLessonIndex === -1 ? 0 : activeLessonIndex]

    const nextLesson = showOverview ? lessons[0] : lessons[activeLessonIndex + 1]
    const nextLessonHref = nextLesson ? `/new-courses/${slug}?lesson=${nextLesson.slug}` : undefined

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 pt-32 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto hidden md:flex flex-col">
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-black tracking-tight uppercase">{slug.replace(/-/g, ' ')}</h2>
                    <p className="text-xs text-zinc-500 font-bold mt-1">{lessons.length} Modules for Vetting</p>
                </div>
                <nav className="p-4 space-y-1 flex-1">
                    {/* Course Overview link */}
                    <Link
                        href={`/new-courses/${slug}`}
                        className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${
                            showOverview
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                    >
                        <div className="mt-0.5">
                            <LayoutList className={`w-4 h-4 ${showOverview ? 'text-primary' : 'text-zinc-400'}`} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">Course</p>
                            <p className={`text-sm font-bold leading-tight ${showOverview ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                Overview
                            </p>
                        </div>
                    </Link>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-2" />

                    {lessons.map((lesson) => (
                        <Link 
                            key={`${lesson.phase}-${lesson.slug}`}
                            href={`/new-courses/${slug}?lesson=${lesson.slug}`}
                            className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${
                                !showOverview && activeLesson.slug === lesson.slug 
                                ? 'bg-primary/10 text-primary border border-primary/20' 
                                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                            }`}
                        >
                            <div className="mt-1">
                                {lesson.video_url ? (
                                    <PlayCircle className={`w-4 h-4 ${!showOverview && activeLesson.slug === lesson.slug ? 'text-primary' : 'text-zinc-400'}`} />
                                ) : (
                                    <BookOpen className={`w-4 h-4 ${!showOverview && activeLesson.slug === lesson.slug ? 'text-primary' : 'text-zinc-400'}`} />
                                )}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">{lesson.phase}</p>
                                <p className={`text-sm font-bold leading-tight ${!showOverview && activeLesson.slug === lesson.slug ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                    {lesson.title}
                                </p>
                            </div>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 px-6 py-10 md:px-12 lg:px-20">
                <div className="max-w-4xl mx-auto space-y-12">

                    {showOverview ? (
                        /* ── Course Overview Screen ── */
                        <>
                            {/* Header */}
                            <div className="space-y-3">
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">
                                    {courseData?.title ?? slug.replace(/-/g, ' ')}
                                </h1>
                                {courseData && (
                                    <div className="flex flex-wrap gap-4 text-sm font-bold text-zinc-500 dark:text-zinc-400">
                                        <span className="capitalize">{courseData.difficulty}</span>
                                        <span>·</span>
                                        <span>{courseData.duration} weeks</span>
                                        <span>·</span>
                                        <span>{courseData.total_modules} modules</span>
                                    </div>
                                )}
                            </div>

                            {/* Overview Content */}
                            <article className="prose prose-zinc lg:prose-xl dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary">
                                <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 md:p-12 shadow-sm">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 not-prose">Course Overview</p>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                    >
                                        {courseData?.course_overview ?? ''}
                                    </ReactMarkdown>
                                </div>
                            </article>




                            {/* Start Course CTA */}
                            <div className="flex justify-start">
                                <Link
                                    href={`/new-courses/${slug}?lesson=${lessons[0].slug}`}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20"
                                >
                                    <PlayCircle className="w-5 h-5" />
                                    Start with Lesson 1
                                </Link>
                            </div>
                        </>
                    ) : (
                        /* ── Lesson Screen ── */
                        <>
                            {/* Header */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-primary/20">
                                        {activeLesson.phase}
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">
                                    {activeLesson.title}
                                </h1>
                            </div>

                            {/* Video */}
                            {activeLesson.video_url && (
                                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-video bg-black">
                                    <VideoPlayer url={activeLesson.video_url} className="w-full h-full" />
                                </div>
                            )}

                            {/* Text Content */}
                            <article className="prose prose-zinc lg:prose-xl dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary">
                                <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 md:p-12 shadow-sm">
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ node, inline, className, children, ...props }: any) {
                                                const match = /language-(\w+)/.exec(className || '')
                                                if (!inline && match && match[1] === 'mermaid') {
                                                    return <Mermaid chart={String(children).replace(/\n$/, '')} />
                                                }
                                                return (
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            }
                                        }}
                                    >
                                        {activeLesson.content}
                                    </ReactMarkdown>
                                </div>
                            </article>

                            {/* Interactive Quiz Section */}
                            <LessonQuiz 
                                questions={activeLesson.questions} 
                                nextLessonHref={nextLessonHref}
                            />
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
