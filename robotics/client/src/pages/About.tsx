import { motion } from 'framer-motion'
import SectionBand from '../ui/components/SectionBand'
import { fadeUp } from '../ui/animations'
import { mockOrganization } from '../data/mockData'

export default function About() {
  return (
    <>
      {/* Header */}
      <SectionBand tone="paper" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
        <h1 style={{
          fontFamily:   'var(--font-display)',
          fontSize:     'clamp(2.25rem, 5vw, 3.5rem)',
          fontWeight:   700,
          color:        'var(--color-ink)',
          marginBottom: '0.75rem',
        }}>
          About the club
        </h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '55ch' }}>
          Who we are, what we build, and how we started.
        </p>
      </SectionBand>

      {/* Two-column section */}
      <SectionBand tone="paper" style={{ paddingBottom: '5rem' }}>
        <div style={{
          display:    'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap:        '4rem',
          alignItems: 'start',
        }}>
          {/* Text column */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            <h2 style={{
              fontFamily:   'var(--font-display)',
              fontSize:     'clamp(1.5rem, 3vw, 2rem)',
              fontWeight:   700,
              color:        'var(--color-ink)',
              marginBottom: '1.25rem',
            }}>
              Who we are
            </h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
              {mockOrganization.description}
            </p>

            <h2 style={{
              fontFamily:   'var(--font-display)',
              fontSize:     '1.35rem',
              fontWeight:   700,
              color:        'var(--color-ink)',
              marginBottom: '0.75rem',
              marginTop:    '2rem',
            }}>
              How we started
            </h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.75, marginBottom: '1rem' }}>
              The club was started in 2019 by a group of six students who wanted a structured space to build things
              beyond the classroom curriculum. The first meeting was held in a borrowed lab with four Arduinos and a
              single stepper motor. Today we have a dedicated 1,200 sq. ft. workshop with CNC tooling, a 3D printer,
              and a full suite of oscilloscopes and logic analysers.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.75 }}>
              We operate year-round with weekly working sessions on Saturdays and monthly competitive events. Our
              members have gone on to work at companies like Bosch, DRDO, and several robotics startups — and a
              few have started their own.
            </p>

            <div style={{
              marginTop:   '2rem',
              padding:     '1.5rem',
              borderLeft:  '3px solid var(--color-red)',
              background:  'rgba(225,6,0,0.04)',
              borderRadius:'0 4px 4px 0',
            }}>
              <p style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--color-ink)', lineHeight: 1.6 }}>
                "Our goal isn't just to win competitions — it's to produce engineers who can identify a real problem
                and build something that solves it."
              </p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.75rem', color: 'var(--color-slate)', maxWidth: 'none' }}>
                — Prof. A. Sharma, Faculty Coordinator
              </p>
            </div>
          </motion.div>

          {/* Image column */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            style={{
              borderRadius: '4px',
              overflow:     'hidden',
              aspectRatio:  '4/5',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=85"
              alt="Robotics Club workshop with students assembling circuit boards and robot frames"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </motion.div>
        </div>
      </SectionBand>

      {/* Mission band */}
      <SectionBand tone="tint" parallax style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: '680px' }}>
          <h2 style={{
            fontFamily:   'var(--font-display)',
            fontSize:     'clamp(1.5rem, 3vw, 2rem)',
            fontWeight:   700,
            color:        'var(--color-ink)',
            marginBottom: '1rem',
          }}>
            Our mission
          </h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75 }}>
            To give every engineering student — regardless of their year, branch, or prior experience — access to
            real hardware, real problems, and real mentorship. We believe the best learning happens when you're
            staring at something that doesn't work and you have to figure out why.
          </p>
        </div>
      </SectionBand>
    </>
  )
}
