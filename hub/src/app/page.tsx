// import { hubContent } from "../content/hubContent";
import { hubContent } from "@mwenaro/content/hub-content"
import { Button, Card, NavBar, Footer } from "@mwenaro/ui";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar currentApp="hub" />

      {/* HERO */}
      <section className="relative pt-48 pb-32 px-6 text-center lg:pt-56 lg:pb-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10" />
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-8 ring-1 ring-primary/20 backdrop-blur-sm shadow-sm">
          {hubContent.hero.badge}
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight mb-8 animate-reveal max-w-5xl mx-auto text-foreground">
          {hubContent.hero.title}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-reveal [animation-delay:200ms] leading-relaxed">
          {hubContent.hero.description}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 animate-reveal [animation-delay:400ms]">
          {hubContent.hero.ctas.map((cta) => (
            <Button
              key={cta.text}
              as="a"
              href={cta.href}
              size="lg"
              className={`rounded-full px-10 h-14 text-base shadow-lg transition-all duration-300 group ${cta.type === "primary" ? "bg-primary shadow-[0_8px_30px_rgb(232,93,59,0.3)] hover:shadow-[0_12px_40px_rgb(232,93,59,0.4)]" : "bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-800 shadow-sm"}`}
            >
              {cta.text} {cta.type === "primary" && <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          ))}
        </div>
      </section>

      {/* 3-PILLAR ECOSYSTEM */}
      <section className="py-32 px-6 bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-100 dark:border-zinc-800/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-foreground">
              A Unified <span className="text-primary tracking-normal">Ecosystem</span> for Tech Excellence
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {hubContent.pillars.map((pillar) => (
              <Card key={pillar.name} className="flex flex-col items-start text-left p-10 lg:p-12 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-[2.5rem] bg-white dark:bg-zinc-950 border-zinc-200/50 dark:border-zinc-800/50 group">
                <div className={`w-20 h-20 rounded-2xl ${pillar.color} flex items-center justify-center text-white mb-8 shadow-lg ring-4 ring-white dark:ring-zinc-950`}>
                  {pillar.icon}
                </div>
                <h3 className="text-[11px] font-black text-primary/80 uppercase tracking-[0.2em] mb-3">{pillar.name}</h3>
                <h4 className="text-3xl font-black mb-4 tracking-tight text-foreground">{pillar.headline}</h4>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed max-w-xs">{pillar.subtext}</p>
                <a href={pillar.href} className="mt-auto inline-flex items-center gap-2 text-sm font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-wider group-hover:translate-x-1 duration-300">
                  {pillar.cta} <ArrowRight size={16} />
                </a>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* LIFECYCLE */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-24 animate-reveal tracking-tight text-foreground">
            The <span className="text-primary bg-primary/10 px-4 py-1 rounded-2xl">Mwenaro Lifecycle</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 lg:gap-20">
            {hubContent.lifecycle.map((item, index) => (
              <div key={item.step} className="flex flex-col items-center animate-reveal relative group" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="w-24 h-24 rounded-full bg-white dark:bg-zinc-900 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] flex items-center justify-center mb-8 border-[6px] border-zinc-50 dark:border-zinc-950 group-hover:scale-110 group-hover:border-primary/20 transition-all duration-500 z-10">
                  {item.icon}
                </div>
                <h4 className="text-2xl font-black mb-4 tracking-tight">{item.name}</h4>
                <p className="text-zinc-500 dark:text-zinc-400 px-4 leading-relaxed">{item.text}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-[3rem] left-[60%] w-full h-[2px] bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800 pointer-events-none -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY MWENARO */}
      <section className="py-32 px-6 border-y border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 animate-reveal tracking-tight text-foreground">
            {hubContent.whyMwenaro.headline}
          </h2>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium tracking-wide animate-reveal [animation-delay:200ms] leading-relaxed">
            {hubContent.whyMwenaro.description}
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 px-6 bg-zinc-950 text-center relative overflow-hidden dark:bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black mb-8 animate-reveal text-white tracking-tight leading-tight">
            {hubContent.finalCTA.headline}
          </h2>
          <p className="text-xl md:text-2xl text-zinc-400 mb-14 max-w-2xl mx-auto animate-reveal [animation-delay:200ms] leading-relaxed">
            {hubContent.finalCTA.description}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 animate-reveal [animation-delay:400ms]">
            {hubContent.finalCTA.ctas.map((cta) => (
              <Button
                key={cta.text}
                as="a"
                href={cta.href}
                size="lg"
                className={`rounded-full px-12 h-16 text-lg font-bold transition-all duration-300 ${cta.type === "primary" ? "bg-primary text-white shadow-[0_8px_30px_rgb(232,93,59,0.3)] hover:shadow-[0_12px_40px_rgb(232,93,59,0.5)] hover:-translate-y-1" : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10 shadow-lg hover:-translate-y-1"}`}
              >
                {cta.text}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}