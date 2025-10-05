'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Users,
  BarChart2,
  Search,
  PlusCircle,
  FileText,
  LifeBuoy,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Job {
  _id: string
  title: string
  company: string
  location?: string
  type?: string
  remote?: boolean
  status?: string
  createdAt?: string
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
  const [error, setError] = useState<string | null>(null)

  // Search & filters
  const [query, setQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>(
    'all'
  )

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

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
        // normalize applicants list (keep most recent 6)
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
      setError('Failed to load employer data.')
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Employer Portal{user ? ` — ${user.firstName}` : ''}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your company, job listings, applicants, and hiring analytics
            from one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/jobs/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700"
          >
            <PlusCircle className="w-4 h-4" />
            Post a job
          </Link>

          <Link
            href="/profile/company"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Users className="w-4 h-4 text-gray-700" />
            Company Settings
          </Link>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Active Jobs</div>
            <div className="text-xl font-semibold text-gray-900">{stats.jobs}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Total Applicants</div>
            <div className="text-xl font-semibold text-gray-900">{stats.applicants}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-50 rounded">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Interviews</div>
            <div className="text-xl font-semibold text-gray-900">{stats.interviews}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded">
            <BarChart2 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Offers</div>
            <div className="text-xl font-semibold text-gray-900">{stats.offers}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Company overview & help */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Company Overview</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {user?.role === 'employer'
                    ? 'Share your company mission, values, and what makes you a great place to work. Update your company profile to attract the right candidates.'
                    : 'Complete your company profile to enable fuller features.'}
                </p>
              </div>
              <div className="text-sm text-gray-500">Verified</div>
            </div>

            <div className="mt-4">
              <Link
                href="/profile/company"
                className="text-sm text-blue-600 hover:underline"
              >
                Edit company profile
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Team & Collaboration</h3>
            <p className="text-sm text-gray-600 mb-4">
              Invite teammates, assign roles (recruiter, hiring manager), and collaborate on candidates.
            </p>
            <div className="flex gap-2">
              <Link
                href="/team"
                className="px-3 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200"
              >
                Manage team
              </Link>
              <Link
                href="/team/roles"
                className="px-3 py-2 border border-gray-200 rounded text-sm hover:bg-gray-50"
              >
                Assign roles
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Help & Support</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>
                <Link href="/help/faqs" className="text-blue-600 hover:underline">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/help/contact" className="text-blue-600 hover:underline">
                  Contact support
                </Link>
              </li>
              <li>
                <Link href="/help/guides" className="text-blue-600 hover:underline">
                  Hiring guides
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Center: Jobs list with search & filters */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex items-center w-full sm:max-w-md">
                <span className="absolute left-3 text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Search jobs or companies..."
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as 'all' | 'active' | 'closed')
                  }
                  className="py-2 px-3 border rounded-md"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>

                <Link
                  href="/jobs/new"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md"
                >
                  <PlusCircle className="w-4 h-4" />
                  New job
                </Link>
              </div>
            </div>

            <div className="mt-4 border-t pt-4 space-y-3">
              {loading ? (
                <div className="text-sm text-gray-500">Loading jobs…</div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-sm text-gray-500">No jobs found.</div>
              ) : (
                filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    className="flex items-center justify-between p-3 rounded hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">
                        {job.company} • {job.location || 'Remote'} • {job.type || '—'}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          job.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {job.status || 'active'}
                      </span>

                      <Link
                        href={`/jobs/${job._id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Applicant management */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Applicants</h3>
              </div>
              <Link href="/applications" className="text-sm text-blue-600 hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {applicants.length === 0 ? (
                <div className="text-sm text-gray-500">No recent applicants</div>
              ) : (
                applicants.map((a) => (
                  <div
                    key={a._id}
                    className="flex items-center justify-between p-3 rounded hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {a.firstName} {a.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Applied to {a.role || '—'} • {new Date(a.appliedAt || Date.now()).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/applications/${a._id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Review
                      </Link>
                      <button
                        onClick={() => {
                          // quick shortlist (optimistic UI)
                          // in a real implementation call API here
                          alert(`Shortlisted ${a.firstName} ${a.lastName}`)
                        }}
                        className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded"
                      >
                        Shortlist
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Analytics preview */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">Hiring Analytics</h3>
              </div>
              <Link href="/analytics" className="text-sm text-blue-600 hover:underline">
                See full report
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 border rounded"> 
                <div className="text-xs text-gray-500">Applications / Week</div>
                <div className="text-lg font-semibold text-gray-900">34</div>
                <div className="text-xs text-green-600 mt-1">+8% vs last week</div>
              </div>
              <div className="p-3 border rounded">
                <div className="text-xs text-gray-500">Avg Time to Hire</div>
                <div className="text-lg font-semibold text-gray-900">21 days</div>
                <div className="text-xs text-red-600 mt-1">+2 days vs target</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}