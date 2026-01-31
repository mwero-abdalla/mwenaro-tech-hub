import { Button } from "@/components/ui/button";
import {
    Users, Award, BookOpen, Globe, Target, Heart,
    Lightbulb, Rocket, ArrowRight, CheckCircle
} from "lucide-react";

const stats = [
    { value: "10,000+", label: "Active Learners", icon: Users },
    { value: "150+", label: "Expert-Led Courses", icon: BookOpen },
    { value: "98%", label: "Completion Rate", icon: Award },
    { value: "50+", label: "Countries Reached", icon: Globe },
];

const values = [
    {
        icon: Target,
        title: "Quality First",
        description: "Every course is crafted by industry experts with real-world experience and updated regularly to stay current.",
    },
    {
        icon: Heart,
        title: "Student Success",
        description: "Our mission is your success. We provide mentorship, support, and resources to help you achieve your goals.",
    },
    {
        icon: Lightbulb,
        title: "Innovation",
        description: "We leverage AI and modern technology to create personalized, engaging learning experiences.",
    },
    {
        icon: Rocket,
        title: "Practical Skills",
        description: "Learn by doing. Every course includes hands-on projects that build your portfolio and real-world skills.",
    },
];

const team = [
    {
        name: "Alex Mwero",
        role: "Founder & CEO",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
        bio: "Former Google engineer with a passion for democratizing tech education.",
    },
    {
        name: "Sarah Chen",
        role: "Head of Curriculum",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
        bio: "10+ years in educational technology, building courses at top universities.",
    },
    {
        name: "David Okonkwo",
        role: "Lead Instructor",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
        bio: "Full-stack developer and AWS certified architect with 15+ years experience.",
    },
    {
        name: "Emily Martinez",
        role: "Student Success Manager",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
        bio: "Dedicated to helping every student achieve their career goals in tech.",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <main className="pt-20">
                {/* Hero Section */}
                <section className="gradient-hero py-20 md:py-28">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                            Empowering the Next Generation of Tech Talent
                        </h1>
                        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
                            Mwero Tech Academy is on a mission to make high-quality tech education accessible to everyone,
                            everywhere. We believe that with the right guidance and resources, anyone can build a successful career in technology.
                        </p>
                        <Button variant="accent" size="xl" className="hover:scale-105 transition-transform">
                            Join Our Community
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-16 -mt-12">
                    <div className="container mx-auto px-4">
                        <div className="bg-card rounded-2xl card-shadow p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-3">
                                        <stat.icon className="w-6 h-6 text-primary-foreground" />
                                    </div>
                                    <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
                                    <p className="text-muted-foreground">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Story */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                                    Our Story
                                </h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        Mwero Tech Academy was founded in 2020 with a simple belief: quality tech education
                                        shouldn't be limited by geography, background, or financial status.
                                    </p>
                                    <p>
                                        Our founder, Alex Mwero, experienced firsthand the challenges of learning to code
                                        without proper resources. After building a successful career at leading tech companies,
                                        he set out to create the learning platform he wished he had.
                                    </p>
                                    <p>
                                        Today, we've helped over 10,000 learners from 50+ countries launch their careers in tech.
                                        From self-paced courses to instructor-led bootcamps, we offer multiple pathways to success.
                                    </p>
                                </div>
                            </div>
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                                    alt="Students learning together"
                                    className="rounded-2xl card-shadow"
                                />
                                <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 card-shadow">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">5,000+</p>
                                            <p className="text-sm text-muted-foreground">Career Placements</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="py-16 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Our Values
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Everything we do is guided by our commitment to student success and educational excellence.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((value, index) => (
                                <div
                                    key={index}
                                    className="bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                                        <value.icon className="w-6 h-6 text-primary-foreground" />
                                    </div>
                                    <h3 className="font-display font-bold text-lg text-foreground mb-2">
                                        {value.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Meet Our Team
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Passionate educators and tech professionals dedicated to your success.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {team.map((member, index) => (
                                <div key={index} className="text-center group">
                                    <div className="relative mb-4 mx-auto w-48 h-48 rounded-2xl overflow-hidden">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <h3 className="font-display font-bold text-lg text-foreground">{member.name}</h3>
                                    <p className="text-primary font-medium text-sm mb-2">{member.role}</p>
                                    <p className="text-sm text-muted-foreground px-4">{member.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="gradient-hero rounded-3xl p-12 text-center">
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                                Ready to Start Your Journey?
                            </h2>
                            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                                Join thousands of learners who have transformed their careers with Mwero Tech Academy.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant="accent" size="xl" className="hover:scale-105 transition-transform">
                                    Get Started Free
                                </Button>
                                <Button
                                    variant="outline"
                                    size="xl"
                                    className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                                >
                                    Contact Us
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
