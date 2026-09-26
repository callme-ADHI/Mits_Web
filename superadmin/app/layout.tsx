import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'MITS Super Admin',
  description: 'Central platform administration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Header />
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </body>
    </html>
  )
}
