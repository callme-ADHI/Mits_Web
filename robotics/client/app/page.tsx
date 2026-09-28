import { prisma } from '@/lib/prisma'
import { ORG_ID } from '@/lib/env'
import SectionBand from '@/components/SectionBand'
import Button from '@/components/Button'
import StatCounter from '@/components/StatCounter'
import EventCard from '@/components/EventCard'
import AchievementCard from '@/components/AchievementCard'
import HomeHero from '@/components/HomeHero'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const org = await prisma.organization.findUnique({
    where: { id: ORG_ID },
  })

  const upcomingEvents = await prisma.event.findMany({
    where: { organizationId: ORG_ID, status: 'upcoming' },
    orderBy: { eventDate: 'asc' },
    take: 3,
  })

  const featuredEvent = upcomingEvents[0]

  const recentAchievements = await prisma.achievement.findMany({
    where: { organizationId: ORG_ID },
    orderBy: { achievementDate: 'desc' },
    take: 3,
  })

  const stats = [
    { value: 45, label: 'Active members', suffix: '+' },
    { value: 12, label: 'National trophies won', suffix: '' },
    { value: 6, label: 'Years since founding', suffix: '' },
    { value: 100, label: 'Projects completed', suffix: '+' },
  ]

  return (
    <main>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <SectionBand tone="paper" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <HomeHero orgName={org?.name ?? 'Club Website'} description={org?.description} />
      </SectionBand>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <SectionBand
        tone="paper"
        style={{
          paddingTop: '3rem',
          paddingBottom: '4rem',
          borderTop: '1px solid var(--color-hairline)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem 0',
            alignItems: 'flex-start',
          }}
        >
          {stats.map((s, i) => (
            <StatCounter
              key={s.label}
              value={s.value}
              label={s.label}
              suffix={s.suffix}
              isFirst={i === 0}
            />
          ))}
        </div>
      </SectionBand>

      {/* ── FEATURED EVENT ────────────────────────────────────── */}
      {featuredEvent && (
        <SectionBand tone="tint" parallax style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: 'var(--color-slate)',
              marginBottom: '0.75rem',
              maxWidth: 'none',
            }}
          >
            WHAT&apos;S NEXT
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              marginBottom: '3rem',
            }}
          >
            Upcoming highlights
          </h2>
          <EventCard event={featuredEvent} featured />
        </SectionBand>
      )}

      {/* ── RECENT ACHIEVEMENTS ───────────────────────────────── */}
      <SectionBand tone="paper" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
              fontWeight: 700,
              color: 'var(--color-ink)',
            }}
          >
            Recent achievements
          </h2>
          <p style={{ marginTop: '0.75rem', fontSize: '1rem' }}>
            What the club has been winning lately.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {recentAchievements.map(a => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <Button variant="secondary" as="a" href="/achievements">
            View all achievements
          </Button>
        </div>
      </SectionBand>

      {/* ── CONTACT CTA ───────────────────────────────────────── */}
      <SectionBand
        tone="tint"
        parallax
        style={{ paddingTop: '5rem', paddingBottom: '5rem', textAlign: 'center' }}
      >
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              marginBottom: '1rem',
            }}
          >
            Want to join or collaborate?
          </h2>
          <p style={{ fontSize: '1rem', marginBottom: '2rem', maxWidth: 'none' }}>
            Whether you&apos;re a student who wants to build robots or an organisation with a project idea, we&apos;d love to hear from you.
          </p>
          <Button variant="primary" as="a" href="/contact">
            Get in touch
          </Button>
        </div>
      </SectionBand>
    </main>
  )
}
