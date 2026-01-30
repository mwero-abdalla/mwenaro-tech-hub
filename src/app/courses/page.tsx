import { getCourses } from '@/lib/courses'
import { CourseCard } from '@/components/course-card'

export const revalidate = 60 // Revalidate potentially

export default async function CoursesPage() {
    const courses = await getCourses()

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
            {/* Header section with gradient */}
            <header className="relative py-20 overflow-hidden bg-secondary text-white">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-3xl space-y-4">
                        <div className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary font-bold text-xs uppercase tracking-widest mb-2">
                            🚀 Expert-Led Curriculum
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Academy</span>
                        </h1>
                        <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                            From frontend development to AI engineering, master the skills that industries are fighting for. Join a cohort and start your career transition.
                        </p>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 -mt-10 relative z-20">
                {/* Search / Filter Bar (Visual Mockup for now) */}
                <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-border/50 flex flex-col md:flex-row gap-4 items-center mb-16">
                    <div className="relative flex-1 group">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <input
                            type="text"
                            placeholder="What do you want to learn today?"
                            className="w-full h-14 pl-12 pr-6 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-transparent focus:border-primary/50 focus:ring-0 transition-all font-medium"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Development', 'AI', 'Design'].map((tag, i) => (
                            <button key={i} className={`h-14 px-6 rounded-2xl font-bold transition-all ${i === 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Course Grid */}
                {courses.length === 0 ? (
                    <div className="text-center py-32 bg-white dark:bg-zinc-900 rounded-[3rem] border border-dashed border-border">
                        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                            🔍
                        </div>
                        <h3 className="text-2xl font-black mb-2">No courses found</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto">We couldn't find any courses matching your search. Try broadening your terms.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
