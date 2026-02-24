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
            <section className="relative pt-40 pb-32 text-center">
                <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[1.1] animate-reveal">
                    {hero.headline}
                </h1>
                <p className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed mb-12">
                    {hero.subtext}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <Button size="lg" className="rounded-full shadow-2xl">
                        {hero.primaryCTA.text} <ArrowRight className="ml-2" size={20} />
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-full">
                        {hero.secondaryCTA.text}
                    </Button>
                </div>
            </section>

            {/* PILLARS */}
            <section className="py-24 bg-secondary/5 border-y border-primary/10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pillars.map((pillar, i) => (
                        <Card key={i} className="p-8 rounded-[2.5rem] bg-background border border-border shadow-soft group hover:border-primary/30 transition-all duration-500">
                            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6">
                                <span className="text-2xl">{pillar.icon}</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{pillar.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{pillar.desc}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* PROJECTS */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {projects.map((proj, i) => (
                        <Card key={i} className="!p-0 overflow-hidden group">
                            <div className={`aspect-video ${proj.bgColor} relative`}>
                                <div className="absolute inset-0 flex items-center justify-center text-white/10">
                                    <span className="text-9xl">{proj.icon}</span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
                                    <div className="inline-block px-3 py-1 rounded-full bg-white text-primary text-[10px] font-black uppercase tracking-wider mb-4">{proj.type}</div>
                                    <h3 className="text-3xl font-bold text-white mb-2">{proj.title}</h3>
                                    <p className="text-white/70">{proj.desc}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-32 px-6 text-center bg-gradient-to-br from-primary to-orange-500 text-white">
                <h2 className="text-5xl md:text-6xl font-black mb-6">{finalCTA.headline}</h2>
                <p className="text-xl mb-12">{finalCTA.subtext}</p>
                <Button size="lg" className="rounded-full px-10">{finalCTA.cta.text}</Button>
            </section>

            <Footer />
        </main>
    );
}