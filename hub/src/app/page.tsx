import { NavBar, Footer, Button, Card } from "@mwenaro/ui";
import {
    GraduationCap,
    Briefcase,
    Settings,
    ArrowRight,
    Target,
    Users,
    TrendingUp,
    CheckCircle2,
    Sparkles,
    Globe,
    Zap
} from "lucide-react";

export default function Home() {
    const pillars = [
        {
            icon: <GraduationCap size={40} />,
            name: "Academy",
            headline: "Learn Tech Skills That Lead to Real Careers",
            subtext: "Self-paced or mentor-guided programs with AI-powered project feedback. Build real-world projects and earn certificates.",
            cta: "Start Learning",
            href: "/academy",
            color: "bg-primary"
        },
        {
            icon: <Briefcase size={40} />,
            name: "Talent",
            headline: "Discover Job-Ready Junior Developers",
            subtext: "Verified graduate portfolios with practical experience. Connect and hire top talent from our ecosystem.",
            cta: "Hire Talent",
            href: "/talent",
            color: "bg-secondary"
        },
        {
            icon: <Settings size={40} />,
            name: "Labs",
            headline: "Build and Maintain Digital Solutions",
            subtext: "Custom web and software solutions for startups, schools, and growing businesses.",
            cta: "Start a Project",
            href: "/labs",
            color: "bg-orange-500"
        }
    ];

    const featuredCourses = [
        { title: "Intro to Web Development", level: "Beginner", highlight: "HTML, CSS, JS, Git & GitHub", color: "from-blue-500 to-cyan-500", price: 16000, originalPrice: 20000 },
        { title: "Intro to React", level: "Intermediate", highlight: "Components, Hooks, State", color: "from-purple-500 to-pink-500", badge: "Coming Soon", price: 24000, originalPrice: 30000 },
        { title: "Fullstack Development", level: "Advanced", highlight: "Full production pipeline", color: "from-orange-500 to-red-500", badge: "Coming Soon", price: 75000, originalPrice: 89000 }
    ];

    return (
        <div className="min-h-screen bg-background">
            <NavBar currentApp="hub" />

            {/* 1. HERO SECTION */}
            <section className="relative pt-40 pb-32 px-6 overflow-hidden">
                {/* Animated Background Orbs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] animate-float" />
                </div>

                <div className="max-w-6xl mx-auto text-center animate-reveal">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card text-primary text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-xl border-primary/10">
                        <Sparkles size={16} className="animate-pulse" />
                        Accelerating Innovation in Africa
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground mb-8 leading-[1.1]">
                        Building <span className="gradient-text">Africa’s Next</span> <br />
                        Generation of Tech Talent
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-14 leading-relaxed font-medium">
                        Mwenaro Tech Hub trains, showcases, and connects tech professionals.
                        Learn new skills, get discovered, or build powerful digital solutions.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <Button size="lg" className="rounded-full px-10 group bg-primary">
                            🎓 Explore Courses <ArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-10 border-foreground/10 text-foreground hover:bg-foreground hover:text-background">
                            💼 Hire Talent
                        </Button>
                    </div>
                </div>
            </section>

            {/* 2. 3-PILLAR ECOSYSTEM OVERVIEW */}
            <section className="py-32 px-6 bg-secondary/5 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                        <div className="max-w-2xl text-left">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">A Unified <span className="text-primary italic">Ecosystem</span> for Tech Excellence</h2>
                            <p className="text-lg text-muted-foreground font-medium">We've integrated learning, hiring, and building into one seamless journey for developers and organizations.</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-primary">
                            <Globe size={20} /> Join 10k+ Learners
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {pillars.map((pillar) => (
                            <Card key={pillar.name} className="flex flex-col items-start text-left">
                                <div className={`w-20 h-20 rounded-2xl ${pillar.color} flex items-center justify-center text-white mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                    {pillar.icon}
                                </div>
                                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-3">{pillar.name}</h3>
                                <h4 className="text-2xl font-black mb-4 leading-tight group-hover:text-primary transition-colors">{pillar.headline}</h4>
                                <p className="text-muted-foreground mb-10 leading-relaxed font-medium line-clamp-3">{pillar.subtext}</p>
                                <a href={pillar.href} className="mt-auto flex items-center gap-3 font-black text-foreground hover:text-primary transition-all group/link">
                                    <span className="border-b-2 border-primary/20 group-hover/link:border-primary pb-1">{pillar.cta}</span>
                                    <ArrowRight size={20} className="group-hover/link:translate-x-2 transition-transform" />
                                </a>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. HOW IT WORKS - DYNAMIC INFOGRAPHIC */}
            <section className="py-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-card rounded-[4rem] p-16 md:p-24 relative overflow-hidden text-center bg-gradient-to-br from-white to-secondary/5">
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />

                        <h2 className="text-3xl md:text-5xl font-black mb-20">The Mwenaro <span className="text-primary">Lifecycle</span></h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                            {/* Connector Line */}
                            <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-orange-500/20 rounded-full" />

                            {[
                                { step: "01", name: "Learn", text: "Acquire high-demand skills in Mwenaro Academy", icon: <Target className="text-primary" size={32} /> },
                                { step: "02", name: "Showcase", text: "Get featured in Talent Platform for top roles", icon: <Users className="text-secondary" size={32} /> },
                                { step: "03", name: "Innovate", text: "Build real impact projects in Mwenaro Labs", icon: <Zap className="text-orange-500" size={32} /> }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center group">
                                    <div className="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center mb-8 relative border-4 border-background group-hover:scale-110 transition-transform duration-500 z-10">
                                        <span className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                                            {item.step}
                                        </span>
                                        {item.icon}
                                    </div>
                                    <h4 className="text-2xl font-black mb-4 tracking-tight">{item.name}</h4>
                                    <p className="text-muted-foreground font-medium px-4 leading-relaxed">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. FEATURED COURSES */}
            <section className="py-32 px-6 bg-muted/20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-20">
                        <div className="text-left">
                            <h2 className="text-4xl md:text-5xl font-black mb-4">Start Your <span className="text-primary">Journey</span></h2>
                            <p className="text-lg text-muted-foreground font-medium">Explore premium learning paths designed for the modern industry.</p>
                        </div>
                        <Button variant="outline" className="rounded-full px-8 group">
                            View All Courses <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {featuredCourses.map((course) => (
                            <div key={course.title} className="group p-1 rounded-[2.5rem] bg-gradient-to-br from-border to-transparent hover:from-primary/20 hover:to-primary/5 transition-all duration-500 shadow-sm hover:shadow-2xl">
                                <div className="bg-card rounded-[2.3rem] p-10 h-full flex flex-col relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${course.color} opacity-[0.03] rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-[0.08] transition-opacity`} />

                                    {course.badge && (
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-secondary text-white w-fit mb-6 shadow-lg">
                                            {course.badge}
                                        </span>
                                    )}

                                    <h4 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{course.title}</h4>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                                            <CheckCircle2 size={14} /> {course.level}
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <div className="text-sm font-black text-foreground">
                                                KSh {course.price.toLocaleString()}
                                            </div>
                                            {course.originalPrice && (
                                                <div className="text-[10px] font-bold text-muted-foreground line-through opacity-60">
                                                    KSh {course.originalPrice.toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-muted-foreground font-medium mb-12 line-clamp-2 leading-relaxed">{course.highlight}</p>

                                    <a href="/academy" className="mt-auto flex items-center gap-2 font-black text-sm text-foreground hover:text-primary transition-all group/link">
                                        Explore Path <ArrowRight size={18} className="group-hover/link:translate-x-2 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. SUCCESS STATS */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-black mb-24 leading-tight max-w-4xl mx-auto">
                        Our Graduates are <span className="text-primary">Hired</span> by the Best in the World
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-12 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 mb-32 items-center">
                        {["Google", "Apple", "Meta", "Amazon", "Netflix", "Microsoft"].map(brand => (
                            <span key={brand} className="text-2xl font-black tracking-tighter text-foreground whitespace-nowrap">{brand.toUpperCase()}</span>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { val: "10K+", label: "Active Learners" },
                            { val: "150+", label: "Masterbuilt Courses" },
                            { val: "95%", label: "Placement Rate" },
                            { val: "500+", label: "Hired Globally" }
                        ].map(stat => (
                            <div key={stat.label} className="p-12 rounded-[3rem] bg-secondary text-white relative group overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                    <div className="text-5xl font-black mb-4">{stat.val}</div>
                                    <div className="text-xs font-black text-primary/80 uppercase tracking-[0.2em]">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. FINAL CTA - ELITE GLASS PANAL */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto rounded-[4.5rem] bg-secondary p-16 md:p-32 text-center relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(232,93,59,0.3)]">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/30 to-transparent pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-10 leading-tight">Ready to Own Your <span className="text-primary">Future?</span></h2>
                        <p className="text-white/60 text-xl mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
                            Whether you want to learn high-end skills, hire the best talent in Africa, or build world-class software — Mwenaro Tech Hub is your partner.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Button size="lg" className="rounded-full px-12 h-16 text-xl shadow-2xl">
                                I Want up Learn
                            </Button>
                            <Button size="lg" variant="glass" className="rounded-full px-12 h-16 text-xl hover:bg-white/20">
                                I Want to Hire
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
