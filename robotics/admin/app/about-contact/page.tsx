import { prisma } from '@/lib/prisma'
import AboutContactForm from '@/components/AboutContactForm'

export const dynamic = 'force-dynamic'

export default async function AdminAboutContactPage() {
  const org = await prisma.organization.findUnique({
    where: { id: process.env.ORGANIZATION_ID },
  })

  if (!org) {
    return <div>Organization not found</div>
  }

  return <AboutContactForm initialOrg={org} />
}
