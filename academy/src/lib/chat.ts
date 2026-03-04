'use server'

import { createClient as createServerClient } from './supabase/server'
import { createAdminClient } from './supabase/admin'
import { createNotification } from './notifications'
import { sendNotificationEmail } from './email'
import { revalidatePath } from 'next/cache'

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
    type: 'direct' | 'support' | 'group' | 'channel'
    metadata: any
    created_at: string
    participants?: { user_id: string }[]
}

/**
 * Get or create a direct conversation between two users
 */
/**
 * Create a new group conversation
 */
export async function createGroupConversation(userIds: string[], title: string, metadata: any = {}) {
    const adminSupabase = createAdminClient()

    const { data: conversation, error: convError } = await adminSupabase
        .from('conversations')
        .insert({ title, type: 'group', metadata })
        .select()
        .single()

    if (convError) throw convError

    const participants = userIds.map(userId => ({
        conversation_id: conversation.id,
        user_id: userId
    }))

    const { error: partError } = await adminSupabase
        .from('conversation_participants')
        .insert(participants)

    if (partError) throw partError

    return conversation.id
}

/**
 * Get or create a special cohort group chat
 */
export async function getOrCreateCohortGroup(cohortId: string) {
    const adminSupabase = createAdminClient()

    // Check if it exists
    const { data: existing } = await adminSupabase
        .from('conversations')
        .select('id')
        .eq('type', 'group')
        .contains('metadata', { cohort_id: cohortId })
        .maybeSingle()

    if (existing) return existing.id

    // Get cohort details to get instructor and name
    const { data: cohort } = await adminSupabase
        .from('cohorts')
        .select('name, instructor_id')
        .eq('id', cohortId)
        .single()

    if (!cohort) return null

    // Get all enrolled students
    const { data: enrollments } = await adminSupabase
        .from('enrollments')
        .select('user_id')
        .eq('cohort_id', cohortId)

    const userIds = [
        ...(cohort.instructor_id ? [cohort.instructor_id] : []),
        ...(enrollments?.map(e => e.user_id) || [])
    ]

    return createGroupConversation(userIds, `Cohort: ${cohort.name}`, { cohort_id: cohortId })
}

export async function getOrCreateConversation(otherUserId: string, title?: string) {
    const supabase = await createServerClient()
    const adminSupabase = createAdminClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Use admin client to check for existing conversation to avoid RLS limitations
    const { data: existing } = await adminSupabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id)

    if (existing && existing.length > 0) {
        const conversationIds = existing.map(e => e.conversation_id)

        const { data: common } = await adminSupabase
            .from('conversation_participants')
            .select('conversation_id')
            .in('conversation_id', conversationIds)
            .eq('user_id', otherUserId)
            .maybeSingle()

        if (common) {
            return common.conversation_id
        }
    }

    // Create new conversation via admin client
    const { data: conversation, error: convError } = await adminSupabase
        .from('conversations')
        .insert({ title, type: 'direct' })
        .select()
        .single()

    if (convError) throw convError

    // Add participants via admin client
    const { error: partError } = await adminSupabase
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
                await sendNotificationEmail(recipient.user.email, 'New Message on Mwenaro', `You have a new message from ${user.user_metadata?.name || 'a user'}.`, '/instructor/messages')
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
export async function getMessages(conversation_id: string) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from('messages')
        .select('*, profiles(full_name)')
        .eq('conversation_id', conversation_id)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data
}

/**
 * Get contacts for the current user
 * - Students see instructors of their enrolled courses + all admins
 * - Instructors see students in their cohorts/courses + all admins
 * - Admins see all users
 */
