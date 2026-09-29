import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SmoothScroll } from '@/components/SmoothScroll'
import { AppShell } from '@/components/AppShell'

export const metadata: Metadata = {
  title: 'MITS Central Administration — Super Admin Portal',
  description: 'Muthoot Institute of Technology & Science Central Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var t = localStorage.getItem('mits_superadmin_theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch(e) {}
            })()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--ink)] antialiased selection:bg-[var(--red)] selection:text-white">
        <ThemeProvider>
          <SmoothScroll />
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
