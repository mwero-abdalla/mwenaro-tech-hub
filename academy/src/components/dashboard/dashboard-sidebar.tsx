"use client"

import * as React from "react"
import {
    BookOpen,
    Calendar,
    LayoutDashboard,
    LogOut,
    Settings,
    User,
    GraduationCap,
    FileQuestion,
    MessageSquare,
    Bell
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getUnreadMessageCount } from "@/lib/chat"
import { getUnreadNotificationsCount } from "@/lib/notifications"
import { createClient } from "@/lib/supabase/client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/auth/actions"

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: {
        email?: string
        user_metadata?: {
            full_name?: string
            avatar_url?: string
        }
    } | null
}

export function DashboardSidebar({ user, ...props }: DashboardSidebarProps) {
    const pathname = usePathname()
    const [unreadMessages, setUnreadMessages] = React.useState(0)
    const [unreadNotifications, setUnreadNotifications] = React.useState(0)

    React.useEffect(() => {
        if (!user) return

        const fetchCounts = async () => {
            const [mCount, nCount] = await Promise.all([
                getUnreadMessageCount(),
                getUnreadNotificationsCount()
            ])
            setUnreadMessages(mCount)
            setUnreadNotifications(nCount)
        }

        fetchCounts()

        // Real-time subscription for counts
        const supabase = createClient()
        const messageChannel = supabase
            .channel('unread-messages')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchCounts)
            .subscribe()

        const notificationChannel = supabase
            .channel('unread-notifications')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, fetchCounts)
            .subscribe()

        return () => {
            supabase.removeChannel(messageChannel)
            supabase.removeChannel(notificationChannel)
        }
    }, [user])

    const navItems = [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Messages",
            url: "/dashboard/messages",
            icon: MessageSquare,
            badge: unreadMessages > 0 ? unreadMessages : null
        },
        {
            title: "Notifications",
            url: "/dashboard/notifications",
            icon: Bell,
            badge: unreadNotifications > 0 ? unreadNotifications : null
        },
        {
            title: "My Courses",
            url: "/dashboard/courses",
            icon: BookOpen,
        },
        {
            title: "Sessions",
            url: "/dashboard/sessions",
            icon: Calendar,
        },
        {
            title: "Quizzes",
            url: "/dashboard/quizzes",
            icon: FileQuestion,
        },
        {
            title: "Certificates",
            url: "/dashboard/certificates",
            icon: GraduationCap,
        },
        {
            title: "Settings",
            url: "/settings",
            icon: Settings,
        },
    ]

    return (
        <Sidebar collapsible="icon" className="md:pt-20" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <span className="font-bold">M</span>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Mwenaro</span>
                                    <span className="truncate text-xs">Academy</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu className="p-2">
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                                <Link href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                    {item.badge && (
                                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name || ""} />
                                <AvatarFallback className="rounded-lg">
                                    {user?.email?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user?.user_metadata?.full_name || "User"}</span>
                                <span className="truncate text-xs">{user?.email}</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarSeparator />
                    <SidebarMenuItem>
                        <form action={signOut} className="w-full">
                            <SidebarMenuButton asChild tooltip="Log out">
                                <button type="submit" className="w-full">
                                    <LogOut />
                                    <span>Log out</span>
                                </button>
                            </SidebarMenuButton>
                        </form>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
