import { prisma } from '@/lib/prisma'
import SectionBand from '@/components/SectionBand'
import EventCard from '@/components/EventCard'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { organizationId: process.env.ORGANIZATION_ID },
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

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <SectionBand tone="tint" parallax style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              marginBottom: '2.5rem',
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
            {upcoming.map(event => (
              <EventCard key={event.id} event={event} showShadow />
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
              marginBottom: '2.5rem',
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
            {past.map(event => (
              <EventCard key={event.id} event={event} showShadow={false} />
            ))}
          </div>
        </SectionBand>
      )}
    </main>
  )
}
