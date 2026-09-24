'use client'

import { motion } from 'framer-motion'
import { fadeUp, imageReveal } from '@/lib/animations'

export interface EventData {
  id: string
  title: string
  description?: string | null
  eventDate: Date | string
  status: string
  imageUrl?: string | null
}

interface EventCardProps {
  event: EventData
  featured?: boolean
  showShadow?: boolean
}

function formatDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function EventCard({ event, featured = false, showShadow = false }: EventCardProps) {
  if (featured) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}
      >
        {/* Image with clip-path wipe reveal */}
        {event.imageUrl && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={imageReveal}
            style={{
              overflow: 'hidden',
              borderRadius: '4px',
              aspectRatio: '16/10',
            }}
          >
            <img
              src={event.imageUrl}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </motion.div>
        )}

        {/* Text */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <p
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--color-red)',
              letterSpacing: '0.06em',
              marginBottom: '0.75rem',
              maxWidth: 'none',
            }}
          >
            {formatDate(event.eventDate)} · {event.status === 'upcoming' ? 'Upcoming' : 'Past'}
          </p>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              marginBottom: '1rem',
              lineHeight: 1.2,
            }}
          >
            {event.title}
          </h3>
          <p style={{ fontSize: '1rem', color: 'var(--color-slate)', lineHeight: 1.7 }}>
            {event.description}
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.article
      variants={fadeUp}
      style={{
        background: 'var(--color-paper)',
        border: '1px solid var(--color-hairline)',
        borderRadius: '4px',
        overflow: 'hidden',
        transition: 'box-shadow 200ms, transform 200ms',
      }}
      onMouseEnter={e => {
        if (!showShadow) return
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(20,20,20,0.1)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
      }}
    >
      {event.imageUrl && (
        <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
          <img
            src={event.imageUrl}
            alt={event.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 300ms',
            }}
          />
        </div>
      )}
      <div style={{ padding: '1.5rem' }}>
        <p
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--color-red)',
            marginBottom: '0.5rem',
            letterSpacing: '0.05em',
            maxWidth: 'none',
          }}
        >
          {formatDate(event.eventDate)}
        </p>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem',
            fontWeight: 600,
            color: 'var(--color-ink)',
            marginBottom: '0.5rem',
          }}
        >
          {event.title}
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-slate)', lineHeight: 1.6 }}>
          {event.description}
        </p>
      </div>
    </motion.article>
  )
}
