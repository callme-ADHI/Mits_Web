'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface EventItem {
  id: string
  title: string
  description?: string | null
  eventDate: Date | string
  status: string
  imageUrl?: string | null
}

export default function EventsManager({ initialEvents }: { initialEvents: EventItem[] }) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents)
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    eventDate: '',
    status: 'upcoming',
    imageUrl: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const openAddModal = () => {
    setEditingEvent(null)
    setForm({
      title: '',
      description: '',
      eventDate: new Date().toISOString().slice(0, 16),
      status: 'upcoming',
      imageUrl: '',
    })
    setError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (ev: EventItem) => {
    setEditingEvent(ev)
    const dateStr =
      ev.eventDate instanceof Date
        ? ev.eventDate.toISOString().slice(0, 16)
        : new Date(ev.eventDate).toISOString().slice(0, 16)
    setForm({
      title: ev.title,
      description: ev.description || '',
      eventDate: dateStr,
      status: ev.status,
      imageUrl: ev.imageUrl || '',
    })
    setError(null)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events'
      const method = editingEvent ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          eventDate: form.eventDate,
          status: form.status,
          imageUrl: form.imageUrl || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save event')
      }

      const saved = await res.json()
      if (editingEvent) {
        setEvents(prev => prev.map(item => (item.id === saved.id ? saved : item)))
      } else {
        setEvents(prev => [...prev, saved])
      }

      setIsModalOpen(false)
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setEvents(prev => prev.filter(e => e.id !== id))
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Error deleting event.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Events Management</h1>
          <p className="text-sm text-slate-600 mt-1">
            Create, update, or remove club events displayed on the public site.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md shadow-sm transition-colors"
        >
          + Add Event
        </button>
      </div>

      {/* Events Table */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold">
            <tr>
              <th className="py-3.5 pl-4 pr-3 sm:pl-6">Title</th>
              <th className="px-3 py-3.5">Date</th>
              <th className="px-3 py-3.5">Status</th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {events.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500 italic">
                  No events found. Click &ldquo;+ Add Event&rdquo; to create one.
                </td>
              </tr>
            ) : (
              events.map(ev => {
                const d = new Date(ev.eventDate)
                return (
                  <tr key={ev.id} className="hover:bg-slate-50/50">
                    <td className="py-4 pl-4 pr-3 sm:pl-6 font-medium text-slate-900">
                      <div>{ev.title}</div>
                      {ev.description && (
                        <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {ev.description}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-slate-600">
                      {d.toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          ev.status === 'upcoming'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </td>
                    <td className="py-4 pl-3 pr-4 sm:pr-6 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openEditModal(ev)}
                        className="text-slate-600 hover:text-slate-900 text-xs font-medium px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id, ev.title)}
                        className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded bg-red-50 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Annual Workshop 2026"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of the event..."
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={form.eventDate}
                    onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