export async function getChatContacts() {
    const supabase = await createServerClient()
    const adminSupabase = createAdminClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const role = user.user_metadata?.role || 'student'

    // Fetch all admins for support (visible to everyone)
    const { data: admins } = await adminSupabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('role', 'admin')

    const adminContacts = (admins || []).filter((a: any) => a.id !== user.id).map((a: any) => ({
        id: a.id,
        email: a.email,
        name: a.full_name || a.email?.split('@')[0] || 'Admin',
        role: 'admin',
        type: 'user'
    }))

    // Fetch existing group conversations
    const { data: participations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id)

    let groupContacts: any[] = []
    if (participations && participations.length > 0) {
        const convIds = participations.map(p => p.conversation_id)
        const { data: groups } = await supabase
            .from('conversations')
            .select('id, title, type')
            .in('id', convIds)
            .in('type', ['group', 'channel'])

        groupContacts = (groups || []).map(g => ({
            id: g.id,
            name: g.title || 'Group Chat',
            role: g.type,
            type: 'group'
        }))
    }

    if (role === 'student') {
        const { data: enrollments } = await supabase
            .from('enrollments')
            .select('course_id, courses(instructor_id)')
            .eq('user_id', user.id)

        const instructorIds = [...new Set((enrollments || []).map((e: any) => e.courses?.instructor_id).filter(Boolean))]

        let instructorContacts: any[] = []
        if (instructorIds.length > 0) {
            const { data: instructors } = await adminSupabase
                .from('profiles')
                .select('id, full_name, email, role')
                .in('id', instructorIds)

            instructorContacts = (instructors || []).map((i: any) => ({
                id: i.id,
                email: i.email,
                name: i.full_name || i.email?.split('@')[0] || 'Instructor',
                role: 'instructor',
                type: 'user'
            }))
        }

        return [...groupContacts, ...adminContacts, ...instructorContacts]
    } else if (role === 'instructor') {
        const { data: cohorts } = await supabase
            .from('cohorts')
            .select('id')
            .eq('instructor_id', user.id)

        const cohortIds = (cohorts || []).map((c: any) => c.id)

        let studentContacts: any[] = []
        if (cohortIds.length > 0) {
            const { data: enrollments } = await supabase
                .from('enrollments')
                .select('user_id')
                .in('cohort_id', cohortIds)

            const studentIds = [...new Set((enrollments || []).map((e: any) => e.user_id))]

            if (studentIds.length > 0) {
                const { data: students } = await adminSupabase
                    .from('profiles')
                    .select('id, full_name, email, role')
                    .in('id', studentIds)

                studentContacts = (students || []).map((s: any) => ({
                    id: s.id,
                    email: s.email,
                    name: s.full_name || s.email?.split('@')[0] || 'Student',
                    role: 'student',
                    type: 'user'
                }))
            }
        }

        return [...groupContacts, ...adminContacts, ...studentContacts]
    }
    else if (role === 'admin') {
        const { data: allProfiles } = await adminSupabase
            .from('profiles')
            .select('id, full_name, email, role')
            .neq('id', user.id)

        return (allProfiles || []).map((p: any) => ({
            id: p.id,
            email: p.email,
            name: p.full_name || p.email?.split('@')[0] || 'User',
            role: p.role,
            type: 'user'
        }))
    }

    return [...groupContacts, ...adminContacts]
}

/**
 * Get count of unread messages for current user
 */
export async function getUnreadMessageCount() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return 0

    // Get conversations the user is part of
    const { data: participations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id)

    if (!participations || participations.length === 0) return 0

    const conversationIds = participations.map(p => p.conversation_id)

    // Count messages in those conversations that are unread and not sent by the user
    const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .in('conversation_id', conversationIds)
        .neq('sender_id', user.id)
        .eq('is_read', false)

    if (error) {
        console.error('Error counting unread messages:', error)
        return 0
    }

    return count || 0
}

/**
 * Mark all messages in a conversation as read for the current user
 */
export async function markMessagesAsRead(conversationId: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false)

    if (error) {
        console.error('Error marking messages as read:', error)
        return false
    }

    revalidatePath('/')
    return true
}
