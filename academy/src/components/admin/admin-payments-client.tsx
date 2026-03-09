'use client'

import React, { useState } from 'react'
import { recordManualPayment } from '@/lib/admin'
import { Course } from '@/lib/courses'
import ReceiptPreview from '@/components/payments/ReceiptPreview'
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'

// Extended Receipt to include user_name for Admin View
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
}

export default function AdminPaymentsClient({ users, cohorts }: AdminPaymentsClientProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successReceipt, setSuccessReceipt] = useState<ExtendedReceipt | null>(null)

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

            // Find the selected cohort to get the associated course_id
            const selectedCohort = cohorts.find(c => c.id === cohort_id)
            if (!selectedCohort) throw new Error("Selected cohort not found.")
            
            const selectedUser = users.find(u => u.id === user_id)
            if (!selectedUser) throw new Error("Selected user not found.")

            const paymentDate = dateStr ? new Date(dateStr).toISOString() : new Date().toISOString()

            // Save via server action
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

            // Set receipt for preview
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

            // Reset form
            e.currentTarget.reset()
        } catch (err: any) {
            setError(err.message || "An error occurred while saving the payment.")
        } finally {
            setIsSubmitting(false)
        }
    }

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
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 overflow-hidden max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Manual Payment Entry</h2>
            
            {error && (
                <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md flex items-start">
                    <AlertCircle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Learner */}
                    <div className="space-y-2">
                        <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">Learner *</label>
                        <select
                            id="user_id"
                            name="user_id"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
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
                        <label htmlFor="cohort_id" className="block text-sm font-medium text-gray-700">Cohort / Course *</label>
                        <select
                            id="cohort_id"
                            name="cohort_id"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
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
                        <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Payment Type *</label>
                        <select
                            id="provider"
                            name="provider"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        >
                            <option value="M-Pesa">M-Pesa</option>
                            <option value="Bank">Bank Transfer</option>
                            <option value="Cash">Cash</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount Recorded (KES) *</label>
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            required
                            min="1"
                            step="0.01"
                            placeholder="e.g. 5000"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                    </div>

                    {/* Reference */}
                    <div className="space-y-2">
                        <label htmlFor="provider_reference" className="block text-sm font-medium text-gray-700">Reference Code *</label>
                        <input
                            type="text"
                            name="provider_reference"
                            id="provider_reference"
                            required
                            placeholder="e.g. QX12345678 or Receipt #12"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Payment Date</label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description / Notes (Optional)</label>
                    <textarea
                        name="description"
                        id="description"
                        rows={3}
                        placeholder="Any additional notes about this payment..."
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Recording...' : 'Record Payment'}
                    </button>
                </div>
            </form>
        </div>
    )
}
