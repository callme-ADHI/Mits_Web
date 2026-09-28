import { prisma } from '@/lib/prisma'
import './globals.css'
import AdminNav from '@/components/AdminNav'

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const org = await prisma.organization.findUnique({
    where: { id: process.env.ORGANIZATION_ID },
  })

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        <AdminNav orgName={org?.name ?? 'Club Admin'} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </body>
    </html>
  )
}
