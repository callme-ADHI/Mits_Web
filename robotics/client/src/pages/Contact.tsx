import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import SectionBand from '../ui/components/SectionBand'
import Button from '../ui/components/Button'
import { fadeUp } from '../ui/animations'
import { mockOrganization } from '../data/mockData'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Non-functional for now — Phase 4 will wire this to the API
    setSubmitted(true)
  }

  const inputStyle: React.CSSProperties = {
    width:        '100%',
    fontFamily:   'var(--font-sans)',
    fontSize:     '0.95rem',
    color:        'var(--color-ink)',
    background:   'var(--color-paper)',
    border:       '1px solid var(--color-hairline)',
    borderRadius: '4px',
    padding:      '0.75rem 1rem',
    outline:      'none',
    transition:   'border-color 150ms',
    boxSizing:    'border-box',
  }

  return (
    <>
      {/* Header */}
      <SectionBand tone="paper" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
        <h1 style={{
          fontFamily:   'var(--font-display)',
          fontSize:     'clamp(2.25rem, 5vw, 3.5rem)',
          fontWeight:   700,
          color:        'var(--color-ink)',
          marginBottom: '0.75rem',
        }}>
          Get in touch
        </h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '55ch' }}>
          Have a project idea, want to join the club, or just have a question? Send us a message.
        </p>
      </SectionBand>

      {/* Form + info */}
      <SectionBand tone="paper" style={{ paddingBottom: '5rem' }}>
        <div style={{
          display:   'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap:       '4rem',
          alignItems:'start',
        }}>
          {/* Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            {submitted ? (
              <div style={{
                padding:      '2rem',
                background:   'var(--color-tint)',
                borderRadius: '4px',
                border:       '1px solid var(--color-hairline)',
              }}>
                <p style={{
                  fontFamily:   'var(--font-display)',
                  fontSize:     '1.25rem',
                  fontWeight:   600,
                  color:        'var(--color-ink)',
                  marginBottom: '0.5rem',
                }}>
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
                      onBlur={e  => (e.currentTarget.style.borderColor = 'var(--color-hairline)')}
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
                      onBlur={e  => (e.currentTarget.style.borderColor = 'var(--color-hairline)')}
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
                      onBlur={e  => (e.currentTarget.style.borderColor = 'var(--color-hairline)')}
                    />
                  </label>

                  <div>
                    <Button variant="primary" type="submit">Send message</Button>
                  </div>
                </div>
              </form>
            )}
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <div>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-slate)', marginBottom: '0.5rem', maxWidth: 'none' }}>
                GENERAL ENQUIRIES
              </p>
              <a
                href={`mailto:${mockOrganization.contactEmail}`}
                style={{ fontSize: '1rem', color: 'var(--color-red)', textDecoration: 'none', fontWeight: 500 }}
              >
                {mockOrganization.contactEmail}
              </a>
            </div>

            {mockOrganization.showFacultyContact && (
              <div>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-slate)', marginBottom: '0.5rem', maxWidth: 'none' }}>
                  FACULTY COORDINATOR
                </p>
                <a
                  href={`mailto:${mockOrganization.facultyContactEmail}`}
                  style={{ fontSize: '1rem', color: 'var(--color-red)', textDecoration: 'none', fontWeight: 500 }}
                >
                  {mockOrganization.facultyContactEmail}
                </a>
              </div>
            )}

            <div>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-slate)', marginBottom: '0.5rem', maxWidth: 'none' }}>
                WEEKLY MEETINGS
              </p>
              <p style={{ fontSize: '1rem', color: 'var(--color-ink)' }}>
                Every Saturday, 10 AM – 1 PM<br />
                <span style={{ color: 'var(--color-slate)', fontSize: '0.9rem' }}>Lab 204, Engineering Block B</span>
              </p>
            </div>
          </motion.div>
        </div>
      </SectionBand>
    </>
  )
}
