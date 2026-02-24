import { NavBar, Footer, Button, Card } from "@mwenaro/ui";
import { GraduationCap, Briefcase, Settings, ArrowRight, Target, Users, Zap } from "lucide-react";

export default function Home() {
  const pillars = [
    {
      icon: <GraduationCap size={40} />,
      name: "Academy",
      headline: "Structured programs to produce job-ready developers",
      subtext: "Project-based programs with mentorship and guided learning.",
      cta: "Explore Academy",
      href: "/academy",
      color: "bg-primary"
    },
    {
      icon: <Briefcase size={40} />,
      name: "Talent",
      headline: "Curated network of African tech graduates",
      subtext: "Showcase verified portfolios to companies seeking talent.",
      cta: "Discover Talent",
      href: "/talent",
      color: "bg-secondary"
    },
    {
      icon: <Settings size={40} />,
      name: "Labs",
      headline: "Scalable digital solutions built with impact",
      subtext: "Custom web and software platforms for businesses and organizations.",
      cta: "Explore Labs",
      href: "/labs",
      color: "bg-orange-500"
    }
  ];

  const lifecycle = [
    {
      step: "01",
      name: "Learn",
      text: "Develop practical skills through structured, project-based learning",
      icon: <Target className="text-primary" size={32} />
    },
    {
      step: "02",
      name: "Showcase",
      text: "Showcase verified portfolios to hiring teams",
      icon: <Users className="text-secondary" size={32} />
    },
    {
      step: "03",
      name: "Innovate",
      text: "Contribute to real-world projects within the ecosystem",
      icon: <Zap className="text-orange-500" size={32} />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar currentApp="hub" />

      {/* HERO */}
      <section className="relative pt-40 pb-32 px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-black leading-tight mb-6">
          Building <span className="gradient-text">Africa’s Next</span> <br />
          Generation of Tech Talent
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
          Mwenaro is a structured tech ecosystem connecting learning, talent, and innovation 
          to drive digital growth across Africa.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Button size="lg" className="rounded-full px-10 group bg-primary">
            Explore the Academy <ArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-10 border-foreground/10 text-foreground hover:bg-foreground hover:text-background">
            Discover Talent
          </Button>
        </div>
      </section>

      {/* 3-PILLAR ECOSYSTEM */}
      <section className="py-32 px-6 bg-secondary/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">
            A Unified <span className="text-primary italic">Ecosystem</span> for Tech Excellence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {pillars.map((pillar) => (
              <Card key={pillar.name} className="flex flex-col items-start text-left p-10 hover:shadow-xl transition-shadow">
                <div className={`w-20 h-20 rounded-2xl ${pillar.color} flex items-center justify-center text-white mb-6`}>
                  {pillar.icon}
                </div>
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">{pillar.name}</h3>
                <h4 className="text-2xl font-black mb-4">{pillar.headline}</h4>
                <p className="text-muted-foreground mb-6">{pillar.subtext}</p>
                <a href={pillar.href} className="mt-auto flex items-center gap-2 font-black text-primary hover:underline">
                  {pillar.cta} <ArrowRight size={18} />
                </a>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* LIFECYCLE */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-20">
            The <span className="text-primary">Mwenaro Lifecycle</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {lifecycle.map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-6 border-4 border-background">
                  {item.icon}
                </div>
                <h4 className="text-2xl font-black mb-4">{item.name}</h4>
                <p className="text-muted-foreground px-4">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 bg-primary/10 text-center">
        <h2 className="text-5xl md:text-6xl font-black mb-6">
          Ready to Accelerate Your Tech Journey?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Whether you want to learn, hire, or build digital solutions, 
          Mwenaro is your structured partner in tech innovation.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Button size="lg" className="rounded-full px-12">Explore Academy</Button>
          <Button size="lg" variant="outline" className="rounded-full px-12">Discover Talent</Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}