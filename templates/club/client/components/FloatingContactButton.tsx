'use client'

import Link from 'next/link'

export default function FloatingContactButton() {
  return (
    <Link
      href="/contact"
      aria-label="Contact us"
      title="Contact us"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 200,
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        background: 'var(--color-red)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        boxShadow: '0 4px 20px rgba(225,6,0,0.35)',
        transition: 'background 150ms, transform 150ms, box-shadow 150ms',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.background = 'var(--color-red-dark)'
        ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(225,6,0,0.45)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.background = 'var(--color-red)'
        ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(225,6,0,0.35)'
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    </Link>
  )
}
