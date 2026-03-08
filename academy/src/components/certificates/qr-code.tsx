'use client'

import { QRCodeSVG } from 'qrcode.react'

interface CertificateQRCodeProps {
    verificationId: string
    size?: number
    includeMargin?: boolean
}

export function CertificateQRCode({ verificationId, size = 120, includeMargin = false }: CertificateQRCodeProps) {
    // Construct the verification URL
    // In production, this would be the actual domain
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mwenaro-academy.com'
    const verificationUrl = `${origin}/verify/${verificationId}`

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="p-2 bg-white rounded-lg shadow-sm border border-zinc-100">
                <QRCodeSVG 
                    value={verificationUrl} 
                    size={size} 
                    level="H"
                    includeMargin={includeMargin}
                    imageSettings={{
                        src: "/favicon.ico",
                        x: undefined,
                        y: undefined,
                        height: 24,
                        width: 24,
                        excavate: true,
                    }}
                />
            </div>
            <p className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">Scan to Verify</p>
        </div>
    )
}
