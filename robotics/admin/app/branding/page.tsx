import { prisma } from '@/lib/prisma'
import BrandingForm from '@/components/BrandingForm'

export const dynamic = 'force-dynamic'

export default async function AdminBrandingPage() {
  const org = await prisma.organization.findUnique({
    where: { id: process.env.ORGANIZATION_ID },
  })

  if (!org) {
    return <div>Organization not found</div>
  }

  return <BrandingForm initialOrg={org} />
}
