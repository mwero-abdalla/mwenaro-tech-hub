import { getCourses } from '@/lib/courses'
import { CourseCard } from '@/components/course-card'

export const revalidate = 60 // Revalidate potentially

export default async function CoursesPage() {
    const courses = await getCourses()

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
            {/* Header section with deep-to-coral gradient */}
            <header className="relative pt-32 pb-48 overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-primary text-white text-center">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                            Explore Our Courses
                        </h1>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Master in-demand tech skills with expert-led courses. Learn at your own pace with hands-on projects.
                        </p>
                    </div>

                    {/* Centered Elevated Search Bar */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 w-full max-w-2xl px-4 z-20">
                        <div className="p-1.5 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-white/5 flex items-center">
                            <div className="pl-6 text-muted-foreground">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search courses, instructors..."
                                className="flex-1 h-14 pl-4 pr-6 rounded-2xl bg-transparent border-none focus:ring-0 font-bold text-base text-secondary dark:text-white"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 mt-40 relative z-10 flex flex-col lg:flex-row gap-12">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 space-y-8">
                    <div>
                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">Categories</h3>
                        <div className="space-y-2">
                            {['All Courses', 'Web Development', 'AI & Data Science', 'UI/UX Design', 'Cloud Computing'].map((cat, i) => (
                                <button key={i} className={`w-full text-left px-5 py-3.5 rounded-2xl font-bold transition-all ${i === 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 hover:border-primary/30'}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="flex-1">
                    <div className="flex items-center justify-between mb-10">
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Showing <span className="text-secondary dark:text-white">{courses.length} courses</span></p>
                        <div className="flex gap-4">
                            {/* Visual sort mockup */}
                            <select className="bg-transparent text-sm font-black uppercase tracking-widest cursor-pointer focus:outline-none">
                                <option>Sort: Latest</option>
                                <option>Sort: Price: Low to High</option>
                                <option>Sort: Popular</option>
                            </select>
                        </div>
                    </div>

                    {/* Course Grid */}
                    {courses.length === 0 ? (
                        <div className="text-center py-32 bg-white dark:bg-zinc-900 rounded-[3rem] border border-dashed border-zinc-200 dark:border-white/10">
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
                </main>
            </div>
        </div>
    )
}
