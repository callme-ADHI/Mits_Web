import { prisma } from '@/lib/prisma'
import { ORG_ID } from '@/lib/env'
import SectionBand from '@/components/SectionBand'
import ContactForm from '@/components/ContactForm'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Contact' }
}

export default async function ContactPage() {
  const org = await prisma.organization.findUnique({
    where: { id: ORG_ID },
  })

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
          Get in touch
        </h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '55ch' }}>
          Have a project idea, want to join the club, or just have a question? Send us a message.
        </p>
      </SectionBand>

      {/* Form + info */}
      <SectionBand tone="paper" style={{ paddingBottom: '5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '4rem',
            alignItems: 'start',
          }}
        >
          {/* Form */}
          <ContactForm />

          {/* Contact info — only shown if org has configured an email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {org?.contactEmail && (
              <div>
                <p
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--color-slate)',
                    marginBottom: '0.5rem',
                    maxWidth: 'none',
                  }}
                >
                  GENERAL ENQUIRIES
                </p>
                <a
                  href={`mailto:${org.contactEmail}`}
                  style={{
                    fontSize: '1rem',
                    color: 'var(--color-red)',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  {org.contactEmail}
                </a>
              </div>
            )}

            {org?.showFacultyContact && org.facultyContactEmail && (
              <div>
                <p
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--color-slate)',
                    marginBottom: '0.5rem',
                    maxWidth: 'none',
                  }}
                >
                  FACULTY COORDINATOR
                </p>
                <a
                  href={`mailto:${org.facultyContactEmail}`}
                  style={{
                    fontSize: '1rem',
                    color: 'var(--color-red)',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  {org.facultyContactEmail}
                </a>
              </div>
            )}

            <div>
              <p
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: 'var(--color-slate)',
                  marginBottom: '0.5rem',
                  maxWidth: 'none',
                }}
              >
                WEEKLY MEETINGS
              </p>
              <p style={{ fontSize: '1rem', color: 'var(--color-ink)' }}>
                Every Saturday, 10 AM – 1 PM
                <br />
                <span style={{ color: 'var(--color-slate)', fontSize: '0.9rem' }}>
                  Lab 204, Engineering Block B
                </span>
              </p>
            </div>
          </div>
        </div>
      </SectionBand>
    </main>
  )
}
