'use client'

import { useState } from 'react'
import { Course } from '@/lib/courses'
import { CourseCard } from '@/components/course-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, ChevronDown, BookOpen } from 'lucide-react'

const categories = [
    'All Courses',
    'Web Development',
    'Data Science',
    'Mobile Development',
    'Cloud Computing',
    'Cybersecurity',
    'AI & Machine Learning',
]

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']

interface CoursesClientProps {
    courses: Course[]
}

export function CoursesClient({ courses }: CoursesClientProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All Courses')
    const [selectedLevel, setSelectedLevel] = useState('All Levels')
    const [sortBy, setSortBy] = useState('Latest')
    const [showFilters, setShowFilters] = useState(false)

    const filteredCourses = courses.filter((course) => {
        // Search filter - match title or description
        const matchesSearch =
            searchQuery === '' ||
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

        // Category filter - show course if:
        // 1. "All Courses" is selected, OR
        // 2. Course category matches selected, OR  
        // 3. Course has no category (include in all category views)
        const matchesCategory =
            selectedCategory === 'All Courses' ||
            course.category === selectedCategory ||
            !course.category

        // Level filter - show course if:
        // 1. "All Levels" is selected, OR
        // 2. Course level matches selected, OR
        // 3. Course has no level (include in all level views)
        const matchesLevel =
            selectedLevel === 'All Levels' ||
            course.level === selectedLevel ||
            !course.level

        return matchesSearch && matchesCategory && matchesLevel
    }).sort((a, b) => {
        if (sortBy === 'Price: Low to High') {
            return a.price - b.price
        } else if (sortBy === 'Price: High to Low') {
            return b.price - a.price
        } else if (sortBy === 'Latest') {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        return 0
    })

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
            {/* Hero Section with Gradient */}
            <header className="relative py-24 overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-primary text-white text-center">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-4">
                                Explore Our Courses
                            </h1>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                Master in-demand tech skills with expert-led courses. Learn at your own pace with hands-on projects.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="bg-white dark:bg-zinc-900 rounded-full shadow-2xl border border-white/10 flex items-center overflow-hidden">
                            <div className="pl-6 text-muted-foreground">
                                <Search className="w-5 h-5" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Search courses, instructors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 h-14 pl-4 pr-6 bg-transparent border-none focus:ring-0 text-base text-secondary dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Filter Toggle (Mobile) */}
            <div className="container mx-auto px-4 mt-32 lg:hidden">
                <Button
                    variant="outline"
                    className="w-full justify-between rounded-2xl h-14 font-bold"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <span className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filters
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
            </div>

            <div className="container mx-auto px-4 mt-8 lg:mt-40 relative z-10 flex flex-col lg:flex-row gap-12">
                {/* Sidebar Filters */}
                <aside className={`w-full lg:w-64 space-y-8 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-xl border border-zinc-100 dark:border-white/5 sticky top-24">
                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">
                            Categories
                        </h3>
                        <div className="space-y-2 mb-8">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`w-full text-left px-5 py-3 rounded-xl font-bold transition-all ${selectedCategory === category
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-foreground'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">
                            Skill Level
                        </h3>
                        <div className="space-y-2">
                            {levels.map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setSelectedLevel(level)}
                                    className={`w-full text-left px-5 py-3 rounded-xl font-bold transition-all ${selectedLevel === level
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-foreground'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <div className="flex items-center justify-between mb-10">
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                            Showing <span className="text-secondary dark:text-white">{filteredCourses.length} courses</span>
                        </p>
                        <div className="flex gap-4">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-sm font-black uppercase tracking-widest cursor-pointer focus:outline-none"
                            >
                                <option value="Latest">Sort: Latest</option>
                                <option value="Price: Low to High">Sort: Price: Low to High</option>
                                <option value="Price: High to Low">Sort: Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Course Grid */}
                    {filteredCourses.length === 0 ? (
                        <div className="text-center py-32 bg-white dark:bg-zinc-900 rounded-[3rem] border border-dashed border-zinc-200 dark:border-white/10">
                            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">No courses found</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto">
                                Try adjusting your filters or search query to find what you&apos;re looking for.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-6"
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedCategory('All Courses')
                                    setSelectedLevel('All Levels')
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
                            {filteredCourses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
