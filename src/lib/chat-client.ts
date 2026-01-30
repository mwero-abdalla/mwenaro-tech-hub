import { createClient } from './supabase/client'
import type { Message } from './chat'

/**
 * Subscribe to new messages in a conversation (Client Side)
 */
export function subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
    const supabase = createClient()
    return supabase
        .channel(`chat:${conversationId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            },
            (payload) => callback(payload.new as Message)
        )
        .subscribe()
}
