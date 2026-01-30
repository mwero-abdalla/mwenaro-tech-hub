import { Button } from "@/components/ui/button"
import Link from 'next/link'
import Image from 'next/image'
import { getCourses } from '@/lib/courses'
import { CourseCard } from '@/components/course-card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default async function Home() {
  const courses = await getCourses()
  const featuredCourses = courses.slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-[#F9FAFB] dark:bg-zinc-950">
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 font-bold text-sm uppercase tracking-widest">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                AI-Powered Learning Platform
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-secondary dark:text-white">
                Master Tech Skills with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Expert Guidance</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Join thousands of learners transforming their careers with self-paced courses, instructor-led sessions, and AI-powered project feedback.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href="/signup">
                  <Button size="lg" className="h-14 px-10 text-lg font-black bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1 rounded-2xl">
                    Start Learning Free ➔
                  </Button>
                </Link>
                <Link href="#">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-zinc-200 hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5 rounded-2xl">
                    ▷ Watch Demo
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-12 pt-10">
                <div>
                  <p className="text-2xl font-black text-secondary dark:text-white">10K+</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Learners</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-secondary dark:text-white">150+</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tech Courses</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-secondary dark:text-white">95%</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Success Rate</p>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Journey Map Mockup */}
              <div className="relative p-8 rounded-[3rem] bg-white dark:bg-zinc-900 shadow-3xl border border-zinc-100 dark:border-white/5">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 p-6 backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-100 dark:border-white/10 rounded-[2rem] shadow-2xl z-20 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl">🏆</div>
                    <div>
                      <p className="text-sm font-black text-secondary dark:text-white">Certificate Ready</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">AI Generated</p>
                    </div>
                  </div>
                </div>

                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center border border-white/10">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto ring-1 ring-white/20">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    </div>
                    <h4 className="text-xl font-black text-white">Your Learning Journey Starts Here</h4>
                  </div>

                  {/* Abstract particles / lines */}
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                </div>

                <div className="mt-8 space-y-4">
                  {[
                    { step: "01", title: "Choose Your Path", desc: "Self-paced or Instructor-led" },
                    { step: "02", title: "Learn & Build Projects", desc: "Get AI-powered feedback" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-6 p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 group hover:bg-white dark:hover:bg-zinc-800 transition-colors cursor-default">
                      <span className="text-xl font-black text-zinc-300 group-hover:text-primary transition-colors">{item.step}</span>
                      <div>
                        <p className="text-sm font-black text-secondary dark:text-white">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-100 dark:border-white/10 rounded-full shadow-2xl flex items-center gap-3 whitespace-nowrap z-20">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-zinc-200"></div>)}
                  </div>
                  <span className="text-[10px] font-black text-secondary dark:text-white uppercase tracking-wider">+500 joined today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar - Hiring Partners */}
      <section className="py-12 bg-white dark:bg-zinc-950 border-b border-border/50 overflow-hidden">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mb-10">Our Graduates Work At</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            {['GOOGLE', 'APPLE', 'META', 'AMAZON', 'NETFLIX', 'MICROSOFT'].map(brand => (
              <span key={brand} className="text-2xl font-black tracking-tighter text-secondary dark:text-white">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Preview */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em]">Trending Now</h2>
              <h3 className="text-4xl md:text-5xl font-black text-secondary dark:text-white">Start Your Learning Journey</h3>
            </div>
            <Link href="/courses">
              <Button variant="outline" className="font-bold border-primary/20 text-primary hover:bg-primary/5 px-8 h-12 rounded-xl">
                View All 50+ Courses
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em]">Your Roadmap</h2>
            <h3 className="text-4xl md:text-5xl font-black text-secondary dark:text-white">How Mwenaro Works</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A seamless, structured path designed to take you from curious beginner to expert professional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5" />

            {[
              { step: "01", title: "Enroll", desc: "Choose your course and join a high-achieving cohort.", icon: "🎯" },
              { step: "02", title: "Master", desc: "Learn with interactive labs and AI-assisted modules.", icon: "💡" },
              { step: "03", title: "Build", desc: "Apply knowledge to real projects reviewed by pros.", icon: "🛠️" },
              { step: "04", title: "Scale", desc: "Earn your certificate and launch your dream career.", icon: "🚀" }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-primary text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-primary/20 ring-4 ring-white dark:ring-zinc-950">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xl font-black mb-2 text-secondary dark:text-white">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
                <span className="absolute -top-4 text-[6rem] opacity-[0.03] font-black -z-10 text-secondary dark:text-white select-none">
                  {item.step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 blur-[120px] rounded-full translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">Student Stories</h2>
            <h3 className="text-4xl md:text-5xl font-black">Success Is Our Default</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah K.", role: "Frontend Dev at Meta", quote: "The AI marking gave me the courage to push my code further. I learned more in 3 months here than 4 years of college.", avatar: "SK" },
              { name: "John Doe", role: "Backend Engineer", quote: "Direct access to instructors via chat was the game changer. No more being stuck for days on a single bug.", avatar: "JD" },
              { name: "Alice M.", role: "UI/UX Designer", quote: "Mwenaro doesn't just teach tools; they teach workflows. I was job-ready before I even finished the course.", avatar: "AM" }
            ].map((t, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm space-y-6">
                <div className="flex text-primary">
                  {[1, 2, 3, 4, 5].map(s => <svg key={s} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                </div>
                <p className="text-lg italic leading-relaxed text-gray-300">"{t.quote}"</p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-black">{t.avatar}</div>
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em]">Common Questions</h2>
            <h3 className="text-4xl font-black text-secondary dark:text-white">Everything You Need to Know</h3>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              { q: "Is Mwenaro Tech Academy for absolute beginners?", a: "Absolutely! We have introductory paths designed specifically for those with zero experience, leading up to professional mastery." },
              { q: "How long does a typical course take?", a: "Most learners complete a professional-track course in 8-12 weeks, depending on their pace and the complexity of the subject." },
              { q: "What kind of support will I receive?", a: "You get 24/7 AI tutoring, direct chat access to instructors, and weekly live sessions with your cohort." },
              { q: "Is the certificate recognized by employers?", a: "Yes. Our certificates are verified and recognized by our network of hiring partners who trust our rigorous project-based learning." }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-none bg-zinc-50 dark:bg-zinc-900 px-8 rounded-3xl">
                <AccordionTrigger className="text-lg font-black hover:no-underline text-left py-6">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Newsletter / Lead Magnet */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-950 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 p-12 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-xl border border-border/50">
            <div className="flex-1 space-y-4">
              <h3 className="text-3xl font-black">Stay in the Loop</h3>
              <p className="text-muted-foreground">Receive weekly tech insights, career tips, and exclusive course discounts directly in your inbox.</p>
            </div>
            <div className="flex-1 w-full space-y-4">
              <div className="flex gap-2">
                <input type="email" placeholder="Email Address" className="flex-1 h-14 px-6 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-transparent focus:border-primary/50 focus:ring-0 font-bold" />
                <Button className="h-14 px-8 font-black bg-secondary dark:bg-primary rounded-2xl">Join</Button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center font-bold uppercase tracking-widest">Join 50k+ readers. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 relative overflow-hidden bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto p-12 lg:p-20 rounded-[3rem] bg-gradient-to-br from-primary to-orange-600 shadow-3xl text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight font-black">Ready to scale up?</h2>
              <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto font-medium">
                Join our next cohort and transition into a high-paying tech career.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="h-14 px-10 text-lg font-black bg-white text-primary hover:bg-gray-100 rounded-xl shadow-xl">
                    Enroll Now Free
                  </Button>
                </Link>
                <p className="text-sm font-bold text-white/60">Success is 3 clicks away.</p>
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
