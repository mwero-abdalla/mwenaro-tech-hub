'use client'

import { useState } from 'react'
import { User } from '@/lib/admin'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { UserActions } from '@/components/user-actions'
import { Search, Filter, Shield, User as UserIcon, GraduationCap } from 'lucide-react'

interface UserManagementClientProps {
    initialUsers: User[]
    initialRoleFilter?: string
}

export function UserManagementClient({ initialUsers, initialRoleFilter = 'all' }: UserManagementClientProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState(initialRoleFilter)

    const filteredUsers = initialUsers.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-500/10 text-red-500 border-red-500/20'
            case 'instructor': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
            default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
        }
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return <Shield className="w-3 h-3 mr-1" />
            case 'instructor': return <GraduationCap className="w-3 h-3 mr-1" />
            default: return <UserIcon className="w-3 h-3 mr-1" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        placeholder="Search students by email..."
                        className="pl-10 h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64 relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10" />
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="pl-10 h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="student">Students</SelectItem>
                            <SelectItem value="instructor">Instructors</SelectItem>
                            <SelectItem value="admin">Admins</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/50 shadow-xl shadow-zinc-200/50 dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                <th className="text-left p-6 font-bold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">User Identity</th>
                                <th className="text-left p-6 font-bold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">Access Level</th>
                                <th className="text-left p-6 font-bold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">Member Since</th>
                                <th className="text-right p-6 font-bold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-zinc-500 italic">
                                        No users matching your search criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {user.email.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadgeColor(user.role)}`}>
                                                {getRoleIcon(user.role)}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-6 text-sm text-zinc-500 font-medium">
                                            {new Date(user.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="p-6 text-right">
                                            <UserActions userId={user.id} currentRole={user.role} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
