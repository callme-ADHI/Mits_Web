'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getLogoSrc } from '@/lib/logo'

interface BrandingData {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  logoUrl?: string | null
  logoUpdatedAt?: Date | string | null
}

export default function BrandingForm({ initialOrg }: { initialOrg: BrandingData }) {
  const [form, setForm] = useState({
    primaryColor: initialOrg.primaryColor || '#E10600',
    secondaryColor: initialOrg.secondaryColor || '#141414',
  })
  const [currentOrg, setCurrentOrg] = useState(initialOrg)
  const [savingColors, setSavingColors] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [resettingLogo, setResettingLogo] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleColorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingColors(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/organization', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryColor: form.primaryColor,
          secondaryColor: form.secondaryColor,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update colors')
      }

      const updated = await res.json()
      setCurrentOrg(prev => ({ ...prev, primaryColor: updated.primaryColor, secondaryColor: updated.secondaryColor }))
      setSuccess('Brand colors updated successfully!')
      router.refresh()
      setTimeout(() => setSuccess(null), 4000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
    } finally {
      setSavingColors(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 512 * 1024) {
      setError('File size exceeds 512 KB limit')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setUploadingLogo(true)
    setError(null)
    setSuccess(null)

    try {
      const data = new FormData()
      data.append('file', file)

      const res = await fetch('/api/logo', {
        method: 'POST',
        body: data,
      })

      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.error || 'Failed to upload logo')
      }

      setCurrentOrg(prev => ({
        ...prev,
        logoUpdatedAt: result.logoUpdatedAt,
      }))
      setSuccess('Logo uploaded successfully!')
      router.refresh()
      setTimeout(() => setSuccess(null), 4000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
    } finally {
      setUploadingLogo(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleLogoReset = async () => {
    if (!confirm('Are you sure you want to reset to the default logo?')) return

    setResettingLogo(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/logo', {
        method: 'DELETE',
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || 'Failed to reset logo')
      }

      setCurrentOrg(prev => ({
        ...prev,
        logoUpdatedAt: null,
        logoUrl: null,
      }))
      setSuccess('Logo reset to default!')
      router.refresh()
      setTimeout(() => setSuccess(null), 4000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
    } finally {
      setResettingLogo(false)
    }
  }

  const logoSrc = getLogoSrc(currentOrg)

  return (
    <div className="max-w-4xl space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Brand & Colors</h1>
        <p className="text-sm text-slate-600 mt-1">
          Customize the visual identity of your website. Colors and logo update instantly across the site.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-md flex items-center justify-between">
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Settings Form */}
        <div className="space-y-6">
          {/* Logo Section */}
          <div className="bg-white shadow-sm border border-slate-200 rounded-lg p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-900">Organization Logo</h2>
            <p className="text-xs text-slate-500">
              Upload a custom PNG, JPEG, or WebP logo (max 512 KB). SVG files are not supported.
            </p>

            <div className="flex items-center space-x-4 pt-2">
              <div className="w-16 h-16 rounded border border-slate-200 bg-slate-50 p-2 flex items-center justify-center overflow-hidden">
                <img
                  src={logoSrc}
                  alt="Logo preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload-input"
                />
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    disabled={uploadingLogo}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold disabled:opacity-50"
                  >
                    {uploadingLogo ? 'Uploading...' : 'Upload new logo'}
                  </button>

                  <button
                    type="button"
                    disabled={resettingLogo || (!currentOrg.logoUpdatedAt && !currentOrg.logoUrl)}
                    onClick={handleLogoReset}
                    className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold disabled:opacity-40"
                  >
                    {resettingLogo ? 'Resetting...' : 'Reset to default logo'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Color Scheme Section */}
          <form onSubmit={handleColorSubmit} className="bg-white shadow-sm border border-slate-200 rounded-lg p-6 space-y-6">
            <h2 className="text-base font-semibold text-slate-900">Brand Colors</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Primary Brand Color
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Used for primary buttons, highlights, accents, and progress indicators.
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
                Used for dark backgrounds, footer, and secondary elements.
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

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={savingColors}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {savingColors ? 'Saving...' : 'Save Brand Settings'}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            Brand Preview
          </h2>

          <div className="border border-slate-200 rounded-lg p-6 space-y-4 bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded border border-slate-200 p-1 flex items-center justify-center">
                <img src={logoSrc} alt="Logo preview" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="font-bold text-lg" style={{ color: form.secondaryColor }}>
                <span>{initialOrg.name.toUpperCase()}</span>
              </div>
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
