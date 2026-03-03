import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, CreditCard, ArrowRight, Home } from "lucide-react"
import Link from 'next/link'

export default function PaymentPendingPage() {
    return (
        <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-border/50 shadow-2xl shadow-primary/10 rounded-3xl overflow-hidden">
                <div className="h-2 bg-primary w-full" />
                <CardHeader className="text-center pt-8">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                        <Smartphone className="h-8 w-8 text-primary animate-pulse" />
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tight">Access Pending</CardTitle>
                    <CardDescription className="text-lg">
                        We're waiting for your payment to be confirmed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-8">
                    <div className="bg-muted/50 p-4 rounded-2xl text-sm text-muted-foreground">
                        <p>Once your payment is successful, your course access will be granted automatically. This usually happens within a few minutes.</p>
                    </div>

                    <div className="space-y-3">
                        <Button className="w-full h-12 rounded-xl font-bold" asChild>
                            <Link href="/dashboard">
                                Check Status <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full h-12 rounded-xl font-bold" asChild>
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" /> Go Home
                            </Link>
                        </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                        Paid but still seeing this? <Link href="/contact" className="underline hover:text-primary">Contact Support</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
