'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ContactMessageItem {
  id: string
  name: string
  email: string
  message: string
  isRead: boolean
  createdAt: Date | string
}

export default function MessagesManager({
  initialMessages,
}: {
  initialMessages: ContactMessageItem[]
}) {
  const [messages, setMessages] = useState<ContactMessageItem[]>(initialMessages)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleToggleRead = async (msg: ContactMessageItem, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const nextReadState = !msg.isRead

    try {
      const res = await fetch(`/api/messages/${msg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: nextReadState }),
      })

      if (!res.ok) throw new Error('Failed to update message status')

      const updated = await res.json()
      setMessages(prev => prev.map(m => (m.id === updated.id ? updated : m)))
      if (selectedMessage?.id === updated.id) {
        setSelectedMessage(updated)
      }
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error updating message')
    }
  }

  const handleDelete = async (msg: ContactMessageItem, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!confirm(`Are you sure you want to delete the message from "${msg.name}"?`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/messages/${msg.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete message')

      setMessages(prev => prev.filter(m => m.id !== msg.id))
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage(null)
      }
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error deleting message')
    } finally {
      setLoading(false)
    }
  }

  const openMessage = async (msg: ContactMessageItem) => {
    setSelectedMessage(msg)
    if (!msg.isRead) {
      await handleToggleRead(msg)
    }
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Contact Messages</h1>
        <p className="text-sm text-slate-600 mt-1">
          Inquiries and feedback submitted through your public website contact form.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Messages List */}
        <div className="md:col-span-1 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Inbox ({messages.filter(m => !m.isRead).length} unread)
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">No messages yet</div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedMessage?.id === msg.id
                      ? 'bg-red-50/60 border-l-4 border-red-600'
                      : !msg.isRead
                      ? 'bg-slate-50/80 font-medium'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm ${!msg.isRead ? 'font-bold text-slate-900' : 'text-slate-800'}`}>
                      {msg.name}
                    </span>
                    {!msg.isRead && (
                      <span className="w-2 h-2 rounded-full bg-red-600 inline-block mt-1"></span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 truncate mb-1">{msg.email}</div>
                  <div className="text-xs text-slate-600 line-clamp-2">{msg.message}</div>
                  <div className="text-[10px] text-slate-400 mt-2">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Details */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          {selectedMessage ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedMessage.name}</h2>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-sm text-red-600 hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                  <p className="text-xs text-slate-400 mt-1">
                    Received on {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Mark as {selectedMessage.isRead ? 'Unread' : 'Read'}
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => handleDelete(selectedMessage)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-semibold disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Message
                </h3>
                <div className="p-4 bg-slate-50 rounded border border-slate-100 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-sm text-slate-400">
              Select a message from the list to view its contents.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
