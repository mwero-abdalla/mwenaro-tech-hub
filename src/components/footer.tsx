import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-zinc-950 text-zinc-400 py-20 border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary/20 transition-transform duration-300">
                                M
                            </div>
                            <span className="text-lg font-black tracking-tighter text-white">
                                Mwenaro<span className="text-primary">.</span>Tech
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs">
                            Empowering the next generation of tech professionals with cutting-edge courses and AI-powered learning.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-xs">
                                <Mail className="w-4 h-4 text-primary" />
                                <span>hello@mwenarotech.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                                <Phone className="w-4 h-4 text-primary" />
                                <span>+254 700 123 456</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>Nairobi, Kenya</span>
                            </div>
                        </div>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="/courses" className="hover:text-primary transition-colors">All Courses</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Learning Paths</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Certifications</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">For Business</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Community</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Career Center</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6">Company</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Partners</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Press</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Accessibility</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs font-medium">
                        &copy; {new Date().getFullYear()} Mwenaro Tech Academy. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {[
                            { Icon: Facebook, href: "#" },
                            { Icon: Twitter, href: "#" },
                            { Icon: Linkedin, href: "#" },
                            { Icon: Youtube, href: "#" }
                        ].map((social, i) => (
                            <Link
                                key={i}
                                href={social.href}
                                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                            >
                                <social.Icon className="w-4 h-4" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
