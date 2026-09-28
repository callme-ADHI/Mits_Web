import { prisma } from '@/lib/prisma'
import { ORG_ID } from '@/lib/env'
import SectionBand from '@/components/SectionBand'
import EventCard from '@/components/EventCard'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Events' }
}

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { organizationId: ORG_ID },
    orderBy: { eventDate: 'desc' },
  })

  const upcoming = events.filter(e => e.status === 'upcoming')
  const past = events.filter(e => e.status === 'past')

  return (
    <main>
      {/* Page header */}
      <SectionBand tone="paper" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 700,
            color: 'var(--color-ink)',
            marginBottom: '0.75rem',
          }}
        >
          Events
        </h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '55ch' }}>
          From competitions and workshops to campus showcases — a full record of what the club has been up to.
        </p>
      </SectionBand>

      {events.length === 0 && (
        <SectionBand tone="paper" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-ink)', opacity: 0.5 }}>
            No events yet — check back soon.
          </p>
        </SectionBand>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <SectionBand tone="tint" parallax style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              marginBottom: '2rem',
            }}
          >
            Upcoming
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {upcoming.map(e => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </SectionBand>
      )}

      {/* Past */}
      {past.length > 0 && (
        <SectionBand tone="paper" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              marginBottom: '2rem',
            }}
          >
            Past events
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {past.map(e => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </SectionBand>
      )}
    </main>
  )
}
