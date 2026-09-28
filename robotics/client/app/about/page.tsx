import { prisma } from '@/lib/prisma'
import { ORG_ID } from '@/lib/env'
import SectionBand from '@/components/SectionBand'
import { JourneyTimeline, type TimelineEntry } from '@/components/JourneyTimeline'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'About' }
}

export default async function AboutPage() {
  const [org, achievements, pastEvents] = await Promise.all([
    prisma.organization.findUnique({ where: { id: ORG_ID } }),
    prisma.achievement.findMany({ where: { organizationId: ORG_ID } }),
    prisma.event.findMany({ where: { organizationId: ORG_ID, status: 'past' } }),
  ])

  // Merge and sort real entries descending
  const timelineEntries: TimelineEntry[] = [
    ...achievements.map(a => ({
      id: a.id,
      title: a.title,
      date: a.achievementDate,
      type: 'achievement' as const,
      description: a.description,
    })),
    ...pastEvents.map(e => ({
      id: e.id,
      title: e.title,
      date: e.eventDate,
      type: 'event' as const,
      description: e.description,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <main>
      {/* Header */}
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
          About {org?.name ?? 'the club'}
        </h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '55ch' }}>
          Who we are, what we build, and how we started.
        </p>
      </SectionBand>

      {/* Two-column section */}
      <SectionBand tone="paper" style={{ paddingBottom: '5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '4rem',
            alignItems: 'start',
          }}
        >
          {/* Text column */}
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 700,
                color: 'var(--color-ink)',
                marginBottom: '1.25rem',
              }}
            >
              Who we are
            </h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
              {org?.description ?? 'No description has been added yet.'}
            </p>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--color-ink)',
                marginBottom: '0.75rem',
                marginTop: '2rem',
              }}
            >
              Our Mission
            </h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.75 }}>
              To give every student — regardless of their year or branch — access to real opportunities,
              hands-on collaboration, and mentorship.
            </p>
          </div>

          {/* Image column */}
          <div
            style={{
              borderRadius: '4px',
              overflow: 'hidden',
              aspectRatio: '4/5',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=85"
              alt="Club workshop with students working together"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </SectionBand>

      {/* Timeline Section */}
      {timelineEntries.length > 0 && (
        <SectionBand tone="tint" parallax style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <JourneyTimeline entries={timelineEntries} />
        </SectionBand>
      )}
    </main>
  )
}
