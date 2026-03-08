'use client'

import { Certificate } from '@/lib/certificates'
import { Printer, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
    ClassicTemplate, 
    ModernTemplate, 
    PrestigeTemplate 
} from './certificate-templates'

interface PremiumCertificateProps {
    certificate: Certificate
    templateId?: 'classic' | 'modern' | 'prestige'
}

export function PremiumCertificate({ certificate, templateId = 'classic' }: PremiumCertificateProps) {
    const handlePrint = () => {
        window.print()
    }

    const renderTemplate = () => {
        switch (templateId) {
            case 'modern':
                return <ModernTemplate certificate={certificate} />
            case 'prestige':
                return <PrestigeTemplate certificate={certificate} />
            case 'classic':
            default:
                return <ClassicTemplate certificate={certificate} />
        }
    }

    return (
        <div className="space-y-6">
            <div className="relative aspect-[1.414/1] w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-sm overflow-hidden print:shadow-none print:m-0 print:w-full">
                {renderTemplate()}
            </div>

            {/* Actions (Hidden in print) */}
            <div className="flex justify-center gap-4 print:hidden">
                <Button onClick={handlePrint} className="rounded-xl h-11 font-bold gap-2 px-8">
                    <Printer className="w-4 h-4" />
                    Print Certificate
                </Button>
                <Button variant="outline" className="rounded-xl h-11 font-bold gap-2 px-8">
                    <ShieldCheck className="w-4 h-4" />
                    Verify Authenticity
                </Button>
            </div>
        </div>
    )
}
