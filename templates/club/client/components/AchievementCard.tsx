'use client'

import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/animations'
import { KenBurnsImage } from '@/components/KenBurnsImage'

export interface AchievementData {
  id: string
  title: string
  description?: string | null
  achievementDate: Date | string
  imageUrl?: string | null
}

interface AchievementCardProps {
  achievement: AchievementData
}

function formatDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  })
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <motion.article
      variants={fadeUp}
      style={{
        background: 'var(--color-paper)',
        border: '1px solid var(--color-hairline)',
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {achievement.imageUrl && (
        <div style={{ aspectRatio: '16/9', flexShrink: 0 }}>
          <KenBurnsImage src={achievement.imageUrl} alt={achievement.title} />
        </div>
      )}
      <div style={{ padding: '1.5rem', flex: 1 }}>
        <p
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--color-slate)',
            marginBottom: '0.5rem',
            letterSpacing: '0.04em',
            maxWidth: 'none',
          }}
        >
          {formatDate(achievement.achievementDate)}
        </p>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            fontWeight: 600,
            color: 'var(--color-ink)',
            marginBottom: '0.5rem',
          }}
        >
          {achievement.title}
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-slate)', lineHeight: 1.6 }}>
          {achievement.description}
        </p>
      </div>
    </motion.article>
  )
}
