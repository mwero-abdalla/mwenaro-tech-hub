// content/hubContent.ts

import { GraduationCap, Briefcase, Settings, Target, Users, Zap } from "lucide-react";
import { ecosystem } from "@mwenaro/config/ecosystem";

export const hubContent = {
  hero: {
    badge: "Built in Africa. Built for Scale.",
    title: "Building Africa's Next Generation of Tech Talent",
    description: `Mwenaro is a structured tech ecosystem connecting learning, talent, and innovation
      to drive digital growth across Africa.`,
    ctas: [
      { text: "Explore Academy", href: ecosystem.academy, type: "primary" },
      { text: "Discover Talent", href: ecosystem.talent, type: "outline" },
    ],
  },

  pillars: [
    {
      icon: <GraduationCap size={40} />,
      name: "Academy",
      headline: "Structured programs to produce job-ready developers",
      subtext: "Project-based programs with mentorship and guided learning.",
      cta: "Explore Academy",
      href: ecosystem.academy,
      color: "bg-primary",
    },
    {
      icon: <Briefcase size={40} />,
      name: "Talent",
      headline: "Curated network of African tech graduates",
      subtext: "Showcase verified portfolios to companies seeking talent.",
      cta: "Discover Talent",
      href: ecosystem.talent,
      color: "bg-secondary",
    },
    {
      icon: <Settings size={40} />,
      name: "Labs",
      headline: "Scalable digital solutions built with impact",
      subtext: "Custom web and software platforms for reliability and scale.",
      cta: "Explore Labs",
      href: ecosystem.labs,
      color: "bg-orange-500",
    },
  ],

  lifecycle: [
    {
      step: "01",
      name: "Learn",
      text: "Develop practical skills through structured, project-based learning",
      icon: <Target className="text-primary" size={32} />,
    },
    {
      step: "02",
      name: "Showcase",
      text: "Showcase verified portfolios to hiring teams",
      icon: <Users className="text-secondary" size={32} />,
    },
    {
      step: "03",
      name: "Innovate",
      text: "Contribute to real-world projects within the ecosystem",
      icon: <Zap className="text-orange-500" size={32} />,
    },
  ],

  whyMwenaro: {
    headline: "Building Career-Ready Developers Across Africa",
    description:
      "Project-based curriculum • Mentor-guided tracks • Portfolio-focused assessment • Ecosystem-driven opportunities",
  },

  finalCTA: {
    headline: "Ready to Accelerate Your Tech Journey?",
    description:
      "Whether you want to learn, hire, or build digital solutions, Mwenaro is your structured partner in tech innovation.",
    ctas: [
      { text: "Explore Academy", href: ecosystem.academy, type: "primary" },
      { text: "Discover Talent", href: ecosystem.talent, type: "outline" },
    ],
  },
};