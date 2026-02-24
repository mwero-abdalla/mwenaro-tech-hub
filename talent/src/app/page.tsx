import { NavBar, Footer, Button, Card } from "@mwenaro/ui";
import { Search, ArrowRight, Users, MapPin } from "lucide-react";
import { talentContent } from "@mwenaro/content/talent-content";

const statusColorMap: Record<string, string> = {
  "Ready to Hire": "bg-green-500/10 text-green-600 border-green-500/20",
  "Project Ready": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "Available": "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
};

export default function TalentPage() {
  const { hero, sampleTalents, finalCTA } = talentContent;

  return (
    <div className="min-h-screen bg-background">
      <NavBar currentApp="talent" />

      {/* HERO */}
      <section className="relative pt-40 pb-32 px-6 text-center overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[1.1] animate-reveal">
            {hero.headline}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-reveal [animation-delay:200ms]">
            {hero.subtext}
          </p>
          <div className="flex flex-wrap justify-center gap-6 animate-reveal [animation-delay:400ms]">
            <Button size="lg" variant="secondary" className="rounded-full px-10 group">
              {hero.primaryCTA.text} <Search size={22} className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 border-foreground/10 text-foreground hover:bg-foreground hover:text-background">
              {hero.secondaryCTA.text}
            </Button>
          </div>
        </div>
      </section>

      {/* TALENT SPOTLIGHT */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <h2 className="text-4xl md:text-5xl font-black">
              Spotlight: <span className="text-primary italic">Featured</span> Talent
            </h2>
            <Button variant="ghost" className="font-black group">
              View All Portfolios <ArrowRight size={22} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sampleTalents.map((talent, i) => (
              <Card key={i} className="flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-secondary/80 border-4 border-white shadow-2xl flex items-center justify-center text-white text-3xl font-black">
                    {talent.name.charAt(0)}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${statusColorMap[talent.status]}`}>
                      {talent.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-black mb-1">{talent.name}</h3>
                <p className="font-bold text-primary text-sm mb-4">{talent.role}</p>

                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-6 tracking-wide uppercase">
                  <MapPin size={14} className="text-secondary" /> {talent.location}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {talent.skills.map(skill => (
                    <span key={skill} className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-white/50 border border-border shadow-sm">{skill}</span>
                  ))}
                </div>

                <Button variant="glass" className="w-full text-secondary hover:text-white hover:bg-secondary">
                  View Portfolio <ArrowRight size={16} className="ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto glass-card rounded-[3rem] p-16 md:p-20 text-center group border-primary/10">
          <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
            <Users size={40} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">{finalCTA.headline}</h2>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto mb-12 leading-relaxed">{finalCTA.subtext}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button size="lg" variant="secondary" className="rounded-full px-10 group">
              {finalCTA.primaryCTA.text} <ArrowRight size={22} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 border-secondary/10 text-secondary hover:bg-secondary hover:text-white">
              {finalCTA.secondaryCTA.text}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}