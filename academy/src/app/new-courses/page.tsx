import Link from 'next/link';
import { BookOpen, Code, Database, Layers } from 'lucide-react';

const courses = [
    {
        title: "MERN Full-Stack Engineering Bootcamp",
        slug: "fullstack",
        description: "The ultimate 37-module curriculum taking you from zero to deployed fullstack engineer, covering everything from DNS to Next.js caching.",
        icon: Layers,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20"
    },
    {
        title: "Web Foundations & Engineering",
        slug: "web-foundations",
        description: "Master the absolute fundamentals of the internet, HTML5, CSS layout architecture, and Modern JavaScript.",
        icon: BookOpen,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    {
        title: "React Frontend Engineering",
        slug: "react-frontend",
        description: "Build type-safe, performant Single Page Applications (SPAs) using React, TypeScript, and modern state management.",
        icon: Code,
        color: "text-sky-500",
        bg: "bg-sky-500/10",
        border: "border-sky-500/20"
    },
    {
        title: "Backend API Engineering",
        slug: "backend-api",
        description: "Architect production-grade Node.js systems, design resilient MongoDB databases, and master JWT Authentication and Clean Architecture.",
        icon: Database,
        color: "text-green-500",
        bg: "bg-green-500/10",
        border: "border-green-500/20"
    }
];

export default function NewCoursesIndex() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-32 pb-20 px-6 md:px-12 lg:px-20">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="space-y-4 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">
                        Curriculum Preview
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                        Select a course track below to vet the newly expanded Markdown content, interactive quizzes, and Mermaid architectures.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {courses.map((course) => {
                        const Icon = course.icon;
                        return (
                            <Link 
                                key={course.slug} 
                                href={`/new-courses/${course.slug}`}
                                className="group relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden block"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-current opacity-5 blur-3xl ${course.color}`} />
                                
                                <div className="space-y-6 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${course.bg} ${course.color} ${course.border}`}>
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white group-hover:text-primary transition-colors">
                                            {course.title}
                                        </h2>
                                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                            {course.description}
                                        </p>
                                    </div>

                                    <div className="text-sm font-bold text-primary flex items-center gap-2">
                                        Vet Course Material 
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
