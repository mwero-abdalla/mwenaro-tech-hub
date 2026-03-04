'use client'

import { useState } from 'react'
import { jsPDF } from 'jspdf'
import { Button } from '@/components/ui/button'
import { Award, Download, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

interface CertificateDownloadProps {
    certificate: {
        id: string
        full_name: string
        course_title: string
        issued_at: string
    }
}

export function CertificateDownload({ certificate }: CertificateDownloadProps) {
    const [isGenerating, setIsGenerating] = useState(false)

    const generatePDF = async () => {
        setIsGenerating(true)
        try {
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            })

            const pageWidth = doc.internal.pageSize.getWidth()
            const pageHeight = doc.internal.pageSize.getHeight()

            // 1. Background / Border
            doc.setDrawColor(37, 99, 235) // Primary Blue
            doc.setLineWidth(5)
            doc.rect(5, 5, pageWidth - 10, pageHeight - 10)

            doc.setDrawColor(200, 200, 200)
            doc.setLineWidth(1)
            doc.rect(7, 7, pageWidth - 14, pageHeight - 14)

            // 2. Logo / Header
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(40)
            doc.setTextColor(37, 99, 235)
            doc.text('MWENARO ACADEMY', pageWidth / 2, 40, { align: 'center' })

            doc.setFont('helvetica', 'normal')
            doc.setFontSize(20)
            doc.setTextColor(100, 100, 100)
            doc.text('CERTIFICATE OF COMPLETION', pageWidth / 2, 55, { align: 'center' })

            // 3. Main Content
            doc.setFontSize(16)
            doc.text('This is to certify that', pageWidth / 2, 80, { align: 'center' })

            doc.setFont('helvetica', 'bold')
            doc.setFontSize(32)
            doc.setTextColor(0, 0, 0)
            doc.text(certificate.full_name, pageWidth / 2, 100, { align: 'center' })

            doc.setFont('helvetica', 'normal')
            doc.setFontSize(16)
            doc.setTextColor(100, 100, 100)
            doc.text('has successfully completed the course', pageWidth / 2, 115, { align: 'center' })

            doc.setFont('helvetica', 'bold')
            doc.setFontSize(24)
            doc.setTextColor(37, 99, 235)
            doc.text(certificate.course_title, pageWidth / 2, 130, { align: 'center' })

            // 4. Date & ID
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(12)
            doc.setTextColor(150, 150, 150)
            doc.text(`Issued on: ${format(new Date(certificate.issued_at), 'MMMM d, yyyy')}`, 40, 170)
            doc.text(`Certificate ID: ${certificate.id}`, 40, 177)

            // 5. Signature Placeholder
            doc.setDrawColor(0, 0, 0)
            doc.line(pageWidth - 100, 170, pageWidth - 40, 170)
            doc.text('Academy Director', pageWidth - 70, 177, { align: 'center' })

            doc.save(`Certificate-${certificate.course_title.replace(/\s+/g, '-')}.pdf`)
        } catch (error) {
            console.error('PDF Generation error:', error)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Button
            onClick={generatePDF}
            disabled={isGenerating}
            variant="outline"
            className="rounded-xl gap-2 font-bold hover:bg-primary/5 transition-all"
        >
            {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <>
                    <Download className="h-4 w-4" />
                    Download PDF
                </>
            )}
        </Button>
    )
}
