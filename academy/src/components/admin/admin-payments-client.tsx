'use client'

import React, { useState } from 'react'
import { recordManualPayment, deletePayment } from '@/lib/admin'
import { Course } from '@/lib/courses'
import ReceiptPreview from '@/components/payments/ReceiptPreview'
import { CheckCircle2, AlertCircle, RefreshCw, Trash2, FileText, Search } from 'lucide-react'
import { format } from 'date-fns'

// Interface for the payment list from getAllPayments
interface AdminPayment {
    id: string;
    amount: number;
    currency: string;
    status: string;
    provider: string;
    provider_reference: string;
    description: string | null;
    created_at: string;
    profiles: { full_name: string | null; email: string | null } | null;
    courses: { title: string } | null;
}

// Receipt preview format
interface ExtendedReceipt {
    id: string;
    course_id: string;
    user_name: string;
    course_title: string;
    amount: number;
    currency: string;
    status: string;
    provider: string;
    provider_reference: string;
    description?: string;
    created_at: string;
}

interface AdminPaymentsClientProps {
    users: { id: string; email: string; name?: string }[]
    cohorts: { id: string; name: string; course_id: string; courses: { title: string } }[]
    initialPayments: any[]
}

export default function AdminPaymentsClient({ users, cohorts, initialPayments }: AdminPaymentsClientProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successReceipt, setSuccessReceipt] = useState<ExtendedReceipt | null>(null)
    const [payments, setPayments] = useState<AdminPayment[]>(initialPayments)
    const [searchQuery, setSearchQuery] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)
        const user_id = formData.get('user_id') as string
        const cohort_id = formData.get('cohort_id') as string
        const provider = formData.get('provider') as string
        const amountStr = formData.get('amount') as string
        const provider_reference = formData.get('provider_reference') as string
        const description = formData.get('description') as string
        const dateStr = formData.get('date') as string

        try {
            if (!user_id || !cohort_id || !amountStr || !provider_reference) {
                throw new Error("Please fill in all required fields.")
            }

            const amount = parseFloat(amountStr)
            if (isNaN(amount) || amount <= 0) {
                throw new Error("Invalid payment amount.")
            }

            const selectedCohort = cohorts.find(c => c.id === cohort_id)
            if (!selectedCohort) throw new Error("Selected cohort not found.")
            
            const selectedUser = users.find(u => u.id === user_id)
            if (!selectedUser) throw new Error("Selected user not found.")

            const paymentDate = dateStr ? new Date(dateStr).toISOString() : new Date().toISOString()

            const result = await recordManualPayment({
                user_id,
                course_id: selectedCohort.course_id,
                amount,
                currency: 'KES',
                provider_reference: provider === 'Cash' 
                    ? `CASH-${provider_reference}` 
                    : `${provider.toUpperCase()}-${provider_reference}`,
                description: description || `Manual ${provider} payment recorded by Admin`,
                created_at: paymentDate
            })

            // Update local list
            const newPayment: AdminPayment = {
                id: result.id,
                amount: result.amount,
                currency: result.currency,
                status: result.status,
                provider: result.provider,
                provider_reference: result.provider_reference,
                description: result.description,
                created_at: result.created_at,
                profiles: { full_name: selectedUser.name || null, email: selectedUser.email },
                courses: { title: selectedCohort.courses?.title || 'Unknown Course' }
            }
            setPayments(prev => [newPayment, ...prev])

            setSuccessReceipt({
                id: result.id,
                course_id: selectedCohort.course_id,
                user_name: selectedUser.name || selectedUser.email,
                course_title: selectedCohort.courses?.title || 'Unknown Course',
                amount: result.amount,
                currency: result.currency,
                status: result.status,
                provider: result.provider,
                provider_reference: result.provider_reference,
                description: result.description,
                created_at: result.created_at
            })

            e.currentTarget.reset()
        } catch (err: any) {
            setError(err.message || "An error occurred while saving the payment.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this payment record? This will NOT automatically unenroll the student.')) return
        
        try {
            await deletePayment(id)
            setPayments(prev => prev.filter(p => p.id !== id))
        } catch (err: any) {
            alert(err.message || 'Failed to delete payment')
        }
    }

    const filteredPayments = payments.filter(p => 
        p.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.provider_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.courses?.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (successReceipt) {
        return (
            <div className="space-y-6">
                <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-start print:hidden">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold">Payment Recorded Successfully</h3>
                        <p className="text-sm mt-1">
                            The receipt code is {successReceipt.provider_reference}. 
                            The learner now has active access if they weren't already active.
                        </p>
                    </div>
                </div>

                <ReceiptPreview receipt={successReceipt} />

                <div className="flex justify-center mt-6 print:hidden">
                    <button
                        onClick={() => setSuccessReceipt(null)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Record Another Payment</span>
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12">
            {/* Form Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 overflow-hidden max-w-2xl">
                <h2 className="text-xl font-bold text-gray-900 mb-6 font-black uppercase tracking-tight">Manual Payment Entry</h2>
                
                {error && (
                    <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md flex items-start font-medium text-xs">
                        <AlertCircle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Learner */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider">Learner *</label>
                            <select
                                name="user_id"
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border font-medium h-10"
                            >
                                <option value="">Select a learner...</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name ? `${user.name} (${user.email})` : user.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Cohort (Course) */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider">Cohort / Course *</label>
                            <select
                                name="cohort_id"
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border font-medium h-10"
                            >
                                <option value="">Select the cohort...</option>
                                {cohorts.map(cohort => (
                                    <option key={cohort.id} value={cohort.id}>
                                        {cohort.name} - {cohort.courses?.title || 'Unknown Course'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Payment Type */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider">Payment Type *</label>
                            <select
                                name="provider"
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border font-medium h-10"
                            >
                                <option value="M-Pesa">M-Pesa</option>
                                <option value="Bank">Bank Transfer</option>
                                <option value="Cash">Cash</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Amount */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider">Amount Recorded (KES) *</label>
                            <input
                                type="number"
                                name="amount"
                                required
                                min="1"
                                step="0.01"
                                placeholder="e.g. 5000"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border font-medium h-10"
                            />
                        </div>

                        {/* Reference */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider">Reference Code *</label>
                            <input
                                type="text"
                                name="provider_reference"
                                required
                                placeholder="e.g. QX12345678"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border font-medium h-10"
                            />
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider">Payment Date</label>
                            <input
                                type="date"
                                name="date"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border font-medium h-10"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider">Description / Notes (Optional)</label>
                        <textarea
                            name="description"
                            rows={2}
                            placeholder="Any additional notes about this payment..."
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border font-medium"
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2 rounded-md shadow-sm text-sm font-black uppercase tracking-wider text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Recording...' : 'Record Payment'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List Section */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-black text-primary uppercase tracking-tight">Recent Payments</h2>
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search payments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:ring-primary focus:border-primary outline-none"
                        />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Learner</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Course</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Details</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-3 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPayments.length > 0 ? (
                                    filteredPayments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{payment.profiles?.full_name || 'N/A'}</div>
                                                <div className="text-[10px] text-gray-500 font-medium">{payment.profiles?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-700">{payment.courses?.title}</div>
                                                <div className="text-[10px] text-gray-400 uppercase font-bold">{format(new Date(payment.created_at), 'MMM dd, yyyy')}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px] font-black uppercase border border-zinc-200">
                                                        {payment.provider}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-blue-600 font-bold">{payment.provider_reference}</span>
                                                </div>
                                                {payment.description && (
                                                    <div className="text-[10px] text-gray-400 mt-1 line-clamp-1 italic max-w-xs">{payment.description}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-black text-primary">{payment.currency} {payment.amount.toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                                <button
                                                    onClick={() => handleDelete(payment.id)}
                                                    className="inline-flex items-center p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Record"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="text-gray-400 font-medium italic">No payments found</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
