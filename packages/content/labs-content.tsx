import { ecosystem } from "@mwenaro/config/ecosystem";

export const labsContent = {
  hero: {
    headline: "Custom Software Built for Growth",
    subtext: "We design, build, and maintain scalable web platforms and business systems for startups and growing organizations.",
    primaryCTA: { text: "Start a Project", href: `${ecosystem.hub}/contact` },
    secondaryCTA: { text: "Partner with Us", href: `${ecosystem.hub}/contact` }
  },

  pillars: [
    {
      icon: "💻",
      title: "Web Applications",
      desc: "End-to-end development of high-performance web and mobile applications tailored for impact."
    },
    {
      icon: "🤖",
      title: "AI & Automation",
      desc: "Integrating intelligent systems and workflows to drive efficiency and smarter decision making."
    },
    {
      icon: "🌐",
      title: "Digital Transformation",
      desc: "Helping organizations navigate the digital age with hands-on, technical implementation."
    }
  ],

  projects: [
    {
      type: "Internal Tool",
      title: "Mwenaro Flow",
      desc: "A workforce matching engine for talent coordination.",
      bgColor: "bg-secondary",
      icon: "✨"
    },
    {
      type: "Enterprise",
      title: "SafariLink CRM",
      desc: "Streamlining logistics for East African regional trade routes.",
      bgColor: "bg-primary/20",
      icon: "⚡"
    }
  ],

  finalCTA: {
    headline: "Have a big idea? Let's build it.",
    subtext: "We partner with visionary founders and established enterprises to ship digital products that matter. Our labs team is ready to scale your vision.",
    cta: { text: "Start a Conversation", href: `${ecosystem.hub}/contact` }
  }
};