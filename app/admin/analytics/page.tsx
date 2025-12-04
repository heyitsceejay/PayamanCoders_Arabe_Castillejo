'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { 
  Users, 
  Briefcase, 
  FileText, 
  GraduationCap, 
  TrendingUp, 
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  BarChart3
} from 'lucide-react'

interface AnalyticsData {
  users: {
    total: number
    jobSeekers: number
    employers: number
    mentors: number
    students: number
    newThisMonth: number
  }
  jobs: {
    total: number
    active: number
    filled: number
    applications: number
  }
  assessments: {
    total: number
    attempts: number
    averageScore: number
    passRate: number
  }
  mentorship: {
    totalRequests: number
    accepted: number
    pending: number
    rejected: number
  }
  verification: {
    pending: number
    verified: number
    rejected: number
  }
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics')
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="hero-gradient relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="auth-background-grid" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/20 blur-3xl animate-pulse"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="futuristic-loader mx-auto mb-6">
            <div className="futuristic-loader-inner">
              <BarChart3 className="absolute inset-0 m-auto h-6 w-6 text-primary-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Analytics</h2>
          <p className="text-base text-secondary-600">Gathering platform metrics...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="hero-gradient relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="auth-background-grid" aria-hidden="true" />
        <div className="text-center relative z-10">
          <div className="feature-icon mx-auto mb-6 w-20 h-20">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <p className="text-xl text-gray-600 font-bold">Failed to load analytics data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl animate-pulse"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-[-10%] bottom-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" role="main">
        <header className="mb-10">
          <div className="relative overflow-hidden group/header mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover/header:opacity-100 transition-opacity duration-500 rounded-2xl" aria-hidden="true"></div>
            <div className="relative flex items-center gap-4">
              <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-500 text-white shadow-xl shadow-blue-500/40 group/icon flex-shrink-0" aria-hidden="true">
                <BarChart3 className="h-8 w-8 md:h-10 md:w-10 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 to-purple-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  Platform Analytics
                </h1>
                <p className="text-lg md:text-xl text-secondary-600">
                  Comprehensive overview of platform metrics and performance
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* User Statistics */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Users className="h-6 w-6 text-primary-600" />
            User Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={data.users.total}
              icon={<Users className="h-7 w-7" />}
              color="blue"
              subtitle={`+${data.users.newThisMonth} this month`}
              delay={0.1}
            />
            <StatCard
              title="Job Seekers"
              value={data.users.jobSeekers}
              icon={<Briefcase className="h-7 w-7" />}
              color="green"
              delay={0.15}
            />
            <StatCard
              title="Employers"
              value={data.users.employers}
              icon={<Briefcase className="h-7 w-7" />}
              color="purple"
              delay={0.2}
            />
            <StatCard
              title="Mentors"
              value={data.users.mentors}
              icon={<GraduationCap className="h-7 w-7" />}
              color="orange"
              delay={0.25}
            />
          </div>
        </section>

        {/* Jobs & Applications */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Briefcase className="h-6 w-6 text-primary-600" />
            Jobs & Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Jobs"
              value={data.jobs.total}
              icon={<Briefcase className="h-7 w-7" />}
              color="blue"
              delay={0.3}
            />
            <StatCard
              title="Active Jobs"
              value={data.jobs.active}
              icon={<TrendingUp className="h-7 w-7" />}
              color="green"
              delay={0.35}
            />
            <StatCard
              title="Filled Positions"
              value={data.jobs.filled}
              icon={<CheckCircle className="h-7 w-7" />}
              color="purple"
              delay={0.4}
            />
            <StatCard
              title="Total Applications"
              value={data.jobs.applications}
              icon={<FileText className="h-7 w-7" />}
              color="orange"
              delay={0.45}
            />
          </div>
        </section>

        {/* Assessments */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Award className="h-6 w-6 text-primary-600" />
            Assessments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Assessments"
              value={data.assessments.total}
              icon={<FileText className="h-7 w-7" />}
              color="blue"
              delay={0.5}
            />
            <StatCard
              title="Attempts"
              value={data.assessments.attempts}
              icon={<Activity className="h-7 w-7" />}
              color="green"
              delay={0.55}
            />
            <StatCard
              title="Average Score"
              value={`${data.assessments.averageScore}%`}
              icon={<Award className="h-7 w-7" />}
              color="purple"
              delay={0.6}
            />
            <StatCard
              title="Pass Rate"
              value={`${data.assessments.passRate}%`}
              icon={<CheckCircle className="h-7 w-7" />}
              color="orange"
              delay={0.65}
            />
          </div>
        </section>

        {/* Mentorship */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-primary-600" />
            Mentorship
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Requests"
              value={data.mentorship.totalRequests}
              icon={<GraduationCap className="h-7 w-7" />}
              color="blue"
              delay={0.7}
            />
            <StatCard
              title="Accepted"
              value={data.mentorship.accepted}
              icon={<CheckCircle className="h-7 w-7" />}
              color="green"
              delay={0.75}
            />
            <StatCard
              title="Pending"
              value={data.mentorship.pending}
              icon={<Clock className="h-7 w-7" />}
              color="yellow"
              delay={0.8}
            />
            <StatCard
              title="Rejected"
              value={data.mentorship.rejected}
              icon={<XCircle className="h-7 w-7" />}
              color="red"
              delay={0.85}
            />
          </div>
        </section>

        {/* Verification */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-primary-600" />
            Verification Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Pending Verification"
              value={data.verification.pending}
              icon={<Clock className="h-7 w-7" />}
              color="yellow"
              delay={0.9}
            />
            <StatCard
              title="Verified"
              value={data.verification.verified}
              icon={<CheckCircle className="h-7 w-7" />}
              color="green"
              delay={0.95}
            />
            <StatCard
              title="Rejected"
              value={data.verification.rejected}
              icon={<XCircle className="h-7 w-7" />}
              color="red"
              delay={1.0}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'orange' | 'yellow' | 'red'
  subtitle?: string
  delay?: number
}

function StatCard({ title, value, icon, color, subtitle, delay = 0 }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/35 text-blue-500 shadow-blue-700/25',
    green: 'from-green-500/20 to-green-600/20 border-green-500/35 text-green-500 shadow-green-700/25',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/35 text-purple-500 shadow-purple-700/25',
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/35 text-orange-500 shadow-orange-700/25',
    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/35 text-yellow-500 shadow-yellow-700/25',
    red: 'from-red-500/20 to-red-600/20 border-red-500/35 text-red-500 shadow-red-700/25'
  }

  return (
    <div 
      className="stat-card"
      style={{ '--float-delay': `${delay}s` } as CSSProperties}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border bg-gradient-to-br shadow-inner ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
        <h3 className="text-xs font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-2">{title}</h3>
        <p className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 bg-clip-text">
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-secondary-500 mt-2 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
