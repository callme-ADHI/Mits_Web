'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { MagneticButton } from '@/components/MagneticButton'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: ReactNode
  as?: 'button' | 'a'
  href?: string
}

export default function Button({
  variant = 'primary',
  children,
  as: Tag = 'button',
  href,
  style,
  ...rest
}: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.875rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
    padding: '0.75rem 1.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background 150ms, color 150ms, border-color 150ms, transform 100ms',
    border: '2px solid transparent',
    lineHeight: 1,
    ...style,
  }

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--color-red)',
      color: 'var(--color-on-red, #ffffff)',
      borderColor: 'var(--color-red)',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--color-ink)',
      borderColor: 'var(--color-ink)',
    },
  }

  const merged: React.CSSProperties = { ...base, ...variants[variant] }

  const handleEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (variant === 'primary') {
      (e.currentTarget as HTMLElement).style.background = 'var(--color-red-dark)'
      ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--color-red-dark)'
    } else {
      ;(e.currentTarget as HTMLElement).style.background = 'var(--color-ink)'
      ;(e.currentTarget as HTMLElement).style.color = '#fff'
    }
  }

  const handleLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (variant === 'primary') {
      (e.currentTarget as HTMLElement).style.background = 'var(--color-red)'
      ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--color-red)'
    } else {
      ;(e.currentTarget as HTMLElement).style.background = 'transparent'
      ;(e.currentTarget as HTMLElement).style.color = 'var(--color-ink)'
    }
  }

  if (Tag === 'a' && href) {
    return (
      <Link
        href={href}
        style={merged}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {children}
      </Link>
    )
  }

  if (variant === 'primary') {
    return (
      <MagneticButton
        style={merged}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        {...rest}
      >
        {children}
      </MagneticButton>
    )
  }

  return (
    <button
      style={merged}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {children}
    </button>
  )
}
