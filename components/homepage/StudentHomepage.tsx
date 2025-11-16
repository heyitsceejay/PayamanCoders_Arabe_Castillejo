'use client'

import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
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
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import ProfileCard from '@/components/ProfileCard'

interface Webinar {
  _id: string
  title: string
  scheduledDate: string
  category: string
  host: { name: string }
}

interface Stats {
  webinarsAttended: number
  assessmentsTaken: number
  certificatesEarned: number
  learningHours: number
}

export default function StudentHomepage() {
  const { user } = useAuth()
  const [upcomingWebinars, setUpcomingWebinars] = useState<Webinar[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [stats, setStats] = useState<Stats>({
    webinarsAttended: 0,
    assessmentsTaken: 0,
    certificatesEarned: 0,
    learningHours: 0,
  })
  const [loading, setLoading] = useState(true)
  const [isEntering, setIsEntering] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const [profileRes, webinarsRes, certificatesRes] = await Promise.all([
        fetch('/api/user/profile', { credentials: 'include' }),
        fetch('/api/webinars?status=scheduled&limit=3'),
        fetch('/api/certificates/user')
      ])

      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setUserProfile(profileData.user)
      }

      if (webinarsRes.ok) {
        const data = await webinarsRes.json()
        setUpcomingWebinars(data.webinars || [])
      }

      if (certificatesRes.ok) {
        const data = await certificatesRes.json()
        setStats(prev => ({
          ...prev,
          certificatesEarned: data.certificates?.length || 0
        }))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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

  if (loading) {
    return (
      <div className="hero-gradient relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="auth-background-grid" aria-hidden="true" />
        {isEntering && <div className="auth-entry-overlay" />}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-3xl animate-pulse"></div>
          <div
            className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl animate-pulse"
            style={{ animationDelay: '0.5s' }}
          ></div>
        </div>
        <div className="text-center relative z-10 animate-[floatUp_0.85s_ease-out]">
          <div className="futuristic-loader mx-auto mb-6">
            <div className="futuristic-loader-inner"></div>
          </div>
          <h2 className="auth-title text-2xl font-bold mb-3">
            Loading Dashboard...
          </h2>
          <p className="auth-subtitle">Please wait while we fetch your data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl animate-pulse"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-[-10%] bottom-20 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-blue-400/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`mb-10 ${isEntering ? 'auth-panel-enter' : ''}`}>
          <div className="relative overflow-hidden group/header mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover/header:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="relative flex items-center gap-4">
              <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 text-white shadow-xl shadow-purple-500/40 group/icon flex-shrink-0">
                <GraduationCap className="h-8 w-8 md:h-10 md:w-10 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/50 to-blue-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-2xl blur-xl opacity-0 group-hover/icon:opacity-100 animate-pulse transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 animate-[floatUp_0.85s_ease-out] mb-2">
                  Welcome, {user?.firstName || 'Student'}! 🎓
                </h1>
                <p className="text-lg md:text-xl text-secondary-600">
                  Your journey to career success starts here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile and Tips Section */}
        <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <ProfileCard userProfile={userProfile} />

          {/* Tips Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="card relative overflow-hidden group/tips hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] border-2 border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-white">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover/tips:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-blue-500/40 bg-blue-500/20 text-blue-600 shadow-lg shadow-blue-500/40 group-hover/tips:scale-110 group-hover/tips:rotate-12 transition-all duration-500">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Student Tips</h3>
                </div>
                <ul className="space-y-3 text-base text-secondary-700">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl font-bold">•</span>
                    <span>Complete skill assessments to earn certificates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl font-bold">•</span>
                    <span>Attend webinars to learn from industry experts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl font-bold">•</span>
                    <span>Build your resume early to stand out</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card relative overflow-hidden group/progress hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] border-2 border-green-200/50 bg-gradient-to-br from-green-50/50 to-white">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover/progress:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-green-500/40 bg-green-500/20 text-green-600 shadow-lg shadow-green-500/40 group-hover/progress:scale-110 group-hover/progress:rotate-12 transition-all duration-500">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Your Progress</h3>
                </div>
                <p className="mb-4 text-base text-secondary-700 font-medium">
                  Keep learning and growing your skills to prepare for your career!
                </p>
                <div className="text-sm text-secondary-600">
                  You're on the right track. Continue attending webinars and taking assessments.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div
            className="stat-card relative overflow-hidden group/stat hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
            style={{ '--float-delay': '0.1s' } as CSSProperties}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.15),transparent_70%)] opacity-0 group-hover/stat:opacity-100 transition-opacity duration-700"></div>
            <div className="relative p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 relative group/icon">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-purple-500/40 bg-purple-500/20 text-purple-600 shadow-xl shadow-purple-500/40 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-500">
                    <Video className="h-8 w-8 group-hover/icon:drop-shadow-[0_0_8px_rgba(147,51,234,0.6)] transition-all duration-300" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-400/30 to-purple-600/30 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="ml-6 flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-2 break-words">
                    Webinars
                  </p>
                  <p className="stat-number text-3xl md:text-4xl">{stats.webinarsAttended}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="stat-card relative overflow-hidden group/stat hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
            style={{ '--float-delay': '0.2s' } as CSSProperties}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)] opacity-0 group-hover/stat:opacity-100 transition-opacity duration-700"></div>
            <div className="relative p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 relative group/icon">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-blue-500/40 bg-blue-500/20 text-blue-600 shadow-xl shadow-blue-500/40 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-500">
                    <FileText className="h-8 w-8 group-hover/icon:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all duration-300" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="ml-6 flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-2 break-words">
                    Assessments
                  </p>
                  <p className="stat-number text-3xl md:text-4xl">{stats.assessmentsTaken}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="stat-card relative overflow-hidden group/stat hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
            style={{ '--float-delay': '0.3s' } as CSSProperties}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15),transparent_70%)] opacity-0 group-hover/stat:opacity-100 transition-opacity duration-700"></div>
            <div className="relative p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 relative group/icon">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-green-500/40 bg-green-500/20 text-green-600 shadow-xl shadow-green-500/40 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-500">
                    <Award className="h-8 w-8 group-hover/icon:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] transition-all duration-300" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-green-400/30 to-green-600/30 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="ml-6 flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-2 break-words">
                    Certificates
                  </p>
                  <p className="stat-number text-3xl md:text-4xl">{stats.certificatesEarned}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="stat-card relative overflow-hidden group/stat hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
            style={{ '--float-delay': '0.4s' } as CSSProperties}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/10 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.15),transparent_70%)] opacity-0 group-hover/stat:opacity-100 transition-opacity duration-700"></div>
            <div className="relative p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 relative group/icon">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-orange-500/40 bg-orange-500/20 text-orange-600 shadow-xl shadow-orange-500/40 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-500">
                    <TrendingUp className="h-8 w-8 group-hover/icon:drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] transition-all duration-300" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-orange-600/30 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="ml-6 flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-2 break-words">
                    Learning Hours
                  </p>
                  <p className="stat-number text-3xl md:text-4xl">{stats.learningHours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 animate-[floatUp_0.85s_ease-out]">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link
              href="/webinars"
              className="feature-card relative overflow-hidden p-8 group hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
              style={{ '--float-delay': '0.1s' } as CSSProperties}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-purple-500/40 bg-purple-500/20 text-purple-600 mb-6 shadow-xl shadow-purple-500/40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 group/icon">
                  <Video className="h-8 w-8 group-hover/icon:drop-shadow-[0_0_8px_rgba(147,51,234,0.6)] transition-all duration-300" />
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-400/30 to-purple-600/30 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  Career Webinars
                </h3>
                <p className="text-base text-secondary-600">Learn from experts</p>
              </div>
            </Link>

            <Link
              href="/interview-prep"
              className="feature-card relative overflow-hidden p-8 group hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
              style={{ '--float-delay': '0.2s' } as CSSProperties}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-blue-500/40 bg-blue-500/20 text-blue-600 mb-6 shadow-xl shadow-blue-500/40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 group/icon">
                  <Target className="h-8 w-8 group-hover/icon:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all duration-300" />
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  Interview Prep
                </h3>
                <p className="text-base text-secondary-600">AI-powered tips</p>
              </div>
            </Link>

            <Link
              href="/mentors"
              className="feature-card relative overflow-hidden p-8 group hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
              style={{ '--float-delay': '0.3s' } as CSSProperties}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-green-500/40 bg-green-500/20 text-green-600 mb-6 shadow-xl shadow-green-500/40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 group/icon">
                  <Users className="h-8 w-8 group-hover/icon:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] transition-all duration-300" />
                  <div className="absolute -inset-1 bg-gradient-to-br from-green-400/30 to-green-600/30 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  Find Mentors
                </h3>
                <p className="text-base text-secondary-600">Get guidance</p>
              </div>
            </Link>

            <Link
              href="/resume-builder"
              className="feature-card relative overflow-hidden p-8 group hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
              style={{ '--float-delay': '0.4s' } as CSSProperties}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-orange-500/40 bg-orange-500/20 text-orange-600 mb-6 shadow-xl shadow-orange-500/40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 group/icon">
                  <FileText className="h-8 w-8 group-hover/icon:drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] transition-all duration-300" />
                  <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-orange-600/30 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  Resume Builder
                </h3>
                <p className="text-base text-secondary-600">Create your resume</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Profile and Tips Section */}
        <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <ProfileCard userProfile={userProfile} />

          {/* Tips Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="card relative overflow-hidden group/tips hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] border-2 border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-white">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover/tips:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-blue-500/40 bg-blue-500/20 text-blue-600 shadow-lg shadow-blue-500/40 group-hover/tips:scale-110 group-hover/tips:rotate-12 transition-all duration-500">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Student Tips</h3>
                </div>
                <ul className="space-y-3 text-base text-secondary-700">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl font-bold">•</span>
                    <span>Complete skill assessments to earn certificates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl font-bold">•</span>
                    <span>Attend webinars to learn from industry experts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl font-bold">•</span>
                    <span>Build your resume early to stand out</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card relative overflow-hidden group/progress hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] border-2 border-green-200/50 bg-gradient-to-br from-green-50/50 to-white">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover/progress:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-green-500/40 bg-green-500/20 text-green-600 shadow-lg shadow-green-500/40 group-hover/progress:scale-110 group-hover/progress:rotate-12 transition-all duration-500">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Your Progress</h3>
                </div>
                <p className="mb-4 text-base text-secondary-700 font-medium">
                  Keep learning and growing your skills to prepare for your career!
                </p>
                <div className="text-sm text-secondary-600">
                  You're on the right track. Continue attending webinars and taking assessments.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Learning Path */}
          <div className="card relative overflow-hidden group/path hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/path:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center gap-3 mb-8 animate-[floatUp_0.85s_ease-out]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-purple-500/40 bg-purple-500/20 text-purple-600 shadow-lg shadow-purple-500/40">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Your Learning Path
                </h2>
              </div>
              <div className="space-y-5">
                <div
                  className="feature-card relative overflow-hidden flex items-center gap-5 p-6 group/step hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02]"
                  style={{ '--float-delay': '0.1s' } as CSSProperties}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover/step:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border-2 border-purple-500/40 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl shadow-purple-500/40 group-hover/step:scale-110 group-hover/step:rotate-12 transition-all duration-500 flex-shrink-0">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  <div className="flex-1 relative z-10">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Complete Your Profile
                    </h3>
                    <p className="text-base text-secondary-600">
                      Add your skills and experience
                    </p>
                  </div>
                  <Link href="/profile" className="btn-secondary px-6 py-3 text-base font-bold relative z-10 hover:scale-110 transition-transform duration-300">
                    Start
                  </Link>
                </div>

                <div
                  className="feature-card relative overflow-hidden flex items-center gap-5 p-6 group/step hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02]"
                  style={{ '--float-delay': '0.2s' } as CSSProperties}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover/step:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border-2 border-blue-500/40 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/40 group-hover/step:scale-110 group-hover/step:rotate-12 transition-all duration-500 flex-shrink-0">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <div className="flex-1 relative z-10">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Take Skill Assessments
                    </h3>
                    <p className="text-base text-secondary-600">
                      Test your knowledge and earn certificates
                    </p>
                  </div>
                  <Link href="/assessments" className="btn-secondary px-6 py-3 text-base font-bold relative z-10 hover:scale-110 transition-transform duration-300">
                    Start
                  </Link>
                </div>

                <div
                  className="feature-card relative overflow-hidden flex items-center gap-5 p-6 group/step hover:shadow-xl hover:shadow-green-500/30 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02]"
                  style={{ '--float-delay': '0.3s' } as CSSProperties}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover/step:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border-2 border-green-500/40 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl shadow-green-500/40 group-hover/step:scale-110 group-hover/step:rotate-12 transition-all duration-500 flex-shrink-0">
                    <span className="text-lg font-bold">3</span>
                  </div>
                  <div className="flex-1 relative z-10">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Attend Webinars
                    </h3>
                    <p className="text-base text-secondary-600">
                      Learn from industry professionals
                    </p>
                  </div>
                  <Link href="/webinars" className="btn-secondary px-6 py-3 text-base font-bold relative z-10 hover:scale-110 transition-transform duration-300">
                    Browse
                  </Link>
                </div>

                <div
                  className="feature-card relative overflow-hidden flex items-center gap-5 p-6 group/step hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02]"
                  style={{ '--float-delay': '0.4s' } as CSSProperties}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/10 opacity-0 group-hover/step:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border-2 border-orange-500/40 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/40 group-hover/step:scale-110 group-hover/step:rotate-12 transition-all duration-500 flex-shrink-0">
                    <span className="text-lg font-bold">4</span>
                  </div>
                  <div className="flex-1 relative z-10">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Apply for Internships
                    </h3>
                    <p className="text-base text-secondary-600">
                      Gain real-world experience
                    </p>
                  </div>
                  <Link href="/jobs?type=internship" className="btn-secondary px-6 py-3 text-base font-bold relative z-10 hover:scale-110 transition-transform duration-300">
                    Search
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Webinars */}
          <div className="card relative overflow-hidden group/webinars hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/webinars:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex justify-between items-center mb-8 animate-[floatUp_0.85s_ease-out]">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Upcoming Webinars
                </h2>
                <Link href="/webinars" className="auth-link text-base font-bold hover:scale-110 transition-transform duration-300">
                  View All
                </Link>
              </div>

              {upcomingWebinars.length === 0 ? (
                <div className="text-center py-16">
                  <div className="feature-icon mx-auto mb-6 w-20 h-20">
                    <Video className="w-12 h-12 text-primary-500" />
                  </div>
                  <p className="text-lg text-secondary-600 mb-8 font-medium">No upcoming webinars</p>
                  <Link
                    href="/webinars"
                    className="btn-primary inline-flex items-center gap-3 px-8 py-4 text-base font-bold hover:scale-110 transition-transform duration-300"
                  >
                    Browse Webinars
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {upcomingWebinars.map((webinar, index) => (
                    <Link
                      key={webinar._id}
                      href={`/webinars/${webinar._id}`}
                      className="feature-card relative overflow-hidden p-6 group/webinar block hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02]"
                      style={
                        { '--float-delay': `${0.1 + index * 0.08}s` } as CSSProperties
                      }
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover/webinar:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex items-start gap-4 relative z-10">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-purple-500/40 bg-purple-500/20 text-purple-600 shadow-lg shadow-purple-500/40 group-hover/webinar:scale-110 group-hover/webinar:rotate-12 transition-all duration-500 flex-shrink-0">
                          <Video className="h-7 w-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover/webinar:text-primary-600 transition-colors">
                            {webinar.title}
                          </h3>
                          <p className="text-base text-secondary-600 mb-3 font-medium">
                            by {webinar.host.name}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-secondary-500">
                            <Calendar className="h-4 w-4" />
                            {formatDate(webinar.scheduledDate)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
