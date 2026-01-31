import { getAllUsers } from '@/lib/admin'
import { UserManagementClient } from '@/components/user-management-client'

export default async function UsersPage() {
    const users = await getAllUsers()

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Account Management</h1>
                    <p className="text-zinc-500 font-medium mt-1">Audit platform access and adjust permissions for staff and students.</p>
                </div>

                <UserManagementClient initialUsers={users} />
            </div>
        </div>
    )
}
