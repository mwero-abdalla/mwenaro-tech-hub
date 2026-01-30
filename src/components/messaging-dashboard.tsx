'use client'

import { useState, useEffect, useRef } from 'react'
import { Message, getChatContacts, getMessages, sendMessage, getOrCreateConversation } from '@/lib/chat'
import { subscribeToMessages } from '@/lib/chat-client'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, User, Search, MessageCircle } from 'lucide-react'

export function MessagingDashboard() {
    const [contacts, setContacts] = useState<any[]>([])
    const [selectedContact, setSelectedContact] = useState<any>(null)
    const [conversationId, setConversationId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchContacts()
    }, [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const fetchContacts = async () => {
        const data = await getChatContacts()
        setContacts(data)
    }

    const selectContact = async (contact: any) => {
        setSelectedContact(contact)
        try {
            const id = await getOrCreateConversation(contact.id)
            setConversationId(id)
            const history = await getMessages(id)
            setMessages(history)

            // Subscribe to real-time
            const channel = subscribeToMessages(id, (msg) => {
                setMessages(prev => [...prev.filter(m => m.id !== msg.id), msg])
            })

            return () => channel.unsubscribe()
        } catch (error) {
            console.error(error)
        }
    }

    const handleSend = async (e: React.FormEvent) => {
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

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex h-[calc(100vh-200px)] min-h-[600px] border rounded-3xl overflow-hidden bg-white dark:bg-gray-950 shadow-xl">
            {/* Sidebar */}
            <div className="w-80 border-r flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-black mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input
                            placeholder="Search people..."
                            className="pl-9 bg-white dark:bg-gray-800"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {filteredContacts.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8 text-sm">No contacts found.</p>
                    ) : (
                        filteredContacts.map(contact => (
                            <button
                                key={contact.id}
                                onClick={() => selectContact(contact)}
                                className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${selectedContact?.id === contact.id
                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                                    : 'hover:bg-white dark:hover:bg-gray-800'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedContact?.id === contact.id ? 'bg-white/20' : 'bg-orange-100 dark:bg-orange-900 text-orange-600'
                                    }`}>
                                    <User size={24} />
                                </div>
                                <div className="text-left flex-1 overflow-hidden">
                                    <p className="font-bold truncate">{contact.name}</p>
                                    <p className={`text-xs uppercase font-medium ${selectedContact?.id === contact.id ? 'text-white/70' : 'text-muted-foreground'}`}>
                                        {contact.role}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-gray-950">
                {selectedContact ? (
                    <>
                        <div className="p-6 border-b flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{selectedContact.name}</h3>
                                    <p className="text-sm text-muted-foreground">{selectedContact.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30 dark:bg-gray-900/10" ref={scrollRef}>
                            {messages.map((msg, i) => (
                                <div
                                    key={msg.id || i}
                                    className={`flex ${msg.sender_id === selectedContact.id ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[70%] space-y-1`}>
                                        <div
                                            className={`p-4 rounded-2xl text-sm ${msg.sender_id === selectedContact.id
                                                ? 'bg-white dark:bg-gray-800 border shadow-sm'
                                                : 'bg-orange-600 text-white shadow-md'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground px-2">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSend} className="p-6 border-t flex gap-4">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Write your message..."
                                className="flex-1 h-12 rounded-xl"
                            />
                            <Button type="submit" size="icon" className="h-12 w-12 bg-orange-600 hover:bg-orange-700 rounded-xl shadow-lg shadow-orange-600/20">
                                <Send size={20} />
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                        <div className="w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-200 mb-6">
                            <MessageCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-black mb-2">Your Conversations</h3>
                        <p className="text-muted-foreground max-w-sm">
                            Select a contact from the list to start a conversation or view history.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
