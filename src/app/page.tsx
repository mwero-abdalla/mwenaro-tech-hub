import { Button } from "@/components/ui/button"
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-secondary to-background text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(232,93,59,0.3),transparent)]"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-block px-4 py-1.5 mb-2 rounded-full bg-primary/20 border border-primary/30 text-primary font-bold text-sm uppercase tracking-widest animate-pulse">
                ✨ The Future of Tech Education
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
                Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Future</span> of Technology
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Join Mwenaro Tech Academy and launch your career with AI-powered personalized learning, expert mentorship, and industry-leading courses.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href="/signup">
                  <Button size="lg" className="h-14 px-8 text-lg font-black bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1 rounded-xl">
                    Enroll Now Free
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-white/20 hover:bg-white/10 backdrop-blur-sm rounded-xl">
                    Explore Courses
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-6 pt-8 text-sm font-bold text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  4.9/5 Rating
                </div>
                <div className="w-px h-4 bg-gray-700"></div>
                <div>10,000+ Students</div>
                <div className="w-px h-4 bg-gray-700"></div>
                <div>Top Rated AI Ed-Tech</div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-blue-500/20 rounded-[2rem] blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-3xl">
                <Image
                  src="/assets/hero_tech_ai.png"
                  alt="Mwenaro Tech Academy Hero"
                  width={1200}
                  height={800}
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent"></div>

                {/* Floating Badge */}
                <div className="absolute bottom-8 left-8 right-8 p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-secondary bg-gray-800 flex items-center justify-center text-[10px] font-black">
                          U{i}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">Join 500+ students this week</p>
                      <p className="text-xs text-gray-400">Personalized learning paths active now.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Spotlight */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em]">Built for Professionals</h2>
            <h3 className="text-4xl md:text-5xl font-black text-secondary dark:text-white">Learn Smarter, Not Harder</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We've integrated cutting-edge AI technology and industry workflows to ensure you're job-ready from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Grading",
                desc: "Get instant, professional-grade feedback on your projects and code using our specialized AI tutor.",
                icon: "🤖",
                color: "bg-orange-500/10 text-orange-600"
              },
              {
                title: "Real-time Mentorship",
                desc: "Stuck on a problem? Our messaging system connects you directly with instructors and expert support.",
                icon: "⚡",
                color: "bg-blue-500/10 text-blue-600"
              },
              {
                title: "Industry Projects",
                desc: "Build a portfolio that stands out. Work on real-world scenarios designed by Silicon Valley engineers.",
                icon: "💼",
                color: "bg-green-500/10 text-green-600"
              },
              {
                title: "Sequential Learning",
                desc: "Master concepts step-by-step with a curriculum that adapts to your pace and unlocks as you grow.",
                icon: "📚",
                color: "bg-purple-500/10 text-purple-600"
              },
              {
                title: "Verified Certificates",
                desc: "Earn certifications that carry weight with employers, validated by our academy's rigorous standards.",
                icon: "🏆",
                color: "bg-yellow-500/10 text-yellow-600"
              },
              {
                title: "Vibrant Community",
                desc: "Join cohorts of like-minded learners. Collaborate, network, and grow your tech circle.",
                icon: "🎨",
                color: "bg-pink-500/10 text-pink-600"
              }
            ].map((feat, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-border border-white/10 hover:border-primary/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 dark:bg-zinc-900/50">
                <div className={`w-14 h-14 rounded-2xl ${feat.color} flex items-center justify-center text-2xl mb-6 shadow-sm`}>
                  {feat.icon}
                </div>
                <h4 className="text-xl font-black mb-3 text-secondary dark:text-white group-hover:text-primary transition-colors">{feat.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="py-20 bg-secondary text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div>
              <p className="text-5xl font-black text-primary mb-2">95%</p>
              <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Job Placement Rate</p>
            </div>
            <div>
              <p className="text-5xl font-black text-white mb-2">250+</p>
              <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Advanced Lessons</p>
            </div>
            <div>
              <p className="text-5xl font-black text-white mb-2">15k</p>
              <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Active Learners</p>
            </div>
            <div>
              <p className="text-5xl font-black text-white mb-2">4.9</p>
              <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Average Review</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto p-12 lg:p-20 rounded-[3rem] bg-gradient-to-br from-primary to-orange-600 shadow-3xl text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Ready to start your<br />journey today?</h2>
              <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
                Join our next cohort starting Monday. Special early-bird discounts available for new students.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="h-14 px-10 text-lg font-black bg-white text-primary hover:bg-gray-100 rounded-xl shadow-xl">
                    Get Started Free
                  </Button>
                </Link>
                <p className="text-sm font-bold text-white/60">No credit card required to start.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border dark:border-white/5 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4 text-center space-y-6">
          <p className="font-black text-2xl tracking-tighter text-secondary dark:text-white">Mwenaro Tech Academy</p>
          <div className="flex justify-center gap-8 text-sm font-bold text-muted-foreground uppercase tracking-widest">
            <Link href="/courses" className="hover:text-primary">Courses</Link>
            <Link href="#" className="hover:text-primary">Blog</Link>
            <Link href="#" className="hover:text-primary">About</Link>
            <Link href="#" className="hover:text-primary">Privacy</Link>
          </div>
          <p className="text-sm text-muted-foreground pt-4">&copy; 2026 Mwenaro Tech Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
