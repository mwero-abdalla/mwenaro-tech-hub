'use client'

import React, { useRef } from 'react'
import { Download, Printer } from 'lucide-react'
import { Receipt } from '@/lib/receipts'

interface ReceiptPreviewProps {
    receipt: Receipt | {
        id: string
        user_name: string
        course_title: string
        amount: number
        currency: string
        status: string
        provider: string
        provider_reference: string
        description?: string
        created_at: string
    }
}

export default function ReceiptPreview({ receipt }: ReceiptPreviewProps) {
    const printRef = useRef<HTMLDivElement>(null)

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="flex flex-col items-center">
            {/* Action Buttons */}
            <div className="flex justify-end w-full max-w-md mb-4 space-x-2 print:hidden">
                <button
                    onClick={handlePrint}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    <Printer className="w-4 h-4" />
                    <span>Print Receipt</span>
                </button>
            </div>

            {/* Receipt Card */}
            <div 
                ref={printRef}
                className="w-full max-w-md bg-white text-gray-900 border border-gray-200 rounded-lg shadow-sm p-8 print:shadow-none print:border-none print:p-0"
            >
                {/* Header */}
                <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Mwenaro Academy
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Payment Receipt</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Receipt No.</p>
                        <p className="text-xs text-gray-500 font-mono mt-1">{receipt.id.split('-')[0].toUpperCase()}</p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-4 mb-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Date</p>
                            <p className="font-medium text-sm mt-1">
                                {new Date(receipt.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
                                receipt.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {receipt.status}
                            </span>
                        </div>
                    </div>

                    {('user_name' in receipt) && (
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Billed To</p>
                            <p className="font-medium text-sm mt-1">{receipt.user_name}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Course / Item</p>
                        <p className="font-medium text-sm mt-1">{receipt.course_title}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Payment Method</p>
                            <p className="font-medium text-sm mt-1 capitalize">{receipt.provider}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Reference</p>
                            <p className="font-medium text-sm mt-1 font-mono text-gray-700">{receipt.provider_reference || 'N/A'}</p>
                        </div>
                    </div>

                    {receipt.description && (
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Description</p>
                            <p className="font-medium text-sm mt-1 text-gray-700">{receipt.description}</p>
                        </div>
                    )}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-6 flex justify-between items-center">
                    <p className="text-base font-bold text-gray-900">Total Paid</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {receipt.currency} {(typeof receipt.amount === 'number' ? receipt.amount : parseFloat(receipt.amount || '0')).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                
                {/* Footer Notes */}
                <div className="mt-8 text-center text-xs text-gray-500">
                    <p>Thank you for learning with Mwenaro Academy!</p>
                    <p className="mt-1">If you have any questions, please contact support.</p>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    /* Make the receipt div and all its children visible */
                    .flex.flex-col.items-center > div:nth-child(2),
                    .flex.flex-col.items-center > div:nth-child(2) * {
                        visibility: visible;
                    }
                    .flex.flex-col.items-center > div:nth-child(2) {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100vw;
                        border: none;
                        box-shadow: none;
                        padding: 2rem;
                    }
                }
            `}</style>
        </div>
    )
}
