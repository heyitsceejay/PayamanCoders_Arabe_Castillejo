'use client'

import React, { useEffect, useState, CSSProperties } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Users,
  BarChart2,
  Search,
  PlusCircle,
  FileText,
  LifeBuoy,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import TabNavigation from '@/components/TabNavigation'
import EmployerVerificationCard from '@/components/EmployerVerificationCard'

interface Job {
  _id: string
  title: string
  company: string
  location?: string
  type?: string
  remote?: boolean
  status?: string
  createdAt?: string
  applicantCount?: number
}

interface Applicant {
  _id: string
  firstName: string
  lastName: string
  role?: string
  appliedAt?: string
  status?: string
}

export default function EmployerHomepage() {
  const { user } = useAuth()

  const [jobs, setJobs] = useState<Job[]>([])
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [stats, setStats] = useState({
    jobs: 0,
    applicants: 0,
    interviews: 0,
    offers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [isEntering, setIsEntering] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900)
    return () => clearTimeout(timeout)
  }, [])

  // Search & filters
  const [query, setQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>(
    'all'
  )
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    fetchData()
  }, [])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [query, filterStatus])

  const fetchData = async () => {
    try {
      setLoading(true)

      const [jobsRes, appsRes, statsRes] = await Promise.all([
        fetch('/api/jobs?employer=true', { credentials: 'include' }),
        fetch('/api/dashboard/applications', { credentials: 'include' }),
        fetch('/api/dashboard/stats', { credentials: 'include' }),
      ])

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json()
        setJobs(jobsData.jobs || jobsData || [])
      }

      if (appsRes.ok) {
        const appsData = await appsRes.json()
        const flatApps = (appsData.applications || [])
          .slice(0, 6)
          .map((a: any) => ({
            _id: a._id || a.id,
            firstName: a.applicant?.firstName || a.applicantName || 'Applicant',
            lastName: a.applicant?.lastName || '',
            role: a.jobTitle || '',
            appliedAt: a.createdAt || a.appliedDate,
            status: a.status || 'pending',
          }))
        setApplicants(flatApps)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats({
          jobs: statsData.jobs || (jobsRes.ok ? (await jobsRes.json()).length : 0),
          applicants: statsData.applications || 0,
          interviews: statsData.interviews || 0,
          offers: statsData.offers || 0,
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs = jobs.filter((j) => {
    const matchesQuery =
      query.trim() === '' ||
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      (j.company || '').toLowerCase().includes(query.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' || (j.status || 'active') === filterStatus
    return matchesQuery && matchesStatus
  })

  if (loading) {
    return (
      <div className="hero-gradient relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="auth-background-grid" aria-hidden="true" />
        {isEntering && <div className="auth-entry-overlay" />}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-48 w-48 sm:h-64 sm:w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/20 blur-3xl animate-pulse"></div>
          <div
            className="absolute right-1/4 top-1/3 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-secondary-500/15 blur-3xl animate-pulse"
            style={{ animationDelay: '0.5s' }}
          ></div>
        </div>
        <div className="text-center relative z-10 animate-[floatUp_0.85s_ease-out]">
          <div className="futuristic-loader mx-auto mb-6">
            <div className="futuristic-loader-inner"></div>
          </div>
          <h2 className="auth-title text-xl sm:text-2xl font-bold mb-3">
            Loading Dashboard...
          </h2>
          <p className="auth-subtitle text-sm sm:text-base">Please wait while we fetch your data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-48 w-48 sm:h-64 sm:w-64 -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl"></div>
        <div className="absolute right-[-10%] top-20 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-secondary-500/15 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className={`mb-6 sm:mb-8 ${isEntering ? 'auth-panel-enter' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex-shrink-0">
              <Briefcase className="h-5 w-5 sm:h-7 sm:w-7" />
            </div>
            <h1 className="auth-title text-2xl sm:text-3xl font-bold animate-[floatUp_0.85s_ease-out] break-words">
              Welcome, {user?.firstName || (user as any)?.company || 'Employer'}! 💼
            </h1>
          </div>
          <p className="auth-subtitle text-sm sm:text-base">
            Manage your company, job listings, applicants, and hiring analytics from one place
          </p>
        </div>

        {/* Verification Card */}
        <div className="mb-6 sm:mb-8 animate-[floatUp_0.85s_ease-out_0.1s_both]">
          <EmployerVerificationCard />
        </div>

        {/* Stats Grid - Fully Responsive */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div
            className="stat-card"
            style={{ '--float-delay': '0.1s' } as CSSProperties}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                    <Briefcase className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                </div>
                <div className="ml-4 sm:ml-5 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1 break-words">
                    Active Jobs
                  </p>
                  <p className="stat-number text-2xl sm:text-3xl">{stats.jobs}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="stat-card"
            style={{ '--float-delay': '0.2s' } as CSSProperties}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-blue-500/35 bg-blue-500/15 text-blue-500 shadow-inner shadow-blue-700/25">
                    <FileText className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                </div>
                <div className="ml-4 sm:ml-5 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1 break-words">
                    Total Applicants
                  </p>
                  <p className="stat-number text-2xl sm:text-3xl">{stats.applicants}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="stat-card"
            style={{ '--float-delay': '0.3s' } as CSSProperties}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-green-500/35 bg-green-500/15 text-green-500 shadow-inner shadow-green-700/25">
                    <Clock className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                </div>
                <div className="ml-4 sm:ml-5 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1 break-words">
                    Interviews
                  </p>
                  <p className="stat-number text-2xl sm:text-3xl">{stats.interviews}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="stat-card"
            style={{ '--float-delay': '0.4s' } as CSSProperties}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-orange-500/35 bg-orange-500/15 text-orange-500 shadow-inner shadow-orange-700/25">
                    <BarChart2 className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                </div>
                <div className="ml-4 sm:ml-5 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1 break-words">
                    Offers
                  </p>
                  <p className="stat-number text-2xl sm:text-3xl">{stats.offers}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation
          tabs={[
            { id: 'overview', label: 'Overview', icon: <Briefcase className="w-4 h-4" /> },
            { id: 'jobs', label: 'My Jobs', icon: <FileText className="w-4 h-4" /> },
            { id: 'applicants', label: 'Applicants', icon: <Users className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
          ]}
          defaultTab="overview"
        >
          {(activeTab) => (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Quick Actions - Fully Responsive */}
                  <div>
                    <h2 className="feature-heading text-lg sm:text-xl font-semibold mb-4 sm:mb-6 animate-[floatUp_0.85s_ease-out]">
                      Quick Actions
                    </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Link
              href="/jobs/new"
              className="feature-card p-4 sm:p-6 group"
              style={{ '--float-delay': '0.1s' } as CSSProperties}
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2 group-hover:text-primary-600 transition-colors">
                Post New Job
              </h3>
              <p className="text-xs sm:text-sm text-secondary-600">Create a job listing</p>
            </Link>

            <Link
              href="/profile/company"
              className="feature-card p-4 sm:p-6 group"
              style={{ '--float-delay': '0.2s' } as CSSProperties}
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2 group-hover:text-primary-600 transition-colors">
                Company Profile
              </h3>
              <p className="text-xs sm:text-sm text-secondary-600">Update your profile</p>
            </Link>

            <Link
              href="/applications"
              className="feature-card p-4 sm:p-6 group"
              style={{ '--float-delay': '0.3s' } as CSSProperties}
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2 group-hover:text-primary-600 transition-colors">
                View Applications
              </h3>
              <p className="text-xs sm:text-sm text-secondary-600">Review candidates</p>
            </Link>

            <Link
              href="/analytics"
              className="feature-card p-4 sm:p-6 group"
              style={{ '--float-delay': '0.4s' } as CSSProperties}
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <BarChart2 className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2 group-hover:text-primary-600 transition-colors">
                Analytics
              </h3>
              <p className="text-xs sm:text-sm text-secondary-600">View hiring metrics</p>
            </Link>
          </div>
                  </div>

                  {/* Main Content Grid - Responsive Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column: Company overview & help */}
          <div className="space-y-4 sm:space-y-6">
            {/* Company Overview Card */}
            <div className="card relative overflow-hidden group p-6 sm:p-8 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500" style={{ '--float-delay': '0.6s' } as CSSProperties}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 border border-primary-500/0 group-hover:border-primary-500/30 transition-all duration-500 rounded-2xl"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
              <div className="relative">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="feature-icon group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/40 transition-all duration-500">
                      <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="feature-heading text-lg sm:text-2xl font-bold group-hover:text-primary-600 transition-colors duration-300">Company Overview</h3>
                  </div>
                  {user?.verification?.status === 'verified' ? (
                    <div className="rounded-full border border-green-500/60 bg-green-500/25 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold uppercase tracking-wider text-green-600 shadow-lg shadow-green-500/40 animate-pulse group-hover:shadow-xl group-hover:shadow-green-500/50 transition-all duration-300 flex-shrink-0">
                      <span className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        Verified
                      </span>
                    </div>
                  ) : user?.verification?.status === 'pending' ? (
                    <div className="rounded-full border border-yellow-500/60 bg-yellow-500/25 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold uppercase tracking-wider text-yellow-600 shadow-lg shadow-yellow-500/40 animate-pulse group-hover:shadow-xl group-hover:shadow-yellow-500/50 transition-all duration-300 flex-shrink-0">
                      <span className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
                        Pending
                      </span>
                    </div>
                  ) : user?.verification?.status === 'rejected' || user?.verification?.status === 'suspended' ? (
                    <div className="rounded-full border border-red-500/60 bg-red-500/25 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold uppercase tracking-wider text-red-600 shadow-lg shadow-red-500/40 group-hover:shadow-xl group-hover:shadow-red-500/50 transition-all duration-300 flex-shrink-0">
                      <span className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        {user?.verification?.status === 'suspended' ? 'Suspended' : 'Rejected'}
                      </span>
                    </div>
                  ) : (
                    <div className="rounded-full border border-gray-500/60 bg-gray-500/25 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold uppercase tracking-wider text-gray-600 shadow-lg shadow-gray-500/40 group-hover:shadow-xl group-hover:shadow-gray-500/50 transition-all duration-300 flex-shrink-0">
                      <span className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                        Unverified
                      </span>
                    </div>
                  )}
                </div>
                <p className="auth-subtitle text-sm sm:text-base text-secondary-600/90 mb-5 sm:mb-7 leading-relaxed">
                  {user?.role === 'employer'
                    ? 'Share your company mission, values, and what makes you a great place to work. Update your company profile to attract the right candidates.'
                    : 'Complete your company profile to enable fuller features.'}
                </p>
                <Link
                  href="/profile/company"
                  className="auth-link text-sm sm:text-base font-semibold inline-flex items-center gap-2 group/link"
                >
                  <span>Edit company profile</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 group-hover/link:opacity-100 animate-pulse transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>

            {/* Team & Collaboration Card */}
            <div className="card relative overflow-hidden group p-6 sm:p-8 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500" style={{ '--float-delay': '0.7s' } as CSSProperties}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 border border-primary-500/0 group-hover:border-primary-500/30 transition-all duration-500 rounded-2xl"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
              <div className="relative">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="feature-icon group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/40 transition-all duration-500">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="feature-heading text-lg sm:text-2xl font-bold group-hover:text-primary-600 transition-colors duration-300">Team & Collaboration</h3>
                </div>
                <p className="auth-subtitle text-sm sm:text-base text-secondary-600/90 mb-4 sm:mb-6 leading-relaxed">
                  Invite teammates, assign roles (recruiter, hiring manager), and collaborate on candidates.
                </p>
                <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4">
                  <Link
                    href="/team"
                    className="btn-secondary px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold group/btn hover:shadow-xl hover:shadow-primary-500/30 flex-1 xs:flex-initial"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 group-hover/btn:scale-110 transition-transform duration-300" />
                      Manage team
                    </span>
                  </Link>
                  <Link
                    href="/team/roles"
                    className="btn-ghost px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold group/btn flex-1 xs:flex-initial"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 group-hover/btn:scale-110 transition-transform duration-300" />
                      Assign roles
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Help & Support Card */}
            <div className="card relative overflow-hidden group p-6 sm:p-8 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500" style={{ '--float-delay': '0.8s' } as CSSProperties}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 border border-primary-500/0 group-hover:border-primary-500/30 transition-all duration-500 rounded-2xl"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
              <div className="relative">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div className="feature-icon group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/40 transition-all duration-500">
                    <LifeBuoy className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="feature-heading text-lg sm:text-2xl font-bold group-hover:text-primary-600 transition-colors duration-300">Help & Support</h3>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  <li>
                    <Link href="/help/faqs" className="auth-link text-sm sm:text-base font-semibold inline-flex items-center gap-2 sm:gap-3 group/link hover:translate-x-1 transition-transform duration-300">
                      <div className="h-2 w-2 rounded-full bg-primary-500 opacity-50 group-hover/link:opacity-100 group-hover/link:scale-150 group-hover/link:shadow-lg group-hover/link:shadow-primary-500/50 transition-all duration-300 flex-shrink-0"></div>
                      <span>FAQs</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/help/contact" className="auth-link text-sm sm:text-base font-semibold inline-flex items-center gap-2 sm:gap-3 group/link hover:translate-x-1 transition-transform duration-300">
                      <div className="h-2 w-2 rounded-full bg-primary-500 opacity-50 group-hover/link:opacity-100 group-hover/link:scale-150 group-hover/link:shadow-lg group-hover/link:shadow-primary-500/50 transition-all duration-300 flex-shrink-0"></div>
                      <span>Contact support</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/help/guides" className="auth-link text-sm sm:text-base font-semibold inline-flex items-center gap-2 sm:gap-3 group/link hover:translate-x-1 transition-transform duration-300">
                      <div className="h-2 w-2 rounded-full bg-primary-500 opacity-50 group-hover/link:opacity-100 group-hover/link:scale-150 group-hover/link:shadow-lg group-hover/link:shadow-primary-500/50 transition-all duration-300 flex-shrink-0"></div>
                      <span>Hiring guides</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Jobs list & Applicants */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Jobs List Card */}
            <div className="card p-6 sm:p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500" style={{ '--float-delay': '0.6s' } as CSSProperties}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                {/* Search and Filter Section - Fully Responsive */}
                <div className="flex flex-col gap-4 sm:gap-5 mb-5 sm:mb-6">
                  <div className="relative flex w-full items-center group/search">
                    <span className="pointer-events-none absolute left-4 sm:left-5 text-primary-500 group-hover/search:text-primary-600 transition-colors duration-300 z-10">
                      <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                    </span>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="glass-input w-full pl-12 sm:pl-14 pr-4 sm:pr-5 py-3 sm:py-4 text-sm sm:text-base font-medium transition-all duration-300 group-hover/search:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                      placeholder="Search jobs or companies..."
                    />
                  </div>

                  <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4">
                    <select
                      value={filterStatus}
                      onChange={(e) =>
                        setFilterStatus(e.target.value as 'all' | 'active' | 'closed')
                      }
                      className="glass-input px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base font-medium appearance-none bg-white/70 cursor-pointer transition-all duration-300 hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20 flex-1 xs:flex-initial"
                    >
                      <option value="all">All statuses</option>
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                    </select>

                    <Link
                      href="/jobs/new"
                      className="btn-primary px-4 sm:px-5 py-3 text-sm font-semibold group/btn hover:shadow-xl hover:shadow-primary-500/40 flex items-center justify-center gap-2"
                    >
                      <PlusCircle className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
                      <span>New job</span>
                    </Link>
                  </div>
                </div>

                {/* Jobs List */}
                <div className="space-y-3 sm:space-y-4 border-t border-white/30 pt-5 sm:pt-6">
                  {loading ? (
                    <div className="text-sm sm:text-base text-secondary-500 text-center py-6 sm:py-8">Loading jobs…</div>
                  ) : filteredJobs.length === 0 ? (
                    <div className="text-sm sm:text-base text-secondary-500 text-center py-6 sm:py-8">No jobs found.</div>
                  ) : (
                    filteredJobs.map((job, index) => (
                      <div
                        key={job._id}
                        className="feature-card flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4 group/job hover:scale-[1.01] hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-500"
                        style={{ '--float-delay': `${0.7 + index * 0.1}s` } as CSSProperties}
                      >
                        <div className="min-w-0 flex-1 w-full sm:w-auto">
                          <div className="font-bold text-base sm:text-xl text-gray-900 mb-2 group-hover/job:text-primary-600 transition-colors duration-300 break-words">{job.title}</div>
                          <div className="text-xs sm:text-base text-secondary-600/90 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                            <span className="flex items-center gap-1.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary-500/60"></div>
                              {job.company}
                            </span>
                            <span>•</span>
                            <span>{job.location || 'Remote'}</span>
                            <span>•</span>
                            <span>{job.type || '—'}</span>
                          </div>
                          {typeof job.applicantCount === 'number' && (
                            <div className="text-xs sm:text-base font-semibold text-primary-600 flex items-center gap-2">
                              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                              {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto">
                          <span
                            className={`rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                              job.status === 'active'
                                ? 'bg-green-500/20 text-green-600 border border-green-500/40 shadow-lg shadow-green-500/20 group-hover/job:shadow-xl group-hover/job:shadow-green-500/30'
                                : 'bg-gray-500/20 text-gray-600 border border-gray-500/40 shadow-lg shadow-gray-500/20 group-hover/job:shadow-xl group-hover/job:shadow-gray-500/30'
                            }`}
                          >
                            {job.status || 'active'}
                          </span>

                          <Link
                            href={`/jobs/${job._id}/applicants`}
                            className="auth-link text-xs sm:text-base font-semibold group/link"
                          >
                            <span className="flex items-center gap-2">
                              View Applicants
                              <div className="h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 group-hover/link:opacity-100 animate-pulse transition-opacity duration-300"></div>
                            </span>
                          </Link>

                          <Link
                            href={`/jobs/${job._id}`}
                            className="text-xs sm:text-base text-secondary-600/90 font-semibold transition-colors hover:text-primary-600 group/edit"
                          >
                            <span className="flex items-center gap-2">
                              Edit
                              <div className="h-1 w-1 rounded-full bg-primary-500 opacity-0 group-hover/edit:opacity-100 transition-opacity duration-300"></div>
                            </span>
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Applicant Management Card */}
            <div className="card p-6 sm:p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500 animate-[floatUp_0.8s_ease-out_0.8s_both]" style={{ '--float-delay': '0.8s' } as CSSProperties}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 border border-primary-500/0 group-hover:border-primary-500/30 transition-all duration-500 rounded-2xl"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
              <div className="relative">
                <div className="mb-5 sm:mb-6 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="feature-icon group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/40 transition-all duration-500 relative">
                      <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" />
                    </div>
                    <h3 className="feature-heading text-lg sm:text-2xl font-bold group-hover:text-primary-600 transition-colors duration-300 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text group-hover:from-primary-600 group-hover:via-primary-500 group-hover:to-primary-600">
                      Recent Applicants
                    </h3>
                  </div>
                  <Link
                    href="/applications"
                    className="auth-link text-sm sm:text-base font-semibold group/link"
                  >
                    <span className="flex items-center gap-2">
                      View all
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 group-hover/link:opacity-100 animate-pulse transition-opacity duration-300"></div>
                    </span>
                  </Link>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {applicants.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-primary-500/40 bg-white/50 p-6 sm:p-8 text-center text-sm sm:text-base text-secondary-500 backdrop-blur relative overflow-hidden group/empty animate-[floatUp_0.6s_ease-out_1s_both]">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 border border-primary-500/20 group-hover/empty:border-primary-500/40 transition-all duration-500 rounded-2xl"></div>
                      <div className="relative flex flex-col items-center gap-3">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-primary-500/30 bg-primary-500/10 flex items-center justify-center relative group-hover/empty:scale-110 transition-transform duration-500">
                          <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-md opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500"></div>
                          <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500/60 relative z-10" />
                        </div>
                        <span className="font-medium">No recent applicants</span>
                      </div>
                    </div>
                  ) : (
                    applicants.map((a, index) => (
                      <div
                        key={a._id}
                        className="feature-card flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4 group/applicant hover:scale-[1.01] hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-500"
                        style={{ '--float-delay': `${0.9 + index * 0.1}s` } as CSSProperties}
                      >
                        <div className="min-w-0 flex-1 w-full sm:w-auto">
                          <div className="font-bold text-base sm:text-lg text-gray-900 mb-2 group-hover/applicant:text-primary-600 transition-colors duration-300 break-words">
                            {a.firstName} {a.lastName}
                          </div>
                          <div className="text-xs sm:text-base text-secondary-600/90 flex items-center gap-2 flex-wrap">
                            <span>Applied to {a.role || '—'}</span>
                            <span>•</span>
                            <span>{new Date(a.appliedAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto">
                          <Link
                            href={`/applications/${a._id}`}
                            className="auth-link text-sm sm:text-base font-semibold group/link"
                          >
                            <span className="flex items-center gap-2">
                              Review
                              <div className="h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 group-hover/link:opacity-100 animate-pulse transition-opacity duration-300"></div>
                            </span>
                          </Link>
                          <button
                            onClick={() => {
                              alert(`Shortlisted ${a.firstName} ${a.lastName}`)
                            }}
                            className="rounded-full bg-green-500/20 border border-green-500/40 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-green-600 shadow-lg shadow-green-500/20 hover:bg-green-500/30 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 transition-all duration-300"
                          >
                            Shortlist
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Analytics Preview Card */}
            <div className="card p-6 sm:p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500 animate-[floatUp_0.8s_ease-out_0.9s_both]" style={{ '--float-delay': '0.9s' } as CSSProperties}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 border border-primary-500/0 group-hover:border-primary-500/30 transition-all duration-500 rounded-2xl"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
              <div className="relative">
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-5 sm:mb-6 gap-3">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="feature-icon group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/40 transition-all duration-500 relative">
                      <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <BarChart2 className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" />
                    </div>
                    <h3 className="feature-heading text-lg sm:text-2xl font-bold group-hover:text-primary-600 transition-colors duration-300 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text group-hover:from-primary-600 group-hover:via-primary-500 group-hover:to-primary-600">
                      Hiring Analytics
                    </h3>
                  </div>
                  <Link
                    href="/analytics"
                    className="auth-link text-sm sm:text-base font-semibold group/link"
                  >
                    <span className="flex items-center gap-2">
                      See full report
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 group-hover/link:opacity-100 animate-pulse transition-opacity duration-300"></div>
                    </span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-5">
                  <div className="feature-card p-4 sm:p-6 group/metric hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-500 relative overflow-hidden animate-[floatUp_0.6s_ease-out_1.1s_both]">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                      <div className="stat-label mb-2 sm:mb-3 text-xs">Applications / Week</div>
                      <div className="stat-number text-3xl sm:text-4xl mb-2">34</div>
                      <div className="text-xs sm:text-sm font-bold text-green-600 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                        +8% vs last week
                      </div>
                    </div>
                  </div>
                  <div className="feature-card p-4 sm:p-6 group/metric hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-500 relative overflow-hidden animate-[floatUp_0.6s_ease-out_1.2s_both]">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-red-500/5 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                      <div className="stat-label mb-2 sm:mb-3 text-xs">Avg Time to Hire</div>
                      <div className="stat-number text-3xl sm:text-4xl mb-2">21 days</div>
                      <div className="text-xs sm:text-sm font-bold text-red-500 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                        +2 days vs target
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
                  </div>
                </div>
              )}

              {activeTab === 'jobs' && (
                <div className="card p-6 sm:p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500" style={{ '--float-delay': '0.6s' } as CSSProperties}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    {/* Search and Filter Section - Fully Responsive */}
                    <div className="flex flex-col gap-4 sm:gap-5 mb-5 sm:mb-6">
                      <div className="relative flex w-full items-center group/search">
                        <span className="pointer-events-none absolute left-4 sm:left-5 text-primary-500 group-hover/search:text-primary-600 transition-colors duration-300 z-10">
                          <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                        </span>
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          className="glass-input w-full pl-12 sm:pl-14 pr-4 sm:pr-5 py-3 sm:py-4 text-sm sm:text-base font-medium transition-all duration-300 group-hover/search:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                          placeholder="Search jobs or companies..."
                        />
                      </div>

                      <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4">
                        <select
                          value={filterStatus}
                          onChange={(e) =>
                            setFilterStatus(e.target.value as 'all' | 'active' | 'closed')
                          }
                          className="glass-input px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base font-medium appearance-none bg-white/70 cursor-pointer transition-all duration-300 hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20 flex-1 xs:flex-initial"
                        >
                          <option value="all">All statuses</option>
                          <option value="active">Active</option>
                          <option value="closed">Closed</option>
                        </select>

                        <Link
                          href="/jobs/new"
                          className="btn-primary px-4 sm:px-5 py-3 text-sm font-semibold group/btn hover:shadow-xl hover:shadow-primary-500/40 flex items-center justify-center gap-2"
                        >
                          <PlusCircle className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
                          <span>New job</span>
                        </Link>
                      </div>
                    </div>

                    {/* Jobs List */}
                    <div className="space-y-3 sm:space-y-4 border-t border-white/30 pt-5 sm:pt-6">
                      {loading ? (
                        <div className="text-sm sm:text-base text-secondary-500 text-center py-6 sm:py-8">Loading jobs…</div>
                      ) : filteredJobs.length === 0 ? (
                        <div className="text-sm sm:text-base text-secondary-500 text-center py-6 sm:py-8">No jobs found.</div>
                      ) : (
                        <>
                          {filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((job, index) => (
                          <div
                            key={job._id}
                            className="feature-card flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4 group/job hover:scale-[1.01] hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-500"
                            style={{ '--float-delay': `${0.7 + index * 0.1}s` } as CSSProperties}
                          >
                            <div className="min-w-0 flex-1 w-full sm:w-auto">
                              <div className="font-bold text-base sm:text-xl text-gray-900 mb-2 group-hover/job:text-primary-600 transition-colors duration-300 break-words">{job.title}</div>
                              <div className="text-xs sm:text-base text-secondary-600/90 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                                <span className="flex items-center gap-1.5">
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500/60"></div>
                                  {job.company}
                                </span>
                                <span>•</span>
                                <span>{job.location || 'Remote'}</span>
                                <span>•</span>
                                <span>{job.type || '—'}</span>
                              </div>
                              {typeof job.applicantCount === 'number' && (
                                <div className="text-xs sm:text-base font-semibold text-primary-600 flex items-center gap-2">
                                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                                  {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto">
                              <span
                                className={`rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                                  job.status === 'active'
                                    ? 'bg-green-500/20 text-green-600 border border-green-500/40 shadow-lg shadow-green-500/20 group-hover/job:shadow-xl group-hover/job:shadow-green-500/30'
                                    : 'bg-gray-500/20 text-gray-600 border border-gray-500/40 shadow-lg shadow-gray-500/20 group-hover/job:shadow-xl group-hover/job:shadow-gray-500/30'
                                }`}
                              >
                                {job.status || 'active'}
                              </span>

                              <Link
                                href={`/jobs/${job._id}/applicants`}
                                className="auth-link text-xs sm:text-base font-semibold group/link"
                              >
                                <span className="flex items-center gap-2">
                                  View Applicants
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 group-hover/link:opacity-100 animate-pulse transition-opacity duration-300"></div>
                                </span>
                              </Link>

                              <Link
                                href={`/jobs/${job._id}`}
                                className="text-xs sm:text-base text-secondary-600/90 font-semibold transition-colors hover:text-primary-600 group/edit"
                              >
                                <span className="flex items-center gap-2">
                                  Edit
                                  <div className="h-1 w-1 rounded-full bg-primary-500 opacity-0 group-hover/edit:opacity-100 transition-opacity duration-300"></div>
                                </span>
                              </Link>
                            </div>
                          </div>
                          ))}
                          
                          {/* Pagination Controls */}
                          {filteredJobs.length > itemsPerPage && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/30 mt-6">
                              <div className="text-sm text-secondary-600">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                  disabled={currentPage === 1}
                                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                                    currentPage === 1
                                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                      : 'bg-white/60 text-primary-600 hover:bg-primary-500 hover:text-white border border-primary-500/40'
                                  }`}
                                >
                                  Previous
                                </button>
                                
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: Math.ceil(filteredJobs.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                                    <button
                                      key={page}
                                      onClick={() => setCurrentPage(page)}
                                      className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-300 ${
                                        currentPage === page
                                          ? 'bg-primary-500 text-white shadow-lg'
                                          : 'bg-white/60 text-gray-700 hover:bg-primary-100 border border-primary-500/20'
                                      }`}
                                    >
                                      {page}
                                    </button>
                                  ))}
                                </div>
                                
                                <button
                                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredJobs.length / itemsPerPage), prev + 1))}
                                  disabled={currentPage === Math.ceil(filteredJobs.length / itemsPerPage)}
                                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                                    currentPage === Math.ceil(filteredJobs.length / itemsPerPage)
                                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                      : 'bg-white/60 text-primary-600 hover:bg-primary-500 hover:text-white border border-primary-500/40'
                                  }`}
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'applicants' && (
                <div className="card p-6 sm:p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="mb-5 sm:mb-6 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
                      <h2 className="feature-heading text-2xl font-bold">Recent Applicants</h2>
                      <Link
                        href="/applications"
                        className="auth-link text-sm sm:text-base font-semibold group/link"
                      >
                        <span className="flex items-center gap-2">
                          View all
                          <div className="h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 group-hover/link:opacity-100 animate-pulse transition-opacity duration-300"></div>
                        </span>
                      </Link>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      {applicants.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-primary-500/40 bg-white/50 p-6 sm:p-8 text-center text-sm sm:text-base text-secondary-500 backdrop-blur">
                          <div className="flex flex-col items-center gap-3">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-primary-500/30 bg-primary-500/10 flex items-center justify-center">
                              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500/60" />
                            </div>
                            <span className="font-medium">No recent applicants</span>
                          </div>
                        </div>
                      ) : (
                        applicants.map((a, index) => (
                          <div
                            key={a._id}
                            className="feature-card flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4 group/applicant hover:scale-[1.01] hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-500"
                            style={{ '--float-delay': `${0.1 + index * 0.1}s` } as CSSProperties}
                          >
                            <div className="min-w-0 flex-1 w-full sm:w-auto">
                              <div className="font-bold text-base sm:text-lg text-gray-900 mb-2 group-hover/applicant:text-primary-600 transition-colors duration-300 break-words">
                                {a.firstName} {a.lastName}
                              </div>
                              <div className="text-xs sm:text-base text-secondary-600/90 flex items-center gap-2 flex-wrap">
                                <span>Applied to {a.role || '—'}</span>
                                <span>•</span>
                                <span>{new Date(a.appliedAt || Date.now()).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto">
                              <Link
                                href={`/applications/${a._id}`}
                                className="auth-link text-sm sm:text-base font-semibold group/link"
                              >
                                <span className="flex items-center gap-2">
                                  Review
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 group-hover/link:opacity-100 animate-pulse transition-opacity duration-300"></div>
                                </span>
                              </Link>
                              <button
                                onClick={() => {
                                  alert(`Shortlisted ${a.firstName} ${a.lastName}`)
                                }}
                                className="rounded-full bg-green-500/20 border border-green-500/40 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-green-600 shadow-lg shadow-green-500/20 hover:bg-green-500/30 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 transition-all duration-300"
                              >
                                Shortlist
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="card p-6 sm:p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-5 sm:mb-6 gap-3">
                      <h2 className="feature-heading text-2xl font-bold">Hiring Analytics</h2>
                      <Link
                        href="/analytics"
                        className="auth-link text-sm sm:text-base font-semibold group/link"
                      >
                        <span className="flex items-center gap-2">
                          See full report
                          <div className="h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 group-hover/link:opacity-100 animate-pulse transition-opacity duration-300"></div>
                        </span>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-5">
                      <div className="feature-card p-4 sm:p-6 group/metric hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                          <div className="stat-label mb-2 sm:mb-3 text-xs">Applications / Week</div>
                          <div className="stat-number text-3xl sm:text-4xl mb-2">34</div>
                          <div className="text-xs sm:text-sm font-bold text-green-600 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                            +8% vs last week
                          </div>
                        </div>
                      </div>
                      <div className="feature-card p-4 sm:p-6 group/metric hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-red-500/5 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                          <div className="stat-label mb-2 sm:mb-3 text-xs">Avg Time to Hire</div>
                          <div className="stat-number text-3xl sm:text-4xl mb-2">21 days</div>
                          <div className="text-xs sm:text-sm font-bold text-red-500 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                            +2 days vs target
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </TabNavigation>
        </div>
      </div>
  )
}
