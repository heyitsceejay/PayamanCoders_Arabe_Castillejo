import './globals.css'
import { Space_Grotesk } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Providers from '@/components/Providers'
import AuthDebug from '@/components/AuthDebug'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata = {
  title: 'WorkQit - Connecting Talent with Opportunity',
  description: 'A dual-purpose platform connecting individuals with job opportunities and upskilling resources',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="min-h-screen bg-transparent font-[family-name:var(--font-space-grotesk)]">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <AuthDebug />
          </div>
        </Providers>
      </body>
    </html>
  )
}