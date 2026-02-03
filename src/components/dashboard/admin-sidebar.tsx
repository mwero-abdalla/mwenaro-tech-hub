"use client"

import * as React from "react"
import {
    BookOpen,
    LayoutDashboard,
    LogOut,
    Users,
    BarChart,
    MessageSquare,
    UsersRound,
    Settings,
    FileQuestion
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
import { signOut } from "@/app/auth/actions"

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: {
        email?: string
        user_metadata?: {
            full_name?: string
            avatar_url?: string
        }
    } | null
}

export function AdminSidebar({ user, ...props }: AdminSidebarProps) {
    const pathname = usePathname()

    const navItems = [
        {
            title: "Overview",
            url: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Users",
            url: "/admin/users",
            icon: Users,
        },
        {
            title: "Courses",
            url: "/admin/courses",
            icon: BookOpen,
        },
        {
            title: "Quizzes",
            url: "/admin/quizzes",
            icon: FileQuestion,
        },
        {
            title: "Cohorts",
            url: "/admin/cohorts",
            icon: UsersRound,
        },
        {
            title: "Analytics",
            url: "/admin/analytics",
            icon: BarChart,
        },
        {
            title: "Messages",
            url: "/admin/messages",
            icon: MessageSquare,
        },
    ]

    return (
        <Sidebar collapsible="icon" {...props} className="bg-sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <span className="font-bold">A</span>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Mwenaro Admin</span>
                                    <span className="truncate text-xs">Management Console</span>
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
                            <SidebarMenuButton asChild isActive={pathname?.startsWith(item.url)} tooltip={item.title}>
                                <Link href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
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
                                    {user?.email?.charAt(0).toUpperCase() || "A"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user?.user_metadata?.full_name || "Admin"}</span>
                                <span className="truncate text-xs">{user?.email}</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarSeparator />
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === "/settings"} tooltip="Settings">
                            <Link href="/settings">
                                <Settings />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
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
