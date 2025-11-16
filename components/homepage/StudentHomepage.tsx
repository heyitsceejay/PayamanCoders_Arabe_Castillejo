'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  BookOpen,
  Video,
  Award,
  Briefcase,
  TrendingUp,
  Calendar,
  Target,
  Users,
  FileText,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Webinar {
  _id: string
  title: string
  scheduledDate: string
  category: string
  host: { name: string }
}

export default function StudentHomepage() {
  const { user } = useAuth()
  const [upcomingWebinars, setUpcomingWebinars] = useState<Webinar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUpcomingWebinars()
  }, [])

  const fetchUpcomingWebinars = async () => {
    try {
      const response = await fetch('/api/webinars?status=scheduled&limit=3')
      if (response.ok) {
        const data = await response.json()
        setUpcomingWebinars(data.webinars || [])
      }
    } catch (error) {
      console.error('Error fetching webinars:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden border-b border-white/30 bg-white/60 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-10 top-[-40%] h-56 w-56 rounded-full bg-purple-500/20 blur-3xl"></div>
          <div className="absolute left-[-20%] top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-blue-500/15 blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user?.firstName || 'Student'}! 🎓
              </h1>
              <p className="text-secondary-600">
                Your journey to career success starts here
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Quick Actions Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/webinars"
            className="card group flex flex-col items-center gap-3 text-center transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-all group-hover:scale-110">
              <Video className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Career Webinars</h3>
              <p className="text-sm text-secondary-600">Learn from experts</p>
            </div>
          </Link>

          <Link
            href="/interview-prep"
            className="card group flex flex-col items-center gap-3 text-center transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-all group-hover:scale-110">
              <Target className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Interview Prep</h3>
              <p className="text-sm text-secondary-600">AI-powered tips</p>
            </div>
          </Link>

          <Link
            href="/mentors"
            className="card group flex flex-col items-center gap-3 text-center transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-all group-hover:scale-110">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Find Mentors</h3>
              <p className="text-sm text-secondary-600">Get guidance</p>
            </div>
          </Link>

          <Link
            href="/resume-builder"
            className="card group flex flex-col items-center gap-3 text-center transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition-all group-hover:scale-110">
              <FileText className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Resume Builder</h3>
              <p className="text-sm text-secondary-600">Create your resume</p>
            </div>
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Learning Path */}
            <div className="card">
              <div className="mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Learning Path
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-xl border border-purple-200 bg-purple-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 text-white">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      Build Your Profile
                    </h3>
                    <p className="text-sm text-secondary-600">
                      Add your skills, education, and interests
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    Start
                  </Link>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      Take Skill Assessments
                    </h3>
                    <p className="text-sm text-secondary-600">
                      Earn certificates to showcase your abilities
                    </p>
                  </div>
                  <Link
                    href="/assessments"
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    Explore
                  </Link>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      Apply for Internships
                    </h3>
                    <p className="text-sm text-secondary-600">
                      Get real-world experience in your field
                    </p>
                  </div>
                  <Link
                    href="/jobs?type=internship"
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    Browse
                  </Link>
                </div>
              </div>
            </div>

            {/* Upcoming Webinars */}
            <div className="card">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Upcoming Webinars
                  </h2>
                </div>
                <Link
                  href="/webinars"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  View All
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-xl bg-white/50 p-4"
                    >
                      <div className="mb-2 h-5 w-3/4 rounded bg-white/70"></div>
                      <div className="h-4 w-1/2 rounded bg-white/70"></div>
                    </div>
                  ))}
                </div>
              ) : upcomingWebinars.length === 0 ? (
                <div className="rounded-xl border border-dashed border-purple-300 bg-purple-50/50 py-8 text-center">
                  <Video className="mx-auto mb-2 h-10 w-10 text-purple-400" />
                  <p className="text-sm text-secondary-600">
                    No upcoming webinars
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingWebinars.map((webinar) => (
                    <Link
                      key={webinar._id}
                      href={`/webinars/${webinar._id}`}
                      className="block rounded-xl border border-white/40 bg-white/60 p-4 transition-all hover:border-purple-500/40 hover:shadow-lg"
                    >
                      <h3 className="mb-1 font-semibold text-gray-900">
                        {webinar.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-secondary-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(webinar.scheduledDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {webinar.host.name}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Student Resources */}
            <div className="card border-purple-200/50 bg-gradient-to-br from-purple-50/50 to-white">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">
                  Student Resources
                </h3>
              </div>
              <div className="space-y-3">
                <Link
                  href="/career-map"
                  className="block rounded-lg border border-purple-200 bg-white p-3 transition-all hover:border-purple-400 hover:shadow-md"
                >
                  <h4 className="mb-1 text-sm font-semibold text-gray-900">
                    Career Map
                  </h4>
                  <p className="text-xs text-secondary-600">
                    Explore career paths in your field
                  </p>
                </Link>
                <Link
                  href="/certificates"
                  className="block rounded-lg border border-blue-200 bg-white p-3 transition-all hover:border-blue-400 hover:shadow-md"
                >
                  <h4 className="mb-1 text-sm font-semibold text-gray-900">
                    My Certificates
                  </h4>
                  <p className="text-xs text-secondary-600">
                    View your earned certificates
                  </p>
                </Link>
                <Link
                  href="/community"
                  className="block rounded-lg border border-green-200 bg-white p-3 transition-all hover:border-green-400 hover:shadow-md"
                >
                  <h4 className="mb-1 text-sm font-semibold text-gray-900">
                    Community
                  </h4>
                  <p className="text-xs text-secondary-600">
                    Connect with other students
                  </p>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="mb-4 font-semibold text-gray-900">
                Your Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-secondary-600">Profile Complete</span>
                    <span className="font-semibold text-gray-900">60%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                  <span className="text-sm text-secondary-700">
                    Certificates Earned
                  </span>
                  <span className="text-lg font-bold text-blue-600">0</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                  <span className="text-sm text-secondary-700">
                    Applications Sent
                  </span>
                  <span className="text-lg font-bold text-green-600">0</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="card border-orange-200/50 bg-gradient-to-br from-orange-50/50 to-white">
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900">Student Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-secondary-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">💡</span>
                  <span>Complete your profile to get better job matches</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">💡</span>
                  <span>Take assessments to earn certificates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">💡</span>
                  <span>Attend webinars to learn from industry experts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
