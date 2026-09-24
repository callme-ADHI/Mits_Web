import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activityLog'
import { getSessionUserId } from '@/lib/auth'

const ORG_ID = process.env.ORGANIZATION_ID!

export async function GET() {
  const org = await prisma.organization.findUnique({
    where: { id: ORG_ID },
  })
  return NextResponse.json(org)
}

export async function PUT(req: Request) {
  const userId = await getSessionUserId()
  const body = await req.json()
  const {
    name,
    description,
    contactEmail,
    showFacultyContact,
    facultyContactEmail,
    primaryColor,
    secondaryColor,
    logoUrl,
  } = body

  const org = await prisma.organization.update({
    where: { id: ORG_ID },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(contactEmail !== undefined ? { contactEmail } : {}),
      ...(showFacultyContact !== undefined ? { showFacultyContact } : {}),
      ...(facultyContactEmail !== undefined ? { facultyContactEmail } : {}),
      ...(primaryColor !== undefined ? { primaryColor } : {}),
      ...(secondaryColor !== undefined ? { secondaryColor } : {}),
      ...(logoUrl !== undefined ? { logoUrl } : {}),
    },
  })

  await logActivity(ORG_ID, userId, 'organization.updated')
  return NextResponse.json(org)
}
