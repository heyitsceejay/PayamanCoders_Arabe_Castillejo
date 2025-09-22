'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/LandingPage/Hero'
import Features from '@/components/LandingPage/Features'
import Stats from '@/components/LandingPage/Stats'
import JobSeekerHomepage from '@/components/homepage/JobSeekerHomepage'
import EmployerHomepage from '@/components/homepage/EmployerHomepage'
import MentorHomepage from '@/components/homepage/MentorHomepage'

interface User {
  role: string
  firstName: string
  lastName: string
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUserRole()
  }, [])

  const checkUserRole = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      // User not authenticated, show default homepage
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Show role-specific homepage for authenticated users
  if (user) {
    switch (user.role) {
      case 'employer':
        return <EmployerHomepage user={user} />
      case 'mentor':
        return <MentorHomepage user={user} />
      case 'job_seeker':
        return <JobSeekerHomepage user={user} />
      default:
        return <JobSeekerHomepage user={user} />
    }
  }

  // Default homepage for unauthenticated users (general landing page)
  return (
    <div>
      <Hero />
      <Features />
      <Stats />
    </div>
  )
}