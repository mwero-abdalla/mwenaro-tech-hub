'use client'

import { Certificate } from '@/lib/certificates'
import { format } from 'date-fns'
import { Award, ShieldCheck, Signature } from 'lucide-react'
import { CertificateQRCode } from './qr-code'

interface TemplateProps {
    certificate: Certificate
}

/* 
 * 1. ClassicTemplate - Authoritative, Traditional, Professional.
 */
export function ClassicTemplate({ certificate }: TemplateProps) {
    return (
        <div className="relative aspect-[1.414/1] w-full bg-[#FFFDF9] border-[24px] border-zinc-950 m-0 flex flex-col items-center justify-between py-16 px-14 text-center overflow-hidden">
            {/* Elegant Double Border */}
            <div className="absolute inset-2 border border-zinc-800 pointer-events-none" />
            
            {/* Ornate Corners */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-primary m-[-4px]" />
            <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-primary m-[-4px]" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-primary m-[-4px]" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-primary m-[-4px]" />

            {/* Header / Authority */}
            <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-center gap-6 mb-4">
                    <div className="w-1.5 h-16 bg-zinc-900" />
                    <div className="text-left">
                        <h2 className="text-zinc-900 uppercase tracking-[0.6em] text-[10px] font-black leading-none">Mwenaro Tech Academy</h2>
                        <p className="text-[8px] text-zinc-500 uppercase tracking-[0.4em] mt-1">Institutional Accreditation Board</p>
                    </div>
                </div>
                <h1 className="text-5xl font-serif font-black text-zinc-900 tracking-tight">CERTIFICATE OF MASTERY</h1>
                <div className="flex items-center justify-center gap-4 py-2">
                    <div className="h-px w-12 bg-zinc-300" />
                    <span className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold">Summa Cum Laude</span>
                    <div className="h-px w-12 bg-zinc-300" />
                </div>
            </div>

            {/* Recipient / Body */}
            <div className="relative z-10 w-full max-w-3xl">
                <p className="text-zinc-600 italic font-serif text-xl mb-6">In recognition of professional distinction and the successful fulfillment of all academic and technical requirements, we hereby confer this credential upon</p>
                
                <h3 className="text-6xl font-serif font-black text-zinc-900 mb-6 relative inline-block group">
                    {certificate.full_name}
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
                </h3>

                <p className="text-zinc-600 italic font-serif text-xl mt-6">for an exemplary demonstration of proficiency in</p>
                <h4 className="text-3xl font-black text-zinc-800 mt-4 uppercase tracking-[0.15em] border-y border-zinc-100 py-4 max-w-xl mx-auto">
                    {certificate.course_title}
                </h4>
            </div>

            {/* Verification Footer */}
            <div className="relative z-10 w-full grid grid-cols-3 gap-12 items-end">
                <div className="text-left flex items-end gap-4">
                    <CertificateQRCode verificationId={certificate.verification_id || certificate.id} size={64} />
                    <div className="space-y-1 pb-1">
                        <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">VALIDATION ID</p>
                        <p className="text-[9px] font-mono font-bold text-zinc-600">{certificate.verification_id || certificate.id.slice(0, 16).toUpperCase()}</p>
                    </div>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="relative w-48 h-12 mb-2 flex items-center justify-center">
                         <Signature className="w-40 h-10 text-zinc-800 rotate-[-3deg] opacity-80" />
                         <div className="absolute bottom-0 w-full h-[0.5px] bg-zinc-400" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-zinc-900">MWERO ABDALLA</p>
                    <p className="text-[8px] text-zinc-400 uppercase font-black tracking-widest">FOUNDING DIRECTOR</p>
                </div>

                <div className="text-right space-y-1">
                    <p className="text-[9px] text-zinc-400 uppercase font-black tracking-widest">CONFERRED ON THIS DAY</p>
                    <p className="text-sm font-black text-zinc-900">{format(new Date(certificate.issued_at), 'MMMM do, yyyy')}</p>
                    <div className="flex justify-end pt-2">
                        <ShieldCheck className="w-5 h-5 text-zinc-300" />
                    </div>
                </div>
            </div>

            {/* Sophisticated Watermark */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                <Award className="w-[600px] h-[600px]" />
            </div>
        </div>
    )
}

/* 
 * 2. ModernTemplate - High-Contrast, Minimalist, Engineering-Focused.
 */
export function ModernTemplate({ certificate }: TemplateProps) {
    return (
        <div className="relative aspect-[1.414/1] w-full bg-white m-0 flex flex-col justify-between py-24 px-20 text-left overflow-hidden">
            {/* Tech Grid Background */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <svg width="100%" height="100%">
                    <pattern id="modern-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#modern-grid)" />
                </svg>
            </div>

            {/* Modern Accent Bar */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-zinc-50 border-l border-zinc-100" />

            {/* Header */}
            <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tighter text-zinc-900">MWENARO_SYSTEMS</h2>
                            <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-[0.4em]">Integrated Learning Environment</p>
                        </div>
                    </div>
                </div>
                <div className="text-right underline decoration-primary decoration-4 underline-offset-8">
                    <h1 className="text-7xl font-black text-zinc-900 tracking-tighter leading-none">CERT_01</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col justify-center gap-12 max-w-2xl">
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Lvl_04 Accreditation</p>
                    <h2 className="text-7xl font-black text-zinc-900 tracking-tight leading-none uppercase">
                        {certificate.full_name.split(' ').map((word, i) => (
                            <span key={i} className={i === 0 ? "block" : "block text-zinc-300"}>{word}</span>
                        ))}
                    </h2>
                </div>

                <div className="space-y-4 border-l-4 border-zinc-900 pl-8">
                    <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Has demonstrated peak technical efficiency in the domain of:</p>
                    <p className="text-4xl font-black text-zinc-900 uppercase tracking-tight">{certificate.course_title}</p>
                </div>
            </div>

            {/* Footer Information */}
            <div className="relative z-10 grid grid-cols-2 gap-20 items-end">
                <div className="flex items-center gap-8">
                    <div className="p-3 bg-white border border-zinc-100 rounded-2xl shadow-sm">
                        <CertificateQRCode verificationId={certificate.verification_id || certificate.id} size={60} />
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Authenticated Node ID</p>
                        <p className="text-[10px] font-mono font-bold text-zinc-900">{certificate.verification_id || certificate.id.slice(0, 18).toUpperCase()}</p>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Timestamp_Epoch</p>
                    <p className="text-2xl font-black text-zinc-900">{format(new Date(certificate.issued_at), 'yyyy • MM • dd')}</p>
                </div>
            </div>

            {/* Designer Corner */}
            <div className="absolute bottom-10 right-10 rotate-90 origin-bottom-right">
                <p className="text-[8px] font-mono text-zinc-200 uppercase tracking-[1em]">MWENARO_ENGINEERING_DOC_882</p>
            </div>
        </div>
    )
}

/* 
 * 3. PrestigeTemplate - The Ultimate Executive Credential.
 */
export function PrestigeTemplate({ certificate }: TemplateProps) {
    return (
        <div className="relative aspect-[1.414/1] w-full bg-[#050505] m-0 flex flex-col items-center justify-between py-24 px-20 text-center overflow-hidden">
            {/* Dark Mode Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#111_0%,_transparent_50%)]" />
            
            {/* Gold Borders */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-50" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-50" />
            
            {/* Floating Dust Effect (Aesthetic) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg width="100%" height="100%">
                    <filter id="prestige-noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#prestige-noise)" />
                </svg>
            </div>

            {/* Prestige Crest */}
            <div className="relative z-10">
                <div className="w-24 h-24 relative mx-auto mb-6">
                    <div className="absolute inset-0 bg-yellow-600 rounded-full blur-[20px] opacity-20 animate-pulse" />
                    <div className="relative bg-gradient-to-b from-yellow-400 to-yellow-700 w-full h-full rounded-full flex items-center justify-center p-0.5 shadow-2xl">
                        <div className="bg-zinc-950 w-full h-full rounded-full flex items-center justify-center border border-yellow-500/30">
                            <Award className="w-12 h-12 text-yellow-500" />
                        </div>
                    </div>
                </div>
                <h2 className="text-yellow-600/60 font-serif italic text-2xl tracking-wide uppercase">Institutional Elevation</h2>
            </div>

            {/* Main Statement */}
            <div className="relative z-10 flex-1 flex flex-col justify-center max-w-4xl space-y-10">
                <div className="space-y-4">
                    <h1 className="text-7xl font-serif text-white tracking-[0.2em] uppercase leading-none">MEMBER OF DISTINCTION</h1>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
                </div>

                <div className="space-y-6">
                    <p className="text-zinc-500 italic font-serif text-2xl">The Executive Council hereby confirms the elevation of</p>
                    <h3 className="text-8xl font-black bg-gradient-to-b from-white via-zinc-200 to-white bg-clip-text text-transparent py-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        {certificate.full_name}
                    </h3>
                </div>

                <div className="space-y-2">
                    <p className="text-zinc-500 italic font-serif text-2xl">to the apex professional standing for the mastery of</p>
                    <p className="text-3xl font-black text-yellow-500 uppercase tracking-[0.4em] drop-shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                        {certificate.course_title}
                    </p>
                </div>
            </div>

            {/* Executive Footer */}
            <div className="relative z-10 w-full flex justify-between items-end">
                <div className="flex items-center gap-10">
                    <div className="group relative">
                        <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-2 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10">
                            <CertificateQRCode verificationId={certificate.verification_id || certificate.id} size={56} />
                        </div>
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] text-yellow-600 font-black uppercase tracking-[0.3em] mb-1">Cryptographic Link</p>
                        <p className="text-[12px] text-zinc-500 font-mono tracking-tighter opacity-70 italic">{certificate.verification_id?.slice(0, 24) || certificate.id.toUpperCase()}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="px-12 py-3 border border-yellow-500/20 bg-yellow-500/5 rounded-full backdrop-blur-sm mb-4">
                        <span className="text-xs font-serif italic text-yellow-500/80">Authorized by Mwero Abdalla</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-yellow-600" />
                        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.5em]">Executive Director</p>
                    </div>
                </div>
            </div>

            {/* Structural Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 border-r-[0.5px] border-t-[0.5px] border-yellow-500/10 m-12 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 border-l-[0.5px] border-b-[0.5px] border-yellow-500/10 m-12 pointer-events-none" />
        </div>
    )
}
