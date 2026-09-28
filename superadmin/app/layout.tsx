import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

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
    <html lang="en">
      <body className="min-h-screen bg-slate-50/60 text-slate-900 antialiased selection:bg-red-500 selection:text-white">
        {/* Institutional top crimson brand line */}
        <div className="h-1 bg-gradient-to-r from-[#990000] via-[#E10600] to-[#FF4D4D] w-full sticky top-0 z-50" />
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </body>
    </html>
  )
}
