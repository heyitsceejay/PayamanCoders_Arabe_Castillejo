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
  return (
    <section className="bg-gradient-to-br from-primary-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {user && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-700">
                Welcome back, {user.firstName}!
              </h2>
            </div>
          )}
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {user ? 'Continue Your Journey to' : 'Bridge the Gap Between'}
            <span className="text-primary-600"> {user ? 'Success' : 'Education & Opportunity'}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {user 
              ? 'Explore new opportunities, track your applications, and continue building your career with personalized recommendations.'
              : 'Connect with short-term jobs, remote internships, and apprenticeships while accessing free upskilling resources. Designed for individuals from low-income communities and recent graduates.'
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <>
                <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
                  View Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Link>
                <Link href="/jobs" className="btn-secondary text-lg px-8 py-3">
                  Browse Jobs
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/register" className="btn-primary text-lg px-8 py-3">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Link>
                <Link href="/jobs" className="btn-secondary text-lg px-8 py-3">
                  Browse Jobs
                </Link>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Job Opportunities</h3>
              <p className="text-gray-600">Access local and remote internships, apprenticeships, and gig work</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Growth</h3>
              <p className="text-gray-600">Interactive career maps and personalized upskilling roadmaps</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-gray-600">Connect with mentors, peers, and industry professionals</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}