import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { academyContent } from "@mwenaro/content/academy-content"

export default function ExecutiveAcademy() {
  const { hero, pillars, roadmap, finalCTA, footer } = academyContent

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* HERO */}
      <section className="relative w-full pt-40 pb-32 bg-[#F9FAFB] dark:bg-zinc-950 text-center overflow-hidden">
        <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[1.1] text-secondary dark:text-white animate-reveal">
          {hero.headline.split("\n").map((line, i) => (
            <span key={i} className={i === 0 ? "" : "text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 block"}>{line}</span>
          ))}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-medium animate-reveal [animation-delay:200ms]">
          {hero.subtext}
        </p>
        <div className="flex flex-wrap justify-center gap-6 animate-reveal [animation-delay:400ms]">
          <Link href={hero.primaryCTA.href}>
            <Button size="lg" className="px-12 h-14 bg-primary text-white font-black rounded-full hover:bg-primary/90 shadow-lg">
              {hero.primaryCTA.text}
            </Button>
          </Link>
          <Link href={hero.secondaryCTA.href}>
            <Button size="lg" variant="outline" className="px-12 h-14 font-bold rounded-full border-zinc-200 hover:bg-zinc-50 dark:border-white/10">
              {hero.secondaryCTA.text}
            </Button>
          </Link>
        </div>
      </section>

      {/* KEY PILLARS */}
      <section className="py-32 px-6 bg-secondary/5 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-16">
          A Structured Ecosystem for Tech Excellence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {pillars.map((pillar, i) => (
            <div key={i} className="flex flex-col items-center p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl gap-4">
              <div className="w-20 h-20 flex items-center justify-center text-4xl">{pillar.icon}</div>
              <h3 className="text-2xl font-black text-secondary dark:text-white">{pillar.title}</h3>
              <p className="text-muted-foreground text-center">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROADMAP */}
      <section className="py-32 px-6 bg-white dark:bg-zinc-950 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-16">How Our Academy Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
          {roadmap.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-4 p-6 relative">
              <div className="w-16 h-16 rounded-3xl bg-primary text-white flex items-center justify-center text-2xl font-black shadow-xl">{item.icon}</div>
              <h4 className="text-xl font-black text-secondary dark:text-white">{item.title}</h4>
              <p className="text-muted-foreground text-center text-sm">{item.desc}</p>
              <span className="text-[6rem] opacity-5 font-black absolute select-none">{item.step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 bg-gradient-to-br from-primary to-orange-600 text-white text-center">
        <h2 className="text-5xl md:text-6xl font-black mb-6">{finalCTA.headline}</h2>
        <p className="text-xl mb-12 max-w-2xl mx-auto font-medium">{finalCTA.subtext}</p>
        <Link href={finalCTA.cta.href}>
          <Button size="lg" className="px-12 h-14 bg-white text-primary font-black rounded-full shadow-xl hover:bg-gray-100">
            {finalCTA.cta.text}
          </Button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-border dark:border-white/5 bg-zinc-50 dark:bg-zinc-950 text-center">
        <p className="font-black text-2xl text-secondary dark:text-white mb-4">{footer.name}</p>
        <div className="flex justify-center gap-8 text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
          {footer.links.map((link, i) => (
            <Link key={i} href={link.href} className="hover:text-primary">{link.text}</Link>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{footer.copyright}</p>
      </footer>
    </div>
  )
}