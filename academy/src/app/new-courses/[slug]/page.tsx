import fs from 'fs'
import path from 'path'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { VideoPlayer } from '@/components/video-player'
import Mermaid from '@/components/mermaid'
import { CheckCircle2, PlayCircle, BookOpen, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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

const CONTENT_DIR = path.join(process.cwd(), '../.docs/content')

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
    
    const lessons = await getLessonsForCourse(slug)
    if (!lessons || lessons.length === 0) {
        notFound()
    }

    const activeLessonIndex = activeLessonSlug 
        ? lessons.findIndex(l => l.slug === activeLessonSlug)
        : 0
    
    const activeLesson = lessons[activeLessonIndex === -1 ? 0 : activeLessonIndex]

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 pt-32 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto hidden md:block">
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-black tracking-tight uppercase">{slug.replace(/-/g, ' ')}</h2>
                    <p className="text-xs text-zinc-500 font-bold mt-1">{lessons.length} Modules for Vetting</p>
                </div>
                <nav className="p-4 space-y-2">
                    {lessons.map((lesson, idx) => (
                        <Link 
                            key={`${lesson.phase}-${lesson.slug}`}
                            href={`/new-courses/${slug}?lesson=${lesson.slug}`}
                            className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${
                                activeLesson.slug === lesson.slug 
                                ? 'bg-primary/10 text-primary border border-primary/20' 
                                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                            }`}
                        >
                            <div className="mt-1">
                                {lesson.video_url ? (
                                    <PlayCircle className={`w-4 h-4 ${activeLesson.slug === lesson.slug ? 'text-primary' : 'text-zinc-400'}`} />
                                ) : (
                                    <BookOpen className={`w-4 h-4 ${activeLesson.slug === lesson.slug ? 'text-primary' : 'text-zinc-400'}`} />
                                )}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">{lesson.phase}</p>
                                <p className={`text-sm font-bold leading-tight ${activeLesson.slug === lesson.slug ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
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

                    {/* Quiz Vetting Section */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-4">
                            <HelpCircle className="w-8 h-8 text-primary" />
                            <h2 className="text-3xl font-black tracking-tight">Quiz Vetting ({activeLesson.questions.length} Questions)</h2>
                        </div>

                        <div className="grid gap-6">
                            {activeLesson.questions.map((q, qIdx) => (
                                <div key={qIdx} className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm space-y-6">
                                    <div className="flex items-start gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-black">
                                            {qIdx + 1}
                                        </span>
                                        <h3 className="text-xl font-bold leading-snug">{q.question_text}</h3>
                                    </div>

                                    <div className="grid gap-3 ml-12">
                                        {q.options.map((opt, oIdx) => (
                                            <div 
                                                key={oIdx}
                                                className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                                                    oIdx === q.correct_answer 
                                                    ? 'bg-green-500/5 border-green-500/30 text-green-700 dark:text-green-400' 
                                                    : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 opacity-60'
                                                }`}
                                            >
                                                <span className="font-medium">{opt}</span>
                                                {oIdx === q.correct_answer && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="ml-12 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                        <p className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Explanation</p>
                                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                            {q.explanation}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}
