'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { updatePassword } from '@/lib/user'
import { Loader2, KeyRound } from 'lucide-react'

export function PasswordForm() {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        setLoading(true)
        try {
            await updatePassword(formData.password)
            toast.success("Password updated successfully")
            setFormData({ password: '', confirmPassword: '' })
        } catch (error: any) {
            toast.error(error.message || "Failed to update password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-950/30 rounded-lg text-orange-600">
                            <KeyRound size={20} />
                        </div>
                        <div>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Update your password to keep your account secure.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="new_password">New Password</Label>
                            <Input
                                id="new_password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm_password">Confirm New Password</Label>
                            <Input
                                id="confirm_password"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading} className="font-bold px-8 bg-orange-600 hover:bg-orange-700">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                </Button>
            </div>
        </form>
    )
}
