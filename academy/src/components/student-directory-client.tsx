'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Search, Users, BookOpen, UserCheck, GraduationCap } from 'lucide-react'
import { EnrolledStudent } from '@/lib/instructor'
import { format } from 'date-fns'

interface StudentDirectoryClientProps {
    initialStudents: EnrolledStudent[]
}

export function StudentDirectoryClient({ initialStudents }: StudentDirectoryClientProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [cohortFilter, setCohortFilter] = useState('all')

    // Get unique cohorts for filtering
    const cohorts = Array.from(new Set(initialStudents.map(s => s.cohort_name)))

    const filteredStudents = initialStudents.filter(student => {
        const matchesSearch =
            student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.cohort_name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCohort = cohortFilter === 'all' || student.cohort_name === cohortFilter
        return matchesSearch && matchesCohort
    })

    const completionRate = initialStudents.length > 0
        ? Math.round((initialStudents.filter(s => s.is_completed).length / initialStudents.length) * 100)
        : 0

    const getInitials = (name: string | null, email: string) => {
        if (name) {
            return name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
        }
        return email.substring(0, 2).toUpperCase()
    }

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Active Students</p>
                            <p className="text-3xl font-black">{initialStudents.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-secondary/5 to-transparent border-secondary/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-secondary/10 rounded-2xl">
                            <BookOpen className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Cohorts</p>
                            <p className="text-3xl font-black">{cohorts.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-green-500/5 to-transparent border-green-500/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-2xl">
                            <GraduationCap className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Completion Rate</p>
                            <p className="text-3xl font-black">{completionRate}%</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-6 border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                <div className="flex flex-col md:row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            placeholder="Search by student name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 h-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl font-medium"
                        />
                    </div>
                    <Select value={cohortFilter} onValueChange={setCohortFilter}>
                        <SelectTrigger className="w-full md:w-[240px] h-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl font-bold">
                            <SelectValue placeholder="All Cohorts" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800">
                            <SelectItem value="all">All Cohorts</SelectItem>
                            {cohorts.map(cohort => (
                                <SelectItem key={cohort} value={cohort}>{cohort}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {/* Student Table */}
            <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 rounded-3xl">
                <div className="max-h-[600px] overflow-y-auto">
                    <Table>
                        <TableHeader className="bg-zinc-50 dark:bg-zinc-900/80 sticky top-0 z-10">
                            <TableRow className="border-zinc-200 dark:border-zinc-800">
                                <TableHead className="font-bold text-zinc-900 dark:text-zinc-100 h-14">Student</TableHead>
                                <TableHead className="font-bold text-zinc-900 dark:text-zinc-100 h-14">Course & Cohort</TableHead>
                                <TableHead className="font-bold text-zinc-900 dark:text-zinc-100 h-14">Progress</TableHead>
                                <TableHead className="font-bold text-zinc-900 dark:text-zinc-100 h-14">Avg Grade</TableHead>
                                <TableHead className="font-bold text-zinc-900 dark:text-zinc-100 h-14">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <TableRow key={student.id} className="border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                    {getInitials(student.full_name, student.email)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-zinc-900 dark:text-white leading-none mb-1">
                                                        {student.full_name || 'Student'}
                                                    </p>
                                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium italic">
                                                        {student.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-zinc-900 dark:text-white">{student.course_title}</p>
                                                <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-wider flex items-center w-fit gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {student.cohort_name}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 max-w-[100px]">
                                                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary transition-all duration-500"
                                                            style={{ width: `${student.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-xs font-bold font-mono">{student.progress}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {student.average_grade > 0 ? (
                                                <Badge variant="outline" className="font-black text-xs border-zinc-200 dark:border-zinc-800">
                                                    {student.average_grade}%
                                                </Badge>
                                            ) : (
                                                <span className="text-zinc-400 text-xs italic">N/A</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={student.is_completed ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"}>
                                                {student.is_completed ? 'Completed' : 'In Progress'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center text-zinc-400">
                                            <Users className="w-12 h-12 mb-4 opacity-20" />
                                            <p className="font-bold text-lg">No students found matching your search</p>
                                            <p className="text-sm italic">Try adjusting your filters or keywords</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}
