import { getMyPayments } from '@/lib/payments'
import { Card } from '@/components/ui/card'

export default async function PaymentsPage() {
    const payments = await getMyPayments()

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="max-w-4xl mx-auto p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">My Payments</h1>
                        <p className="text-muted-foreground text-lg">View your payment history and payslips</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                        <p className="text-2xl font-black text-green-600">
                            ${payments.reduce((acc, curr) => acc + (curr.status === 'paid' ? curr.amount : 0), 0).toFixed(2)}
                        </p>
                    </div>
                </div>

                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/50 border-b">
                                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Period</th>
                                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</th>
                                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th className="text-right p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            No payment records found.
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4 text-sm font-medium">
                                                {new Date(payment.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {payment.period_start ? `${new Date(payment.period_start).toLocaleDateString()} - ${new Date(payment.period_end!).toLocaleDateString()}` : '-'}
                                            </td>
                                            <td className="p-4 text-sm">
                                                {payment.description || 'Monthly Payout'}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                    ${payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'}`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-bold text-sm">
                                                {payment.currency} {payment.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    )
}
