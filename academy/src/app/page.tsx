import { Button } from "@/components/ui/button"
import Link from 'next/link'
import Image from 'next/image'

export default function ExecutiveAcademy() {
  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* Hero */}
      <section className="relative w-full py-32 bg-[#F9FAFB] dark:bg-zinc-950 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-secondary dark:text-white">
          Master Tech Skills with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Expert Guidance</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 font-medium">
          Join a premium learning ecosystem combining structured programs, mentorship, and AI-assisted project feedback.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/signup">
            <Button size="lg" className="px-12 h-14 bg-primary text-white font-black rounded-2xl hover:bg-primary/90">
              Start Learning Free
            </Button>
          </Link>
          <Link href="#">
            <Button size="lg" variant="outline" className="px-12 h-14 font-bold rounded-2xl border-zinc-200 hover:bg-zinc-50 dark:border-white/10">
              Watch Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Key Pillars */}
      <section className="py-32 px-6 bg-secondary/5 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-16">
          A Structured Ecosystem for Tech Excellence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            { title: "Learn", desc: "Structured programs from beginner to professional", icon: "🎓" },
            { title: "Build", desc: "Hands-on projects with AI-assisted feedback", icon: "🛠️" },
            { title: "Launch", desc: "Verified certification and portfolio for career growth", icon: "🚀" }
          ].map((pillar, i) => (
            <div key={i} className="flex flex-col items-center p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl gap-4">
              <div className="w-20 h-20 flex items-center justify-center text-4xl">{pillar.icon}</div>
              <h3 className="text-2xl font-black text-secondary dark:text-white">{pillar.title}</h3>
              <p className="text-muted-foreground text-center">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works / Roadmap */}
      <section className="py-32 px-6 bg-white dark:bg-zinc-950 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-16">How Our Academy Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
          {[
            { step: "01", title: "Enroll", desc: "Join a high-achieving cohort", icon: "🎯" },
            { step: "02", title: "Learn", desc: "Interactive modules with AI assistance", icon: "💡" },
            { step: "03", title: "Build", desc: "Apply skills on real projects", icon: "🛠️" },
            { step: "04", title: "Launch", desc: "Earn certificates and start your career", icon: "🚀" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-4 p-6">
              <div className="w-16 h-16 rounded-3xl bg-primary text-white flex items-center justify-center text-2xl font-black shadow-xl">{item.icon}</div>
              <h4 className="text-xl font-black text-secondary dark:text-white">{item.title}</h4>
              <p className="text-muted-foreground text-center text-sm">{item.desc}</p>
              <span className="text-[6rem] opacity-5 font-black absolute select-none">{item.step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-gradient-to-br from-primary to-orange-600 text-white text-center">
        <h2 className="text-5xl md:text-6xl font-black mb-6">Ready to Scale Up Your Career?</h2>
        <p className="text-xl mb-12 max-w-2xl mx-auto font-medium">
          Join the next cohort and transition into a high-paying tech career.
        </p>
        <Link href="/signup">
          <Button size="lg" className="px-12 h-14 bg-white text-primary font-black rounded-2xl shadow-xl hover:bg-gray-100">
            Enroll Now Free
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border dark:border-white/5 bg-zinc-50 dark:bg-zinc-950 text-center">
        <p className="font-black text-2xl text-secondary dark:text-white mb-4">Mwenaro Tech Academy</p>
        <div className="flex justify-center gap-8 text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
          <Link href="/courses" className="hover:text-primary">Courses</Link>
          <Link href="#" className="hover:text-primary">Blog</Link>
          <Link href="#" className="hover:text-primary">About</Link>
        </div>
        <p className="text-sm text-muted-foreground">&copy; 2026 Mwenaro Tech Academy. All rights reserved.</p>
      </footer>
    </div>
  )
}