import { requireSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ORG_ID } from '@/lib/env'
import SettingsForm from '@/components/SettingsForm'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const session = await requireSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findFirst({
    where: { id: session.userId, organizationId: ORG_ID },
    select: { id: true, name: true, email: true },
  })

  if (!user) redirect('/login')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account credentials and security settings.
        </p>
      </div>

      <SettingsForm user={user} />
    </div>
  )
}
