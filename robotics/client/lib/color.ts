/**
 * Safe color utilities for the client.
 * Raw DB strings are NEVER injected into markup — always go through safeHex first.
 */

const HEX_RE = /^#[0-9a-fA-F]{6}$/

export function isHex(v: string | null | undefined): v is string {
  return typeof v === 'string' && HEX_RE.test(v)
}

/** Returns `value` if it's a valid 6-digit hex, otherwise `fallback`. */
export function safeHex(value: string | null | undefined, fallback: string): string {
  return isHex(value) ? value : fallback
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')
}

/** Darkens a hex color by mixing it toward black by `amount` (0–1). */
export function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount))
}

/** Mixes the primary color ~10% into white to produce a light tint. */
export function tintFromPrimary(hex: string): string {
  const [r, g, b] = hexToRgb(hex)
  const mix = 0.1
  return rgbToHex(255 + (r - 255) * mix, 255 + (g - 255) * mix, 255 + (b - 255) * mix)
}

/**
 * Returns '#ffffff' or '#141414' — whichever gives better contrast against `hex`.
 * Uses relative luminance per WCAG 2.1.
 */
export function readableOn(hex: string): '#ffffff' | '#141414' {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b
  // contrast with white = (1 + 0.05) / (L + 0.05), with black = (L + 0.05) / 0.05
  return (1.05) / (L + 0.05) >= (L + 0.05) / 0.05 ? '#ffffff' : '#141414'
}
