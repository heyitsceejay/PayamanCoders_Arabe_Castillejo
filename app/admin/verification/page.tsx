'use client'

import { useState, useEffect } from 'react'
import VerificationBadge from '@/components/verification/VerificationBadge'
import { Shield, CheckCircle, XCircle, AlertTriangle, Eye, FileText, Building, Mail, Globe, Linkedin, TrendingUp, Flag } from 'lucide-react'
import type { CSSProperties } from 'react'

export default function AdminVerificationPage() {
  const [employers, setEmployers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [selectedEmployer, setSelectedEmployer] = useState<any>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [reviewing, setReviewing] = useState(false)

  useEffect(() => {
    fetchEmployers()
  }, [filter])

  useEffect(() => {
    const interval = setInterval(fetchEmployers, 30000)
    return () => clearInterval(interval)
  }, [filter])

  const fetchEmployers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/verification/pending?status=${filter}`)
      if (response.ok) {
        const data = await response.json()
        setEmployers(data.employers)
      }
    } catch (error) {
      console.error('Failed to fetch employers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (employerId: string, action: string) => {
    setReviewing(true)
    try {
      const response = await fetch('/api/admin/verification/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employerId,
          action,
          notes: reviewNotes
        })
      })

      if (response.ok) {
        alert(`Employer ${action}ed successfully`)
        setSelectedEmployer(null)
        setReviewNotes('')
        fetchEmployers()
      } else {
        const data = await response.json()
        alert(data.error || 'Review failed')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setReviewing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-500/20 border-green-500/30'
      case 'pending': return 'text-yellow-600 bg-yellow-500/20 border-yellow-500/30'
      case 'rejected': return 'text-red-600 bg-red-500/20 border-red-500/30'
      case 'suspended': return 'text-orange-600 bg-orange-500/20 border-orange-500/30'
      default: return 'text-gray-600 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-5 h-5" />
      case 'pending': return <AlertTriangle className="w-5 h-5" />
      case 'rejected': return <XCircle className="w-5 h-5" />
      case 'suspended': return <Shield className="w-5 h-5" />
      default: return <Shield className="w-5 h-5" />
    }
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
                <Shield className="h-8 w-8 md:h-10 md:w-10 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 to-purple-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  Employer Verification
                </h1>
                <p className="text-lg md:text-xl text-secondary-600">
                  Review and manage employer verification requests
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {['pending', 'verified', 'rejected', 'suspended', 'unverified'].map((status, index) => {
            const count = employers.filter(e => (e.verification?.status || 'unverified') === status).length
            return (
              <div 
                key={status}
                className="stat-card cursor-pointer"
                style={{ '--float-delay': `${index * 0.1}s` } as CSSProperties}
                onClick={() => setFilter(status)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex p-2 rounded-lg ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">{count}</span>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary-600">
                    {status}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Filter Tabs */}
        <section className="card mb-10">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px gap-2">
              {['pending', 'verified', 'rejected', 'suspended', 'unverified'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${
                    filter === status
                      ? 'border-primary-500 text-primary-600 bg-primary-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </section>

        {/* Employers List */}
        {loading ? (
          <div className="text-center py-16" role="status" aria-live="polite">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-6" aria-hidden="true"></div>
            <p className="text-lg text-secondary-600 font-medium">Loading employers...</p>
          </div>
        ) : employers.length === 0 ? (
          <div className="card relative overflow-hidden group/empty hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500" role="status">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
            <div className="relative py-20 text-center">
              <div className="feature-icon mx-auto mb-6 w-20 h-20" aria-hidden="true">
                <Shield className="w-12 h-12 text-primary-500" />
              </div>
              <p className="text-xl text-gray-500 font-bold">No employers found with status: {filter}</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {employers.map((employer, index) => (
              <div 
                key={employer.id} 
                className="card relative overflow-hidden group/card hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500"
                style={{ '--float-delay': `${index * 0.05}s` } as CSSProperties}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
                <div className="relative p-6">
                  <div className="flex items-start justify-between gap-6 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 flex-shrink-0">
                          <Building className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 group-hover/card:text-primary-600 transition-colors">
                            {employer.name}
                          </h3>
                          <p className="text-base text-secondary-600">{employer.companyName}</p>
                        </div>
                        <VerificationBadge 
                          status={employer.verification?.status || 'unverified'}
                          trustScore={employer.verification?.trustScore}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-secondary-600 mb-4">
                        <Mail className="w-4 h-4" />
                        <span>{employer.email}</span>
                      </div>
                      
                      {employer.verification && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/60 border border-white/40 backdrop-blur">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
                              <TrendingUp className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-secondary-600">Trust Score</p>
                              <p className="text-lg font-bold text-gray-900">{employer.verification.trustScore}/100</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/60 border border-white/40 backdrop-blur">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30">
                              <Flag className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <p className="text-xs text-secondary-600">Reports</p>
                              <p className="text-lg font-bold text-gray-900">{employer.verification.reports || 0}</p>
                            </div>
                          </div>
                          {employer.verification.businessRegistrationNumber && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/60 border border-white/40 backdrop-blur">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30">
                                <FileText className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs text-secondary-600">Business Reg</p>
                                <p className="text-sm font-bold text-gray-900 truncate">{employer.verification.businessRegistrationNumber}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {employer.verification?.flags && employer.verification.flags.length > 0 && (
                        <div className="p-4 bg-yellow-50/80 border-2 border-yellow-200 rounded-xl backdrop-blur">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            <p className="text-sm font-bold text-yellow-900">Flags Detected</p>
                          </div>
                          <ul className="text-sm text-yellow-800 space-y-1 ml-7">
                            {employer.verification.flags.map((flag: any, idx: number) => (
                              <li key={idx}>• {flag.description}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedEmployer(employer)}
                      className="relative flex items-center justify-center gap-2 px-6 py-3 text-base font-bold rounded-xl border-2 border-primary-500/50 bg-white text-primary-600 shadow-xl shadow-primary-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-500 hover:bg-primary-50 overflow-hidden group/btn"
                    >
                      <Eye className="w-5 h-5 relative z-10 group-hover/btn:scale-125 transition-transform duration-300" />
                      <span className="relative z-10">Review</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {selectedEmployer && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Employer</h2>
                    <p className="text-lg text-secondary-600">{selectedEmployer.name} - {selectedEmployer.companyName}</p>
                  </div>
                  <button
                    onClick={() => setSelectedEmployer(null)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary-600" />
                      Verification Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/60 border border-white/40 backdrop-blur">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4 text-primary-600" />
                          <span className="text-sm font-bold text-gray-700">Email</span>
                        </div>
                        <p className="text-sm text-gray-900">{selectedEmployer.verification?.officialEmail || selectedEmployer.email}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/60 border border-white/40 backdrop-blur">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-primary-600" />
                          <span className="text-sm font-bold text-gray-700">Domain</span>
                        </div>
                        <p className="text-sm text-gray-900">{selectedEmployer.verification?.emailDomain || 'N/A'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/60 border border-white/40 backdrop-blur">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-primary-600" />
                          <span className="text-sm font-bold text-gray-700">Business Reg</span>
                        </div>
                        <p className="text-sm text-gray-900">{selectedEmployer.verification?.businessRegistrationNumber || 'N/A'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/60 border border-white/40 backdrop-blur">
                        <div className="flex items-center gap-2 mb-2">
                          <Linkedin className="w-4 h-4 text-primary-600" />
                          <span className="text-sm font-bold text-gray-700">LinkedIn</span>
                        </div>
                        <p className="text-sm text-gray-900 truncate">{selectedEmployer.verification?.linkedInProfile || 'N/A'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/60 border border-white/40 backdrop-blur">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-primary-600" />
                          <span className="text-sm font-bold text-gray-700">Trust Score</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{selectedEmployer.verification?.trustScore || 0}/100</p>
                      </div>
                    </div>
                  </div>

                  {selectedEmployer.verification?.verificationChecks && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary-600" />
                        Automated Checks
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CheckStatus label="Email Domain" passed={selectedEmployer.verification.verificationChecks.emailDomainVerified} />
                        <CheckStatus label="Business Registry" passed={selectedEmployer.verification.verificationChecks.businessRegistryChecked} />
                        <CheckStatus label="LinkedIn" passed={selectedEmployer.verification.verificationChecks.linkedInVerified} />
                        <CheckStatus label="Website" passed={selectedEmployer.verification.verificationChecks.websiteVerified} />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-base font-bold text-gray-700 mb-3">
                      Review Notes
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={4}
                      className="w-full px-5 py-3 text-base font-medium rounded-xl border-2 border-primary-500/30 bg-white/70 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 shadow-lg backdrop-blur-xl hover:border-primary-400 hover:bg-white/90 transition-all"
                      placeholder="Add notes about this review..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleReview(selectedEmployer.id, 'approve')}
                    disabled={reviewing}
                    className="relative flex items-center justify-center gap-2 px-6 py-4 text-base font-bold rounded-xl border-2 border-green-500/50 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl shadow-green-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group/btn"
                  >
                    <CheckCircle className="w-5 h-5 relative z-10 group-hover/btn:scale-125 transition-transform duration-300" />
                    <span className="relative z-10">Approve</span>
                  </button>
                  <button
                    onClick={() => handleReview(selectedEmployer.id, 'reject')}
                    disabled={reviewing}
                    className="relative flex items-center justify-center gap-2 px-6 py-4 text-base font-bold rounded-xl border-2 border-red-500/50 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl shadow-red-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group/btn"
                  >
                    <XCircle className="w-5 h-5 relative z-10 group-hover/btn:scale-125 transition-transform duration-300" />
                    <span className="relative z-10">Reject</span>
                  </button>
                  <button
                    onClick={() => handleReview(selectedEmployer.id, 'suspend')}
                    disabled={reviewing}
                    className="relative flex items-center justify-center gap-2 px-6 py-4 text-base font-bold rounded-xl border-2 border-orange-500/50 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group/btn"
                  >
                    <AlertTriangle className="w-5 h-5 relative z-10 group-hover/btn:scale-125 transition-transform duration-300" />
                    <span className="relative z-10">Suspend</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function CheckStatus({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 border border-white/40 backdrop-blur">
      <span className="text-sm font-bold text-gray-700">{label}</span>
      <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
        passed 
          ? 'bg-green-500/20 border-2 border-green-500/40 text-green-600' 
          : 'bg-gray-500/20 border-2 border-gray-500/40 text-gray-400'
      }`}>
        {passed ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
      </span>
    </div>
  )
}
