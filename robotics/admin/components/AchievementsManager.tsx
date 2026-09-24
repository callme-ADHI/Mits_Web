'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface AchievementItem {
  id: string
  title: string
  description?: string | null
  achievementDate: Date | string
  imageUrl?: string | null
}

export default function AchievementsManager({
  initialAchievements,
}: {
  initialAchievements: AchievementItem[]
}) {
  const [achievements, setAchievements] = useState<AchievementItem[]>(initialAchievements)
  const [editingAchievement, setEditingAchievement] = useState<AchievementItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    achievementDate: '',
    imageUrl: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const openAddModal = () => {
    setEditingAchievement(null)
    setForm({
      title: '',
      description: '',
      achievementDate: new Date().toISOString().slice(0, 10),
      imageUrl: '',
    })
    setError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (ach: AchievementItem) => {
    setEditingAchievement(ach)
    const dateStr =
      ach.achievementDate instanceof Date
        ? ach.achievementDate.toISOString().slice(0, 10)
        : new Date(ach.achievementDate).toISOString().slice(0, 10)
    setForm({
      title: ach.title,
      description: ach.description || '',
      achievementDate: dateStr,
      imageUrl: ach.imageUrl || '',
    })
    setError(null)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const url = editingAchievement ? `/api/achievements/${editingAchievement.id}` : '/api/achievements'
      const method = editingAchievement ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          achievementDate: form.achievementDate,
          imageUrl: form.imageUrl || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save achievement')
      }

      const saved = await res.json()
      if (editingAchievement) {
        setAchievements(prev => prev.map(item => (item.id === saved.id ? saved : item)))
      } else {
        setAchievements(prev => [saved, ...prev])
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
      const res = await fetch(`/api/achievements/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setAchievements(prev => prev.filter(a => a.id !== id))
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Error deleting achievement.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Achievements Management</h1>
          <p className="text-sm text-slate-600 mt-1">
            Showcase trophies, awards, and recognitions on your public site.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md shadow-sm transition-colors"
        >
          + Add Achievement
        </button>
      </div>

      {/* Achievements Table */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold">
            <tr>
              <th className="py-3.5 pl-4 pr-3 sm:pl-6">Award / Title</th>
              <th className="px-3 py-3.5">Date</th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {achievements.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-500 italic">
                  No achievements listed yet. Click "+ Add Achievement" to showcase your wins.
                </td>
              </tr>
            ) : (
              achievements.map(ach => {
                const d = new Date(ach.achievementDate)
                return (
                  <tr key={ach.id} className="hover:bg-slate-50/50">
                    <td className="py-4 pl-4 pr-3 sm:pl-6 font-medium text-slate-900">
                      <div>{ach.title}</div>
                      {ach.description && (
                        <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {ach.description}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-slate-600">
                      {d.toLocaleDateString('en-IN', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 pl-3 pr-4 sm:pr-6 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openEditModal(ach)}
                        className="text-slate-600 hover:text-slate-900 text-xs font-medium px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ach.id, ach.title)}
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
              {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Title / Award Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. 1st Place - National Robotics Challenge 2026"
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
                  placeholder="Details of the achievement, competition, or recognition..."
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Achievement Date *
                </label>
                <input
                  type="date"
                  required
                  value={form.achievementDate}
                  onChange={e => setForm(f => ({ ...f, achievementDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
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
                  {saving ? 'Saving...' : editingAchievement ? 'Save Changes' : 'Create Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
