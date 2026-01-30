'use server'

import { createClient } from './supabase/server'
import { revalidatePath } from 'next/cache'

export interface Notification {
    id: string
    user_id: string
    type: 'message' | 'session' | 'review' | 'system'
    title: string
    content: string
    link: string | null
    is_read: boolean
    created_at: string
}

/**
 * Create a new notification for a specific user
 */
export async function createNotification(data: {
    user_id: string
    type: Notification['type']
    title: string
    content: string
    link?: string
}) {
    const supabase = await createClient()

    const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
            user_id: data.user_id,
            type: data.type,
            title: data.title,
            content: data.content,
            link: data.link || null
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating notification:', error)
        return null
    }

    return notification
}

/**
 * Get unread notifications for the current user
 */
export async function getNotifications() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching notifications:', error)
        return []
    }

    return data as Notification[]
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

    if (error) {
        console.error('Error marking notification as read:', error)
        return false
    }

    revalidatePath('/')
    return true
}

/**
 * Mark all notifications as read for current user
 */
export async function markAllAsRead() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)

    if (error) {
        console.error('Error marking all notifications as read:', error)
        return false
    }

    revalidatePath('/')
    return true
}
