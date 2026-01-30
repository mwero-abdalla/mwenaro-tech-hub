'use server'

import { createClient as createServerClient } from './supabase/server'
import { createNotification } from './notifications'
import { sendNotificationEmail } from './email'

export interface Message {
    id: string
    conversation_id: string
    sender_id: string
    content: string
    is_read: boolean
    created_at: string
}

export interface Conversation {
    id: string
    title: string | null
    type: 'direct' | 'support'
    created_at: string
    participants?: { user_id: string }[]
}

/**
 * Get or create a direct conversation between two users
 */
export async function getOrCreateConversation(otherUserId: string, title?: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Check if a direct conversation already exists
    const { data: existing } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id)

    if (existing && existing.length > 0) {
        const conversationIds = existing.map(e => e.conversation_id)

        const { data: common } = await supabase
            .from('conversation_participants')
            .select('conversation_id')
            .in('conversation_id', conversationIds)
            .eq('user_id', otherUserId)
            .maybeSingle()

        if (common) {
            return common.conversation_id
        }
    }

    // Create new conversation
    const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({ title, type: 'direct' })
        .select()
        .single()

    if (convError) throw convError

    // Add participants
    const { error: partError } = await supabase
        .from('conversation_participants')
        .insert([
            { conversation_id: conversation.id, user_id: user.id },
            { conversation_id: conversation.id, user_id: otherUserId }
        ])

    if (partError) throw partError

    return conversation.id
}

/**
 * Send a message
 */
export async function sendMessage(conversationId: string, content: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content
        })
        .select()
        .single()

    if (error) throw error

    // Trigger notification for the recipient
    try {
        const { data: participants } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conversationId)
            .neq('user_id', user.id)
            .maybeSingle()

        if (participants) {
            await createNotification({
                user_id: participants.user_id,
                type: 'message',
                title: 'New Message',
                content: `You received a new message: "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`,
                link: '/instructor/messages'
            })

            const { data: recipient } = await supabase.auth.admin.getUserById(participants.user_id)
            if (recipient.user?.email) {
                await sendNotificationEmail(recipient.user.email, 'New Message on Mwenaro Tech', `You have a new message from ${user.user_metadata?.name || 'a user'}.`, '/instructor/messages')
            }
        }
    } catch (e) {
        console.error('Failed to send message notification:', e)
    }

    return data
}

/**
 * Get message history for a conversation
 */
export async function getMessages(conversationId: string) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data
}

/**
 * Get contacts for the current user (Instructors for students, Students for instructors)
 */
export async function getChatContacts() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const role = user.user_metadata?.role || 'student'

    if (role === 'student') {
        const { data: enrollments } = await supabase
            .from('enrollments')
            .select('cohort_id, cohorts(instructor_id)')
            .eq('user_id', user.id)
            .not('cohort_id', 'is', null)

        if (!enrollments) return []

        const instructorIds = [...new Set(enrollments.map((e: any) => e.cohorts?.instructor_id).filter(Boolean))]
        if (instructorIds.length === 0) return []

        const { data: { users } } = await supabase.auth.admin.listUsers()
        return users?.filter(u => instructorIds.includes(u.id)).map(u => ({
            id: u.id,
            email: u.email,
            name: u.user_metadata?.name || u.email?.split('@')[0],
            role: 'instructor'
        })) || []
    } else if (role === 'instructor') {
        const { data: cohorts } = await supabase
            .from('cohorts')
            .select('id')
            .eq('instructor_id', user.id)

        if (!cohorts || cohorts.length === 0) return []
        const cohortIds = cohorts.map(c => c.id)

        const { data: enrollments } = await supabase
            .from('enrollments')
            .select('user_id')
            .in('cohort_id', cohortIds)

        if (!enrollments) return []
        const studentIds = [...new Set(enrollments.map(e => e.user_id))]

        const { data: { users } } = await supabase.auth.admin.listUsers()
        return users?.filter(u => studentIds.includes(u.id)).map(u => ({
            id: u.id,
            email: u.email,
            name: u.user_metadata?.name || u.email?.split('@')[0],
            role: 'student'
        })) || []
    }

    return []
}
