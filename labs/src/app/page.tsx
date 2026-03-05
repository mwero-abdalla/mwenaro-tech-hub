import React from "react";
import { NavBar, Footer, Button, Card } from "@mwenaro/ui";
import { ArrowRight } from "lucide-react";
import { labsContent } from "@mwenaro/content/labs-content";

export default function LabsPage() {
    const { hero, pillars, projects, finalCTA } = labsContent;

    return (
        <main className="min-h-screen bg-background selection:bg-primary/20">
            <NavBar currentApp="labs" />

            {/* HERO */}
            <section className="relative pt-48 pb-32 px-6 text-center lg:pt-56 lg:pb-40 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
                <div className="max-w-5xl mx-auto relative z-10">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] animate-reveal tracking-tight text-foreground">
                        {hero.headline}
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 mb-12 animate-reveal [animation-delay:200ms] leading-relaxed">
                        {hero.subtext}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 animate-reveal [animation-delay:400ms]">
                        <Button size="lg" className="rounded-full px-12 h-16 text-lg shadow-[0_8px_30px_rgb(232,93,59,0.3)] hover:shadow-[0_12px_40px_rgb(232,93,59,0.4)] hover:-translate-y-1 transition-all duration-300 group">
                            {hero.primaryCTA.text} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-full px-12 h-16 text-lg border-zinc-200 dark:border-zinc-800 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 shadow-sm transition-all duration-300">
                            {hero.secondaryCTA.text}
                        </Button>
                    </div>
                </div>
            </section>

            {/* PILLARS */}
            <section className="py-32 bg-zinc-50 border-y border-zinc-200/50 dark:bg-zinc-900/50 dark:border-zinc-800/50">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {pillars.map((pillar, i) => (
                        <Card key={i} className="p-8 lg:p-10 rounded-[2.5rem] bg-white dark:bg-zinc-950 border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 group hover:-translate-y-1">
                            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 ring-4 ring-white dark:ring-zinc-950 shadow-sm group-hover:bg-primary/20 transition-colors">
                                <span className="text-3xl">{pillar.icon}</span>
                            </div>
                            <h3 className="text-3xl font-black mb-4 tracking-tight text-foreground">{pillar.title}</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-lg">{pillar.desc}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* PROJECTS */}
            <section className="py-40 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {projects.map((proj, i) => (
                        <Card key={i} className="!p-0 overflow-hidden group rounded-[3rem] border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-transform duration-500">
                            <div className={`aspect-[4/3] sm:aspect-video lg:aspect-[4/3] ${proj.bgColor} relative overflow-hidden`}>
                                <div className="absolute inset-0 flex items-center justify-center text-white/10 group-hover:scale-110 transition-transform duration-700">
                                    <span className="text-9xl transform -rotate-12">{proj.icon}</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                                    <div className="absolute bottom-0 left-0 right-0 p-10 sm:p-12 transition-transform duration-500 transform group-hover:-translate-y-4">
                                        <div className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-[11px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm">{proj.type}</div>
                                        <h3 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight">{proj.title}</h3>
                                        <p className="text-white/80 text-lg leading-relaxed max-w-lg">{proj.desc}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-40 px-6 bg-zinc-950 text-center relative overflow-hidden dark:bg-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50 pointer-events-none" />
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-black mb-8 animate-reveal text-white tracking-tight leading-tight">
                        {finalCTA.headline}
                    </h2>
                    <p className="text-xl md:text-2xl text-zinc-400 mb-14 max-w-2xl mx-auto animate-reveal [animation-delay:200ms] leading-relaxed">
                        {finalCTA.subtext}
                    </p>
                    <div className="flex justify-center animate-reveal [animation-delay:400ms]">
                        <Button size="lg" className="rounded-full px-14 h-16 text-lg font-bold bg-primary text-white shadow-[0_8px_30px_rgb(232,93,59,0.3)] hover:shadow-[0_12px_40px_rgb(232,93,59,0.5)] hover:-translate-y-1 transition-all duration-300">
                            {finalCTA.cta.text}
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}