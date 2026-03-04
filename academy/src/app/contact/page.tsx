'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Mail, Phone, MapPin, MessageCircle, Clock,
    Send, HelpCircle, BookOpen, Users, Headphones, Video, Calendar, ArrowRight
} from "lucide-react";

const contactInfo = [
    {
        icon: Mail,
        title: "Email Us",
        detail: "support@mwenaro.co.ke",
        description: "We'll respond within 24 hours",
    },
    {
        icon: Phone,
        title: "Call Us",
        detail: "+254 116 477 282",
        description: "Mon-Fri, 9am-6pm EAT",
    },
    {
        icon: Video,
        title: "Book a Call",
        detail: "15-min Discovery",
        description: "Schedule via Calendly",
        href: "https://calendly.com/mwenaro"
    },
    {
        icon: MapPin,
        title: "Visit Us",
        detail: "Likoni, Mombasa",
        description: "By appointment only",
    },
];

const faqItems = [
    {
        question: "How do I enroll in a course?",
        answer: "Simply create an account, browse our course catalog, and click 'Enroll Now' on any course. You can start learning immediately after enrollment.",
    },
    {
        question: "Do you offer refunds?",
        answer: "Yes! We offer a 30-day money-back guarantee on all courses. If you're not satisfied, contact support for a full refund.",
    },
    {
        question: "Are certificates included?",
        answer: "Yes, all courses include a certificate of completion that you can share on LinkedIn or with employers.",
    },
    {
        question: "Can I access courses on mobile?",
        answer: "Absolutely! Our platform is fully responsive and works on all devices. Learn anywhere, anytime.",
    },
];

const supportOptions = [
    {
        icon: Calendar,
        title: "Discovery Call",
        description: "Book a free 15-minute intro",
        href: "https://calendly.com/mwenaro"
    },
    {
        icon: MessageCircle,
        title: "Live Chat",
        description: "Get instant help from our support team",
    },
    {
        icon: HelpCircle,
        title: "Help Center",
        description: "Browse FAQs and documentation",
    },
    {
        icon: BookOpen,
        title: "Learning Resources",
        description: "Access guides and tutorials",
    },
    {
        icon: Users,
        title: "Community",
        description: "Connect with other learners",
    },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="pt-20">
                {/* Hero */}
                <section className="gradient-hero py-16 md:py-20">
                    <div className="container mx-auto px-4 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-6">
                            <Headphones className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                            Get in Touch
                        </h1>
                        <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                            Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
                        </p>
                    </div>
                </section>

                {/* Contact Info Cards */}
                <section className="py-12 -mt-8">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {contactInfo.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 group"
                                >
                                    {(item as any).href ? (
                                        <a href={(item as any).href} target="_blank" rel="noopener noreferrer">
                                            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <item.icon className="w-6 h-6 text-primary-foreground" />
                                            </div>
                                            <h3 className="font-display font-bold text-lg text-foreground mb-1 flex items-center gap-2">
                                                {item.title}
                                                <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                            </h3>
                                            <p className="text-primary font-medium">{item.detail}</p>
                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                        </a>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                                                <item.icon className="w-6 h-6 text-primary-foreground" />
                                            </div>
                                            <h3 className="font-display font-bold text-lg text-foreground mb-1">
                                                {item.title}
                                            </h3>
                                            <p className="text-primary font-medium">{item.detail}</p>
                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Form & Support Options */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-3 gap-12">
                            {/* Form */}
                            <div className="lg:col-span-2">
                                <div className="bg-card rounded-2xl p-8 card-shadow">
                                    <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                                        Send us a Message
                                    </h2>

                                    {!isSubmitted ? (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Full Name</Label>
                                                    <Input
                                                        id="name"
                                                        placeholder="John Doe"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="subject">Subject</Label>
                                                <Input
                                                    id="subject"
                                                    placeholder="How can we help?"
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message">Message</Label>
                                                <Textarea
                                                    id="message"
                                                    placeholder="Tell us more about your inquiry..."
                                                    rows={6}
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <Button type="submit" size="lg" className="gradient-bg text-primary-foreground">
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Message
                                            </Button>
                                        </form>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                                <Send className="w-8 h-8 text-primary" />
                                            </div>
                                            <h3 className="font-display text-xl font-bold text-foreground mb-2">
                                                Message Sent!
                                            </h3>
                                            <p className="text-muted-foreground mb-6">
                                                Thanks for reaching out. We'll get back to you within 24 hours.
                                            </p>
                                            <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                                                Send Another Message
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Support Options */}
                            <div>
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                                    Other Ways to Help
                                </h2>
                                <div className="space-y-4">
                                    {supportOptions.map((option, index) => (
                                        <a
                                            key={index}
                                            href={(option as any).href || "#"}
                                            target={(option as any).href ? "_blank" : undefined}
                                            rel={(option as any).href ? "noopener noreferrer" : undefined}
                                            className="w-full flex items-center gap-4 bg-card rounded-xl p-4 card-shadow hover:card-shadow-hover transition-all duration-300 text-left group"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:gradient-bg transition-all">
                                                <option.icon className="w-6 h-6 text-foreground group-hover:text-primary-foreground transition-colors" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-foreground">{option.title}</h3>
                                                <p className="text-sm text-muted-foreground">{option.description}</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-12 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-muted-foreground">
                                Quick answers to common questions
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {faqItems.map((item, index) => (
                                <div key={index} className="bg-card rounded-xl p-6 card-shadow">
                                    <h3 className="font-display font-bold text-foreground mb-2">
                                        {item.question}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">{item.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
