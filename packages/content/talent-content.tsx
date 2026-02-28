import { ecosystem } from "@mwenaro/config/ecosystem";

export const talentContent = {
  hero: {
    headline: "Hire Developers Trained Through Structured, Project-Based Learning",
    subtext: "Every candidate has completed real production-level projects within the Mwenaro ecosystem.",
    primaryCTA: { text: "Browse Talent", href: ecosystem.talent },
    secondaryCTA: { text: "Partner With Us", href: `${ecosystem.hub}/contact` }
  },

  sampleTalents: [
    {
      name: "Isaac Ndaro",
      role: "Software Engineer",
      skills: ["Next.js", "TypeScript", "Go", "PostgreSQL"],
      status: "Ready to Hire",
      location: "Mombasa, KE"
    },
    {
      name: "Dama Karisa",
      role: "Frontend Architect",
      skills: ["React", "Tailwind", "Figma", "Redux"],
      status: "Project Ready",
      location: "Kilifi, KE"
    },
    {
      name: "Alex Kamau",
      role: "Product Designer",
      skills: ["Figma", "Design Systems", "Prototyping"],
      status: "Available",
      location: "Nyeri, KE"
    }
  ],

  metrics: [
    { label: "Structured Technical Assessments", icon: "💡" },
    { label: "Portfolio Review", icon: "📂" },
    { label: "Git Workflow Proficiency", icon: "🛠️" },
    { label: "Communication & Collaboration Training", icon: "🤝" }
  ],

  finalCTA: {
    headline: "Ready to Boost Your Engineering Team?",
    subtext: "Access developers who are trained, project-ready, and capable of contributing from day one.",
    primaryCTA: { text: "Hire Talent Now", href: ecosystem.talent },
    secondaryCTA: { text: "Request Partnership", href: `${ecosystem.hub}/contact` }
  }
};