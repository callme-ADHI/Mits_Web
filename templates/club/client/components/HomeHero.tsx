'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'
import Button from '@/components/Button'
import { fadeUp, wordReveal, heroLogo, ruleDraw } from '@/lib/animations'

const SESSION_KEY = 'mits_hero_played'

function WordReveal({ text, controls }: { text: string; controls: ReturnType<typeof useAnimation> }) {
  const words = text.split(' ')
  return (
    <span style={{ display: 'flex', flexWrap: 'wrap', gap: '0 0.3em' }}>
      {words.map((word, i) => (
        <motion.span key={i} custom={i} variants={wordReveal} initial="hidden" animate={controls}>
          {word}
        </motion.span>
      ))}
    </span>
  )
}

interface HomeHeroProps {
  orgName: string
  description?: string | null
}

export default function HomeHero({ orgName, description }: HomeHeroProps) {
  const heroControls = useAnimation()
  const wordControls = useAnimation()
  const ruleControls = useAnimation()
  const imageControls = useAnimation()

  const snippet = description ? description.split('.')[0] + '.' : 'Engineering the future, one robot at a time.'

  useEffect(() => {
    const played = sessionStorage.getItem(SESSION_KEY)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (played || reducedMotion) {
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
      <div style={{ maxWidth: '720px' }}>
        {/* Wordmark */}
        <motion.p
          variants={heroLogo}
          initial="hidden"
          animate={heroControls}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'var(--color-red)',
            marginBottom: '1.5rem',
            maxWidth: 'none',
          }}
        >
          MUTHOOT INSTITUTE OF TECHNOLOGY & SCIENCE · {orgName.toUpperCase()}
        </motion.p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            color: 'var(--color-ink)',
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
            height: '3px',
            background: 'var(--color-red)',
            width: '80px',
            marginBottom: '1.5rem',
            borderRadius: '2px',
          }}
        />

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={imageControls}
          style={{
            fontSize: '1.1rem',
            color: 'var(--color-slate)',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}
        >
          {snippet}
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={imageControls}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
        >
          <Button variant="primary" as="a" href="/events">
            See upcoming events
          </Button>
          <Button variant="secondary" as="a" href="/about">
            About us
          </Button>
        </motion.div>
      </div>

      {/* Hero image */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={imageControls}
        style={{
          borderRadius: '4px',
          overflow: 'hidden',
          aspectRatio: '21/9',
          background: 'var(--color-hairline)',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1400&q=85"
          alt="Students working on a robot in the workshop"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </motion.div>
    </div>
  )
}
