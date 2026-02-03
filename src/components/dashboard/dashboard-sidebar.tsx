"use client"

import * as React from "react"
import {
    BookOpen,
    LayoutDashboard,
    LogOut,
    Settings,
    User,
    GraduationCap,
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

    const navItems = [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "My Courses",
            url: "/dashboard/courses",
            icon: BookOpen,
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
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <span className="font-bold">M</span>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Mwenaro Tech</span>
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
