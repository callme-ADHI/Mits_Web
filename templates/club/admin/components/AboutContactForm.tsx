'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface OrgData {
  id: string
  name: string
  description?: string | null
  contactEmail?: string | null
  showFacultyContact: boolean
  facultyContactEmail?: string | null
}

export default function AboutContactForm({ initialOrg }: { initialOrg: OrgData }) {
  const [form, setForm] = useState({
    description: initialOrg.description || '',
    contactEmail: initialOrg.contactEmail || '',
    showFacultyContact: initialOrg.showFacultyContact,
    facultyContactEmail: initialOrg.facultyContactEmail || '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/organization', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update organization details')
      }

      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 4000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">About & Contact Details</h1>
        <p className="text-sm text-slate-600 mt-1">
          Update your organization profile, bio, and enquiry contact details.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-md flex items-center justify-between">
          <span>Organization information updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-sm border border-slate-200 rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1">
            Organization Description / Bio
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Displayed on the public home page and about page.
          </p>
          <textarea
            rows={5}
            required
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1">
            General Contact Email
          </label>
          <input
            type="email"
            required
            value={form.contactEmail}
            onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="showFacultyContact"
              checked={form.showFacultyContact}
              onChange={e => setForm(f => ({ ...f, showFacultyContact: e.target.checked }))}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-slate-300 rounded"
            />
            <label htmlFor="showFacultyContact" className="text-sm font-medium text-slate-800">
              Display Faculty Coordinator contact on public site
            </label>
          </div>

          {form.showFacultyContact && (
            <div className="pl-7">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Faculty Coordinator Email
              </label>
              <input
                type="email"
                value={form.facultyContactEmail}
                onChange={e => setForm(f => ({ ...f, facultyContactEmail: e.target.value }))}
                placeholder="faculty.advisor@mits.ac.in"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
