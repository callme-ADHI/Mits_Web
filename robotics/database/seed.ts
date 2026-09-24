import { PrismaClient, OrgType, EventStatus } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean up any existing data in reverse relation order
  await prisma.activityLog.deleteMany()
  await prisma.achievement.deleteMany()
  await prisma.event.deleteMany()
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()

  // 1. One Organization: name "Robotics Club", slug "robotics", type club, default colors
  const org = await prisma.organization.create({
    data: {
      name: 'Robotics Club',
      slug: 'robotics',
      type: OrgType.club,
      primaryColor: '#E10600',
      secondaryColor: '#111111',
      description:
        'The premier competitive and research robotics organization at Muthoot Institute of Technology and Science. We build combat robots, autonomous rovers, and participate in national tech fests.',
      contactEmail: 'robotics@mits.ac.in',
      showFacultyContact: true,
      facultyContactEmail: 'faculty.advisor@mits.ac.in',
    },
  })

  console.log(`Created organization: ${org.name} (${org.id})`)

  // 2. One User: name "Demo Admin", email "admin@robotics.test", password hashed with bcrypt "changeme123", role "org_admin"
  const passwordHash = await bcrypt.hash('changeme123', 10)
  const user = await prisma.user.create({
    data: {
      name: 'Demo Admin',
      email: 'admin@robotics.test',
      passwordHash,
      role: 'org_admin',
      organizationId: org.id,
    },
  })

  console.log(`Created admin user: ${user.email} (${user.id})`)

  // 3. Three Event rows linked to that organization (mix of upcoming and past)
  const events = await Promise.all([
    prisma.event.create({
      data: {
        organizationId: org.id,
        title: 'ROBO-WARS 2026: Annual Combat Robotics Championship',
        description:
          'Our flagship annual tournament returns. Twelve colleges, 24 combat robots, one winner. Hosted at the main auditorium with live video streaming.',
        eventDate: new Date('2026-10-18T09:30:00.000Z'),
        status: EventStatus.upcoming,
        imageUrl: null,
      },
    }),
    prisma.event.create({
      data: {
        organizationId: org.id,
        title: 'Autonomous Navigation & ROS 2 Workshop',
        description:
          'Hands-on session on LiDAR mapping, SLAM, and robot operating system fundamentals using Python and ROS 2 Humble.',
        eventDate: new Date('2026-11-05T14:00:00.000Z'),
        status: EventStatus.upcoming,
        imageUrl: null,
      },
    }),
    prisma.event.create({
      data: {
        organizationId: org.id,
        title: 'National Drone Racing League — Regional Qualifier',
        description:
          'Campus qualifier for the South India Drone Racing Cup. Custom FPV racing drones built and flown by club pilots.',
        eventDate: new Date('2026-02-15T10:00:00.000Z'),
        status: EventStatus.past,
        imageUrl: null,
      },
    }),
  ])

  console.log(`Created ${events.length} events`)

  // 4. One Achievement row linked to that organization
  const achievement = await prisma.achievement.create({
    data: {
      organizationId: org.id,
      title: 'First Prize — National Robotics Challenge 2025',
      description:
        'Our 30kg combat robot "Titan-X" clinched first place at IIT Madras TechFest out of 48 national teams.',
      achievementDate: new Date('2025-12-20T16:00:00.000Z'),
      imageUrl: null,
    },
  })

  console.log(`Created achievement: ${achievement.title} (${achievement.id})`)
  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
