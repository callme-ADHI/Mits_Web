'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BrandingData {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  logoUrl?: string | null
}

export default function BrandingForm({ initialOrg }: { initialOrg: BrandingData }) {
  const [form, setForm] = useState({
    primaryColor: initialOrg.primaryColor || '#E10600',
    secondaryColor: initialOrg.secondaryColor || '#111111',
    logoUrl: initialOrg.logoUrl || '',
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
        body: JSON.stringify({
          primaryColor: form.primaryColor,
          secondaryColor: form.secondaryColor,
          logoUrl: form.logoUrl || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update branding')
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
    <div className="max-w-4xl space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Brand & Colors</h1>
        <p className="text-sm text-slate-600 mt-1">
          Customize the visual identity of your website. Colors update instantly on the public site.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-md flex items-center justify-between">
          <span>Brand settings updated successfully! Public site colors have been updated.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-sm border border-slate-200 rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Primary Brand Color
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Used for primary buttons, highlights, accents, and the wordmark marker.
            </p>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={form.primaryColor}
                onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                className="w-12 h-10 border border-slate-300 rounded cursor-pointer p-1"
              />
              <input
                type="text"
                required
                value={form.primaryColor}
                onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                className="w-36 px-3 py-2 border border-slate-300 rounded-md text-sm font-mono text-slate-900 uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Secondary Brand Color (Dark Ink)
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Used for headings, dark backgrounds, footer, and secondary elements.
            </p>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={form.secondaryColor}
                onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))}
                className="w-12 h-10 border border-slate-300 rounded cursor-pointer p-1"
              />
              <input
                type="text"
                required
                value={form.secondaryColor}
                onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))}
                className="w-36 px-3 py-2 border border-slate-300 rounded-md text-sm font-mono text-slate-900 uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Logo URL (Optional)
            </label>
            <input
              type="url"
              value={form.logoUrl}
              onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Brand Settings'}
            </button>
          </div>
        </form>

        {/* Live Preview Card */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            Brand Preview
          </h2>

          <div className="border border-slate-200 rounded-lg p-6 space-y-4 bg-white">
            <div className="flex items-center space-x-2 font-bold text-lg" style={{ color: form.secondaryColor }}>
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: form.primaryColor }}></span>
              <span>{initialOrg.name.toUpperCase()}</span>
            </div>

            <p className="text-sm text-slate-600">
              This is how your brand accents and primary action elements appear to public visitors.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded text-sm font-semibold text-white shadow-sm"
                style={{ backgroundColor: form.primaryColor }}
              >
                Primary Button
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded text-sm font-semibold border"
                style={{ color: form.secondaryColor, borderColor: form.secondaryColor }}
              >
                Secondary Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
