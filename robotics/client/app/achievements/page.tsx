import { prisma } from '@/lib/prisma'
import SectionBand from '@/components/SectionBand'
import AchievementCard from '@/components/AchievementCard'

export const dynamic = 'force-dynamic'

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({
    where: { organizationId: process.env.ORGANIZATION_ID },
    orderBy: { achievementDate: 'desc' },
  })

  return (
    <main>
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
          Achievements
        </h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '55ch' }}>
          Competition wins, publications, and recognitions — a record of what the club has accomplished.
        </p>
      </SectionBand>

      <SectionBand tone="paper" style={{ paddingTop: '1rem', paddingBottom: '5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {achievements.map(a => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </div>
      </SectionBand>
    </main>
  )
}
