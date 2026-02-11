'use client';

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { forgotPassword } from '../auth/actions';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);

        try {
            const result = await forgotPassword(formData);
            if (result && result.error) {
                setError(result.error);
                toast.error(result.error);
                setIsLoading(false);
            } else {
                setSuccess(true);
                toast.success("Password reset email sent!");
                setIsLoading(false);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Request failed";
            setError(message);
            toast.error(message);
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-foreground mb-4">
                        Check your email
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        We have sent a password reset link to <span className="font-medium text-foreground">{email}</span>. Please check your inbox and spam folder.
                    </p>
                    <div className="space-y-4">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                setSuccess(false);
                                setEmail("");
                            }}
                        >
                            Resend email
                        </Button>
                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="font-display font-bold text-xl text-foreground">
                        Mwenaro<span className="text-secondary">Tech</span>
                    </span>
                </Link>

                <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                        <h2 className="text-center text-2xl font-bold font-display text-foreground">
                            Reset your password
                        </h2>
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending link...
                                </>
                            ) : (
                                "Send reset link"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Remember your password?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link
                                href="/login"
                                className="font-medium text-primary hover:text-primary/90 flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
