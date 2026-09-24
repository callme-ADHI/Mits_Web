'use client'

import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/Button'
import { fadeUp } from '@/lib/animations'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

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
          <p>We'll get back to you within two working days.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate id="contact-form">
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
            </label>

            <div>
              <Button variant="primary" type="submit">
                Send message
              </Button>
            </div>
          </div>
        </form>
      )}
    </motion.div>
  )
}
