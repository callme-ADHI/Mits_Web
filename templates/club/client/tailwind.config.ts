import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        red: 'var(--color-red)',
        'red-dark': 'var(--color-red-dark)',
        ink: 'var(--color-ink)',
        paper: 'var(--color-paper)',
        tint: 'var(--color-tint)',
        slate: '#5B6068',
        hairline: 'var(--color-hairline)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
