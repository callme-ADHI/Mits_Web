'use client'

import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/Button'
import { fadeUp } from '@/lib/animations'

interface FieldErrors {
  name?: string[]
  email?: string[]
  message?: string[]
}

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const inputStyle: React.CSSProperties = {
    width: '100%',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.95rem',
    color: 'var(--color-ink)',
    background: 'var(--color-paper)',
    border: '1px solid var(--color-hairline)',
    borderRadius: '4px',
    padding: '0.75rem 1rem',
    outline: 'none',
    transition: 'border-color 150ms',
    boxSizing: 'border-box',
  }

  const fieldErrorStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    color: '#dc2626',
    marginTop: '0.25rem',
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    setError(null)
    setFieldErrors({})

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // company is the hidden honeypot field — always empty for real users
        body: JSON.stringify({ ...form, company: '' }),
      })

      if (res.status === 201 || res.status === 200) {
        setSubmitted(true)
        return
      }

      const data = await res.json()
      if (res.status === 400 && data.fields) {
        setFieldErrors(data.fields as FieldErrors)
        setError('Please fix the highlighted fields.')
      } else if (res.status === 429) {
        setError('Too many messages. Please try again in a few minutes.')
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Could not connect. Please check your internet connection.')
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
    >
      {submitted ? (
        <div
          style={{
            padding: '2rem',
            background: 'var(--color-tint)',
            borderRadius: '4px',
            border: '1px solid var(--color-hairline)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--color-ink)',
              marginBottom: '0.5rem',
            }}
          >
            Message received ✓
          </p>
          <p>We&#39;ll get back to you within two working days.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate id="contact-form">
          {error && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '4px',
                color: '#dc2626',
                fontSize: '0.9rem',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-ink)', letterSpacing: '0.04em' }}>
                Your name
              </span>
              <input
                id="contact-name"
                type="text"
                required
                autoComplete="name"
                placeholder="Rahul Mehta"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-red)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-hairline)')}
              />
              {fieldErrors.name && <span style={fieldErrorStyle}>{fieldErrors.name[0]}</span>}
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-ink)', letterSpacing: '0.04em' }}>
                Email address
              </span>
              <input
                id="contact-email"
                type="email"
                required
                autoComplete="email"
                placeholder="rahul@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-red)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-hairline)')}
              />
              {fieldErrors.email && <span style={fieldErrorStyle}>{fieldErrors.email[0]}</span>}
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-ink)', letterSpacing: '0.04em' }}>
                Message
              </span>
              <textarea
                id="contact-message"
                required
                rows={6}
                placeholder="Tell us what you're working on, or what you'd like to know…"
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '140px' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-red)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-hairline)')}
              />
              {fieldErrors.message && <span style={fieldErrorStyle}>{fieldErrors.message[0]}</span>}
            </label>

            {/* Hidden honeypot — real users never see or fill this */}
            <input
              type="text"
              name="company"
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              style={{ display: 'none' }}
            />

            <div>
              <Button variant="primary" type="submit" disabled={sending}>
                {sending ? 'Sending…' : 'Send message'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </motion.div>
  )
}
