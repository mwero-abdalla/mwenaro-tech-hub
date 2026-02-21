'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, AlertTriangle, ArrowLeft } from "lucide-react";

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="font-display font-bold text-xl text-foreground">
                        Mwenaro<span className="text-secondary">Tech</span>
                    </span>
                </Link>

                <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-destructive" />
                    </div>

                    <h2 className="text-2xl font-bold font-display text-foreground mb-4">
                        Authentication Error
                    </h2>

                    <p className="text-muted-foreground mb-8 text-sm">
                        There was a problem verifying your login link. This could be because the link has expired, already been used, or there's a configuration mismatch.
                    </p>

                    <div className="space-y-4">
                        <Button asChild variant="hero" className="w-full">
                            <Link href="/login">
                                Try signing in again
                            </Link>
                        </Button>

                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
