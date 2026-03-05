import { NavBar, Footer, Button, Card } from "@mwenaro/ui";
import { Search, ArrowRight, Users, MapPin } from "lucide-react";
import { talentContent } from "@mwenaro/content/talent-content";

const statusColorMap: Record<string, string> = {
  "Ready to Hire": "bg-green-500/10 text-green-600 border-green-500/20",
  "Project Ready": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "Available": "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
};

export default function TalentPage() {
  const { hero, sampleTalents, metrics, finalCTA } = talentContent;

  return (
    <div className="min-h-screen bg-background">
      <NavBar currentApp="talent" />

      {/* HERO */}
      <section className="relative pt-48 pb-32 px-6 text-center lg:pt-56 lg:pb-40 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background -z-10" />
        <div className="max-w-5xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] animate-reveal tracking-tight text-foreground">
            {hero.headline}
          </h1>
          <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 mb-12 max-w-2xl mx-auto animate-reveal [animation-delay:200ms] leading-relaxed">
            {hero.subtext}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 animate-reveal [animation-delay:400ms]">
            <Button size="lg" variant="secondary" className="rounded-full px-12 h-16 text-lg shadow-[0_8px_30px_rgb(30,58,138,0.2)] hover:shadow-[0_12px_40px_rgb(30,58,138,0.3)] hover:-translate-y-1 transition-all duration-300 group">
              {hero.primaryCTA.text} <Search size={20} className="ml-2 group-hover:scale-110 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-12 h-16 text-lg border-zinc-200 dark:border-zinc-800 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 shadow-sm transition-all duration-300">
              {hero.secondaryCTA.text}
            </Button>
          </div>
        </div>
      </section>

      {/* CREDIBILITY METRICS */}
      <section className="py-12 bg-secondary/5 border-y border-primary/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24">
          {metrics.map((metric, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="text-4xl mb-2">{metric.icon}</div>
              <span className="font-bold text-muted-foreground">{metric.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TALENT SPOTLIGHT */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
              Spotlight: <span className="text-secondary tracking-normal">Featured</span> Talent
            </h2>
            <Button variant="ghost" className="font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white group text-base">
              View All Portfolios <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {sampleTalents.map((talent, i) => (
              <Card key={i} className="flex flex-col p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-zinc-950 border-zinc-200/50 dark:border-zinc-800/50 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-secondary to-blue-900 shadow-2xl flex items-center justify-center text-white text-4xl font-black ring-4 ring-white dark:ring-zinc-950">
                    {talent.name.charAt(0)}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full ring-1 ring-inset ${statusColorMap[talent.status]}`}>
                      {talent.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-3xl font-black mb-2 tracking-tight text-foreground">{talent.name}</h3>
                <p className="font-bold text-secondary text-base mb-6">{talent.role}</p>

                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-8 tracking-wider uppercase">
                  <MapPin size={16} className="text-secondary/70" /> {talent.location}
                </div>

                <div className="flex flex-wrap gap-2 mb-10">
                  {talent.skills.map(skill => (
                    <span key={skill} className="text-[11px] font-black px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-300">{skill}</span>
                  ))}
                </div>

                <Button variant="outline" className="w-full text-secondary hover:text-white hover:bg-secondary border-secondary/20 h-14 rounded-2xl text-base mt-auto group">
                  View Portfolio <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto bg-white dark:bg-black rounded-[3rem] p-16 md:p-24 text-center group border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(30,58,138,0.2)] transition-shadow duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-secondary/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-[2rem] bg-secondary/10 flex items-center justify-center text-secondary mx-auto mb-10 group-hover:scale-110 transition-transform duration-500 ring-8 ring-secondary/5">
              <Users size={40} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight text-foreground">{finalCTA.headline}</h2>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto mb-14 leading-relaxed tracking-wide">{finalCTA.subtext}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Button size="lg" variant="secondary" className="rounded-full px-12 h-16 text-lg shadow-[0_8px_30px_rgb(30,58,138,0.2)] hover:shadow-[0_12px_40px_rgb(30,58,138,0.3)] hover:-translate-y-1 transition-all duration-300 group">
                {finalCTA.primaryCTA.text} <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-12 h-16 text-lg border-zinc-200 dark:border-zinc-800 text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 shadow-sm transition-all duration-300">
                {finalCTA.secondaryCTA.text}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}