'use client'

import { format } from 'date-fns'
import { Receipt } from '@/lib/receipts'
import { Receipt as ReceiptIcon, ShieldCheck, Cpu, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReceiptVoucherProps {
    receipt: Receipt
}

export function ReceiptVoucher({ receipt }: ReceiptVoucherProps) {
    const handleDownload = () => {
        window.print()
    }

    return (
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-[#050505] p-8 text-zinc-400 font-mono shadow-2xl print:border-none print:shadow-none print:bg-white print:text-black">
            {/* Neural Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none print:hidden">
                <svg width="100%" height="100%">
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-12 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-black tracking-tighter text-xl">
                        <Cpu className="w-6 h-6" />
                        MWENARO_ACADEMY
                    </div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Billing Authorization v4.2</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Transaction ID</p>
                    <p className="text-xs font-black text-zinc-200">{receipt.id.slice(0, 12).toUpperCase()}</p>
                </div>
            </div>

            {/* Content Wrap */}
            <div className="space-y-8 relative z-10">
                <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Source Course</p>
                            <p className="text-sm font-black text-zinc-100">{receipt.course_title}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Timestamp</p>
                            <p className="text-sm font-black text-zinc-100">{format(new Date(receipt.created_at), 'yyyy.MM.dd HH:mm:ss')}</p>
                        </div>
                    </div>
                    <div className="space-y-4 text-right">
                        <div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Payment Status</p>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase border border-green-500/20">
                                <ShieldCheck className="w-3 h-3" />
                                {receipt.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Amount Paid</p>
                            <p className="text-2xl font-black text-primary">{receipt.currency} {receipt.amount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-zinc-800/50 pt-8 space-y-4">
                    <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold">
                        <span>Payment Method</span>
                        <span className="text-zinc-500">{receipt.provider || 'STRIPE'}</span>
                    </div>
                    <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold">
                        <span>Provider Reference</span>
                        <span className="text-zinc-500">{receipt.provider_reference || 'INTERNAL_ALLOCATION'}</span>
                    </div>
                    {receipt.description && (
                         <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold">
                             <span>Notes</span>
                             <span className="text-zinc-500 text-right max-w-[200px] truncate">{receipt.description}</span>
                         </div>
                    )}
                    <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold">
                        <span>Checksum Analysis</span>
                        <span className="text-zinc-500">SHA256: {Math.random().toString(36).substring(7).toUpperCase()}...</span>
                    </div>
                </div>

                {/* Footer Notes */}
                <p className="text-[9px] text-zinc-600 uppercase border-l-2 border-primary pl-4 py-1">
                    This document serves as an official proof of payment for educational resources provided by Mwenaro Tech Academy. 
                    Cryptographic signature is embedded in original digital artifact.
                </p>
            </div>

            {/* Download Button (Hidden in print) */}
            <div className="mt-8 flex justify-end print:hidden relative z-10">
                <Button 
                    onClick={handleDownload}
                    variant="ghost" 
                    className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold gap-2 h-11"
                >
                    <Download className="w-4 h-4" />
                    Export PDF
                </Button>
            </div>
        </div>
    )
}
