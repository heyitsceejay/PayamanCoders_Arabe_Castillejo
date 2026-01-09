import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowRight, Users, Briefcase, TrendingUp } from 'lucide-react'

interface User {
  firstName: string
  lastName: string
  role: string
}

interface HeroProps {
  user?: User
}

export default function Hero({ user }: HeroProps) {
  const [isEntering, setIsEntering] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <section className="hero-gradient relative overflow-hidden py-24">
      <div className="auth-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-secondary-500/15 blur-3xl"></div>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`hero-panel text-center auth-panel-pulse ${isEntering ? 'auth-panel-enter' : ''}`}>
          {user && (
            <div className="mb-6 animate-[floatUp_0.85s_ease-out]">
              <h2 className="text-2xl font-semibold text-secondary-600">
                Welcome back, {user.firstName}!
              </h2>
            </div>
          )}
          
          <h1 className="hero-headline mb-8 md:leading-[1.05]">
            {user ? 'Continue Your Journey to' : 'Bridge the Gap Between'}
            <span className="ml-2 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 bg-clip-text text-transparent">
              {user ? 'Success' : 'Education & Opportunity'}
            </span>
          </h1>
          <p className="hero-subheadline">
            {user 
              ? 'Explore new opportunities, track your applications, and continue building your career with personalized recommendations.'
              : 'Connect with short-term jobs and remote internships while accessing free upskilling resources. Designed for individuals from low-income communities and recent graduates.'
            }
          </p>
          
          <div className="hero-cta">
            {user ? (
              <>
                <Link href="/dashboard" className="btn-primary group px-9 py-3 text-lg">
                  <span>View Dashboard</span>
                  <ArrowRight className="ml-2 inline h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link href="/jobs" className="btn-secondary group px-9 py-3 text-lg">
                  <span>Browse Jobs</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-primary group px-9 py-3 text-lg">
                  <span>Get Startedd</span>
                  <ArrowRight className="ml-2 inline h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link href="/jobs" className="btn-secondary group px-9 py-3 text-lg">
                  <span>Browse Jobs</span>
                </Link>
              </>
            )}
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div
              className="feature-card group text-center"
              style={{ '--float-delay': '0.05s' } as CSSProperties}
            >
              <div className="feature-icon mx-auto mb-6">
                <Briefcase className="h-10 w-10" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Job Opportunities</h3>
              <p className="text-secondary-600">Access local and remote internships, apprenticeships, and gig work</p>
            </div>
            
            <div
              className="feature-card group text-center"
              style={{ '--float-delay': '0.15s' } as CSSProperties}
            >
              <div className="feature-icon mx-auto mb-6">
                <TrendingUp className="h-10 w-10" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Career Growth</h3>
              <p className="text-secondary-600">Interactive career maps and personalized upskilling roadmaps</p>
            </div>
            
            <div
              className="feature-card group text-center"
              style={{ '--float-delay': '0.25s' } as CSSProperties}
            >
              <div className="feature-icon mx-auto mb-6">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Community Support</h3>
              <p className="text-secondary-600">Connect with mentors, peers, and industry professionals</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}