'use client'

import { useState } from 'react'
import { getAllCourses, getUserEnrollments, updateUserRole } from '@/lib/admin'
import { grantTemporaryAccess } from '@/lib/enrollment'
import { Course } from '@/lib/courses'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'

export function UserActions({ userId, currentRole }: { userId: string, currentRole: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [courses, setCourses] = useState<Course[]>([])
    const [userEnrollments, setUserEnrollments] = useState<any[]>([])
    const [selectedCourseId, setSelectedCourseId] = useState('')
    const [expiryDate, setExpiryDate] = useState('')

    const handleRoleChange = async (newRole: 'student' | 'instructor' | 'admin') => {
        setIsLoading(true)
        try {
            await updateUserRole(userId, newRole)
            toast.success('Role updated successfully')
        } catch (error) {
            toast.error('Failed to update role')
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenDialog = async () => {
        setIsLoading(true)
        try {
            const [allCourses, enrollments] = await Promise.all([
                getAllCourses(),
                getUserEnrollments(userId)
            ])
            setCourses(allCourses || [])
            setUserEnrollments(enrollments || [])
            if (allCourses && allCourses.length > 0) {
                setSelectedCourseId(allCourses[0].id)
            }
            setIsDialogOpen(true)
        } catch (error) {
            toast.error('Failed to fetch data')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGrantAccess = async () => {
        if (!selectedCourseId || !expiryDate) {
            toast.error('Please select a course and date')
            return
        }

        setIsLoading(true)
        try {
            // Convert to ISO string at end of day
            const date = new Date(expiryDate)
            date.setHours(23, 59, 59, 999)
            await grantTemporaryAccess(userId, selectedCourseId, date.toISOString())
            toast.success(`Access granted until ${new Date(expiryDate).toLocaleDateString()}`)
            setIsDialogOpen(false)
        } catch (error) {
            toast.error('Failed to grant access')
        } finally {
            setIsLoading(false)
        }
    }

    // We need to know which courses a student is enrolled in to grant access to a specific one.
    // For now, let's assume we can grant access to any course they are "pending" in.
    // However, fetching their enrollments here might be expensive if done for every row.
    // Better: Allow admin to select from all courses or just trigger for 7 days on their pending ones.

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-primary/5 border-primary/20 hover:bg-primary/10 font-bold" disabled={isLoading}>
                        {isLoading ? '...' : 'Manage Access'}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl border-zinc-200 dark:border-zinc-800 shadow-2xl">
                    <div className="px-2 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">Access Management</div>
                    <DropdownMenuItem onClick={handleOpenDialog} className="rounded-lg py-3 cursor-pointer focus:bg-primary focus:text-white">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="font-bold">Adjust Pay Day / Access</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-2" />

                    <div className="px-2 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">Permissions & Role</div>
                    <DropdownMenuItem onClick={() => handleRoleChange('student')} disabled={currentRole === 'student'} className="rounded-lg">
                        Promote to Student
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange('instructor')} disabled={currentRole === 'instructor'} className="rounded-lg">
                        Promote to Instructor
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange('admin')} className="text-red-600 focus:text-red-600 rounded-lg" disabled={currentRole === 'admin'}>
                        Promote to Admin
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-primary">Adjust Access / Pay Day</DialogTitle>
                        <DialogDescription className="font-medium text-zinc-500">
                            Authorize a learner to access specific course content until a chosen date.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Select Course</Label>
                            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((course) => {
                                        const enrolled = userEnrollments.find(e => e.course_id === course.id)
                                        return (
                                            <SelectItem key={course.id} value={course.id}>
                                                {course.title} {enrolled ? `(Directly Enrolled - ${enrolled.status})` : '(Not Enrolled yet)'}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expiry-date">Access Valid Until</Label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="expiry-date"
                                    type="date"
                                    className="pl-10"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleGrantAccess} disabled={isLoading || !selectedCourseId || !expiryDate}>
                            {isLoading ? 'Processing...' : 'Grant Access'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
