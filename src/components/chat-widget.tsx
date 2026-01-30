'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, User, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getChatContacts, getOrCreateConversation, getMessages, sendMessage, Message } from '@/lib/chat'
import { subscribeToMessages } from '@/lib/chat-client'

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [view, setView] = useState<'contacts' | 'chat'>('contacts')
    const [contacts, setContacts] = useState<any[]>([])
    const [selectedContact, setSelectedContact] = useState<any>(null)
    const [conversationId, setConversationId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen && view === 'contacts') {
            fetchContacts()
        }
    }, [isOpen, view])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const fetchContacts = async () => {
        const data = await getChatContacts()
        setContacts(data)
    }

    const startChat = async (contact: any) => {
        setIsLoading(true)
        setSelectedContact(contact)
        try {
            const id = await getOrCreateConversation(contact.id, `Chat with ${contact.name}`)
            setConversationId(id)
            const history = await getMessages(id)
            setMessages(history)
            setView('chat')

            // Subscribe to real-time
            const channel = subscribeToMessages(id, (msg) => {
                setMessages(prev => [...prev.filter(m => m.id !== msg.id), msg])
            })

            return () => {
                channel.unsubscribe()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !conversationId) return

        const content = newMessage
        setNewMessage('')
        try {
            await sendMessage(conversationId, content)
        } catch (error) {
            console.error(error)
        }
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl bg-orange-600 hover:bg-orange-700 text-white z-50 p-0"
            >
                <MessageCircle size={28} />
            </Button>
        )
    }

    return (
        <Card className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] shadow-2xl flex flex-col z-50 border-orange-500 overflow-hidden">
            {/* Header */}
            <div className="bg-orange-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {view === 'chat' && (
                        <button onClick={() => setView('contacts')} className="hover:bg-white/20 p-1 rounded">
                            <ChevronLeft size={20} />
                        </button>
                    )}
                    <h3 className="font-bold">
                        {view === 'contacts' ? 'Messages' : selectedContact?.name}
                    </h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4" ref={scrollRef}>
                {view === 'contacts' ? (
                    <div className="space-y-2">
                        {contacts.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No contacts found.</p>
                        ) : (
                            contacts.map(contact => (
                                <button
                                    key={contact.id}
                                    onClick={() => startChat(contact)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-orange-200"
                                >
                                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600">
                                        <User size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm">{contact.name}</p>
                                        <p className="text-xs text-muted-foreground uppercase">{contact.role}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg, i) => (
                            <div
                                key={msg.id || i}
                                className={`flex ${msg.sender_id === selectedContact?.id ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender_id === selectedContact?.id
                                        ? 'bg-white dark:bg-gray-800 border'
                                        : 'bg-orange-600 text-white shadow-md'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Input */}
            {view === 'chat' && (
                <form onSubmit={handleSendMessage} className="p-4 border-t bg-white dark:bg-gray-950 flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" className="bg-orange-600 hover:bg-orange-700">
                        <Send size={18} />
                    </Button>
                </form>
            )}
        </Card>
    )
}
