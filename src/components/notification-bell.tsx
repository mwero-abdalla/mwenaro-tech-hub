'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getNotifications, markAsRead, markAllAsRead, Notification } from '@/lib/notifications'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        fetchNotifications()

        // Subscribe to real-time notifications
        const supabase = createClient()
        const channel = supabase
            .channel('public:notifications')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications'
            }, (payload) => {
                setNotifications(prev => [payload.new as Notification, ...prev])
                setUnreadCount(c => c + 1)
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const fetchNotifications = async () => {
        const data = await getNotifications()
        setNotifications(data)
        setUnreadCount(data.filter(n => !n.is_read).length)
    }

    const handleMarkAsRead = async (id: string) => {
        const success = await markAsRead(id)
        if (success) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
            setUnreadCount(c => Math.max(0, c - 1))
        }
    }

    const handleMarkAllRead = async () => {
        const success = await markAllAsRead()
        if (success) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
            setUnreadCount(0)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white border-2 border-white dark:border-gray-950">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden rounded-3xl border-orange-100 shadow-2xl dark:border-gray-800">
                <div className="bg-orange-600 p-4 text-white flex items-center justify-between">
                    <h3 className="font-bold">Notifications</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllRead}
                        className="text-[10px] h-6 hover:bg-white/20 text-white p-2"
                    >
                        Mark all as read
                    </Button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <p className="text-sm">No notifications yet.</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <DropdownMenuItem
                                key={n.id}
                                className={`flex flex-col items-start p-4 border-b last:border-0 focus:bg-orange-50 dark:focus:bg-gray-800 ${!n.is_read ? 'bg-orange-50/30 dark:bg-orange-900/10' : ''}`}
                                onClick={() => handleMarkAsRead(n.id)}
                            >
                                <div className="flex w-full justify-between items-start gap-2 mb-1">
                                    <span className="text-xs font-black uppercase text-orange-600 leading-none">
                                        {n.type}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                        {new Date(n.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="font-bold text-sm leading-tight mb-1">{n.title}</p>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{n.content}</p>
                                {n.link && (
                                    <Link
                                        href={n.link}
                                        className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 hover:orange-700 underline"
                                    >
                                        View Details <ExternalLink size={10} />
                                    </Link>
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
