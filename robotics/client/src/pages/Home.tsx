import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useAnimation } from 'framer-motion'
import SectionBand from '../ui/components/SectionBand'
import Button from '../ui/components/Button'
import StatCounter from '../ui/components/StatCounter'
import EventCard from '../ui/components/EventCard'
import AchievementCard from '../ui/components/AchievementCard'
import { staggerContainer, fadeUp, wordReveal, heroLogo, ruleDraw } from '../ui/animations'
import { mockOrganization, mockEvents, mockAchievements, stats } from '../data/mockData'

const SESSION_KEY = 'mits_hero_played'

// Split text into spans for word-by-word reveal
function WordReveal({ text, controls }: { text: string; controls: ReturnType<typeof useAnimation> }) {
  const words = text.split(' ')
  return (
    <motion.span style={{ display: 'flex', flexWrap: 'wrap', gap: '0 0.3em' }}>
      {words.map((word, i) => (
        <motion.span key={i} custom={i} variants={wordReveal} initial="hidden" animate={controls}>
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

export default function Home() {
  const heroControls  = useAnimation()
  const wordControls  = useAnimation()
  const ruleControls  = useAnimation()
  const imageControls = useAnimation()

  const upcomingEvents  = mockEvents.filter(e => e.status === 'upcoming')
  const featuredEvent   = upcomingEvents[0]
  const recentAchievements = mockAchievements.slice(0, 3)

  useEffect(() => {
    const played = sessionStorage.getItem(SESSION_KEY)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (played || reducedMotion) {
      // Show everything immediately
      heroControls.set('visible')
      wordControls.set('visible')
      ruleControls.set('visible')
      imageControls.set('visible')
      return
    }

    async function sequence() {
      sessionStorage.setItem(SESSION_KEY, '1')
      await heroControls.start('visible')
      await wordControls.start('visible')
      ruleControls.start('visible')
      await new Promise(r => setTimeout(r, 200))
      imageControls.start('visible')
    }
    sequence()
  }, [heroControls, wordControls, ruleControls, imageControls])

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <SectionBand tone="paper" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
          <div style={{ maxWidth: '720px' }}>
            {/* Wordmark */}
            <motion.p
              variants={heroLogo}
              initial="hidden"
              animate={heroControls}
              style={{
                fontFamily:    'var(--font-sans)',
                fontSize:      '0.78rem',
                fontWeight:    600,
                letterSpacing: '0.1em',
                color:         'var(--color-red)',
                marginBottom:  '1.5rem',
                maxWidth:      'none',
              }}
            >
              MIT SCHOOL OF ENGINEERING · ROBOTICS CLUB
            </motion.p>

            {/* Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize:   'clamp(2.25rem, 5vw, 3.5rem)',
                color:      'var(--color-ink)',
                lineHeight: 1.1,
                marginBottom: '1.25rem',
              }}
            >
              <WordReveal text="Engineering the future, one robot at a time." controls={wordControls} />
            </h1>

            {/* Red rule */}
            <motion.div
              variants={ruleDraw}
              initial="hidden"
              animate={ruleControls}
              style={{
                height:       '3px',
                background:   'var(--color-red)',
                width:        '80px',
                marginBottom: '1.5rem',
                borderRadius: '2px',
              }}
            />

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={imageControls}
              style={{
                fontSize:     '1.1rem',
                color:        'var(--color-slate)',
                lineHeight:   1.7,
                marginBottom: '2.5rem',
              }}
            >
              {mockOrganization.description.split('.')[0] + '.'}
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={imageControls}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
            >
              <Link to="/events">
                <Button variant="primary">See upcoming events</Button>
              </Link>
              <Link to="/about">
                <Button variant="secondary">About us</Button>
              </Link>
            </motion.div>
          </div>

          {/* Hero image */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={imageControls}
            style={{
              borderRadius: '4px',
              overflow:     'hidden',
              aspectRatio:  '21/9',
              background:   'var(--color-hairline)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1400&q=85"
              alt="Students working on a robot in the Robotics Club workshop"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </motion.div>
        </div>
      </SectionBand>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <SectionBand tone="paper" style={{ paddingTop: '3rem', paddingBottom: '4rem', borderTop: '1px solid var(--color-hairline)' }}>
        <div
          style={{
            display:             'flex',
            flexWrap:            'wrap',
            gap:                 '2rem 0',
            alignItems:          'flex-start',
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
          <p style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      '0.78rem',
            fontWeight:    600,
            letterSpacing: '0.08em',
            color:         'var(--color-slate)',
            marginBottom:  '0.75rem',
            maxWidth:      'none',
          }}>
            WHAT'S NEXT
          </p>
          <h2 style={{
            fontFamily:   'var(--font-display)',
            fontSize:     'clamp(1.75rem, 3.5vw, 2.25rem)',
            fontWeight:   700,
            color:        'var(--color-ink)',
            marginBottom: '3rem',
          }}>
            Upcoming highlights
          </h2>
          <EventCard event={featuredEvent} featured />
        </SectionBand>
      )}

      {/* ── RECENT ACHIEVEMENTS ───────────────────────────────── */}
      <SectionBand tone="paper" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize:   'clamp(1.75rem, 3.5vw, 2.25rem)',
            fontWeight: 700,
            color:      'var(--color-ink)',
          }}>
            Recent achievements
          </h2>
          <p style={{ marginTop: '0.75rem', fontSize: '1rem' }}>
            What the club has been winning lately.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap:                 '1.5rem',
          }}
        >
          {recentAchievements.map(a => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </motion.div>

        <div style={{ marginTop: '2.5rem' }}>
          <Link to="/achievements">
            <Button variant="secondary">View all achievements</Button>
          </Link>
        </div>
      </SectionBand>

      {/* ── CONTACT CTA ───────────────────────────────────────── */}
      <SectionBand tone="tint" parallax style={{ paddingTop: '5rem', paddingBottom: '5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily:   'var(--font-display)',
            fontSize:     'clamp(1.75rem, 3.5vw, 2.25rem)',
            fontWeight:   700,
            color:        'var(--color-ink)',
            marginBottom: '1rem',
          }}>
            Want to join or collaborate?
          </h2>
          <p style={{ fontSize: '1rem', marginBottom: '2rem', maxWidth: 'none' }}>
            Whether you're a student who wants to build robots or an organisation with a project idea, we'd love to hear from you.
          </p>
          <Link to="/contact">
            <Button variant="primary">Get in touch</Button>
          </Link>
        </div>
      </SectionBand>
    </>
  )
}
