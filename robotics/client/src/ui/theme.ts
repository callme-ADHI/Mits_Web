// Design tokens — single source of truth that mirrors index.css @theme
export const colors = {
  paper:     '#FFFFFF',
  tint:      '#FBE3E0',
  red:       '#E10600',
  redDark:   '#B00500',
  ink:       '#141414',
  slate:     '#5B6068',
  hairline:  '#E7E2E1',
} as const

export const fonts = {
  display: '"Fraunces", serif',
  sans:    '"Inter", sans-serif',
} as const

export const type = {
  display:  { desktop: '3.5rem',  mobile: '2.25rem' },
  h2:       { desktop: '2.25rem', mobile: '1.75rem' },
  h3:       { desktop: '1.5rem',  mobile: '1.25rem' },
  body:     '1rem',
  small:    '0.875rem',
} as const
