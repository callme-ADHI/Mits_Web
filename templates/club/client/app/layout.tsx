import { prisma } from '@/lib/prisma'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingContactButton from '@/components/FloatingContactButton'

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const org = await prisma.organization.findUnique({
    where: { id: process.env.ORGANIZATION_ID },
  })

  return (
    <html lang="en">
      <head>
        <style>{`:root {
          --color-red: ${org?.primaryColor ?? '#E10600'};
          --color-red-dark: ${org?.primaryColor ?? '#B00500'};
          --color-ink: ${org?.secondaryColor ?? '#141414'};
          --color-paper: #FFFFFF;
          --color-tint: #FBE3E0;
          --color-hairline: #E7E2E1;
        }`}</style>
      </head>
      <body>
        <Navbar orgName={org?.name ?? 'Robotics Club'} />
        {children}
        <Footer
          orgName={org?.name ?? 'Robotics Club'}
          contactEmail={org?.contactEmail ?? 'robotics@mits.ac.in'}
        />
        <FloatingContactButton />
      </body>
    </html>
  )
}
