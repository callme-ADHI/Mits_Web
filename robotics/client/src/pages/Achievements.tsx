import { motion } from 'framer-motion'
import SectionBand from '../ui/components/SectionBand'
import AchievementCard from '../ui/components/AchievementCard'
import { staggerContainer } from '../ui/animations'
import { mockAchievements } from '../data/mockData'

export default function Achievements() {
  return (
    <>
      <SectionBand tone="paper" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
        <h1 style={{
          fontFamily:   'var(--font-display)',
          fontSize:     'clamp(2.25rem, 5vw, 3.5rem)',
          fontWeight:   700,
          color:        'var(--color-ink)',
          marginBottom: '0.75rem',
        }}>
          Achievements
        </h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '55ch' }}>
          Competition wins, publications, and recognitions — a record of what the club has accomplished.
        </p>
      </SectionBand>

      <SectionBand tone="paper" style={{ paddingTop: '1rem', paddingBottom: '5rem' }}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap:                 '1.5rem',
          }}
        >
          {mockAchievements.map(a => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </motion.div>
      </SectionBand>
    </>
  )
}
