'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, Shield, Mail, Building2, Linkedin, Globe } from 'lucide-react'
import VerificationBadge from '@/components/verification/VerificationBadge'
import VerificationForm from '@/components/verification/VerificationForm'

export default function VerificationPage() {
  const router = useRouter()
  const [verificationData, setVerificationData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchVerificationStatus()
  }, [])

  const fetchVerificationStatus = async () => {
    try {
      const response = await fetch('/api/verification/status')
      if (response.ok) {
        const data = await response.json()
        setVerificationData(data)
      }
    } catch (error) {
      console.error('Failed to fetch verification status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData: any) => {
    setSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/verification/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: data.message || 'Verification submitted successfully' 
        })
        await fetchVerificationStatus()
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Verification submission failed' 
        })
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'An error occurred. Please try again.' 
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="hero-gradient relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="auth-background-grid" aria-hidden="true" />
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
            Loading Verification Status...
          </h2>
          <p className="auth-subtitle text-sm sm:text-base">Please wait while we fetch your data</p>
        </div>
      </div>
    )
  }

  const verification = verificationData?.verification
  const status = verification?.status || 'unverified'

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl animate-pulse"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-[-10%] bottom-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-purple-400/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <div className="relative overflow-hidden group/header mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover/header:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative flex items-center gap-4">
                <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-500 text-white shadow-xl shadow-blue-500/40 group/icon flex-shrink-0">
                  <Shield className="h-8 w-8 md:h-10 md:w-10 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 to-purple-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-2xl blur-xl opacity-0 group-hover/icon:opacity-100 animate-pulse transition-opacity duration-300"></div>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                    Employer Verification
                  </h1>
                  <p className="text-lg md:text-xl text-secondary-600">
                    Verify your company to build trust with job seekers and unlock full platform features
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Status Card */}
          <div className="card relative overflow-hidden group/status hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover/status:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Verification Status</h2>
                <VerificationBadge 
                  status={status} 
                  trustScore={verification?.trustScore}
                  showScore={status === 'verified'}
                />
              </div>

              {status === 'verified' && (
                <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/40 rounded-2xl p-6 backdrop-blur-xl">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/40 flex-shrink-0">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-green-800 mb-2">
                        Your company is verified! Job seekers can see your verified badge on all job postings.
                      </p>
                      {verification?.verifiedAt && (
                        <p className="text-base text-green-700 font-medium">
                          Verified on {new Date(verification.verifiedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {status === 'pending' && (
                <div className="relative bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/40 rounded-2xl p-6 backdrop-blur-xl">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/40 flex-shrink-0">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-yellow-800 mb-2">
                        Your verification is under review. We'll notify you once the review is complete.
                      </p>
                      <p className="text-base text-yellow-700 font-medium">
                        This usually takes 24-48 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {status === 'rejected' && (
                <div className="relative bg-gradient-to-br from-red-500/20 to-pink-500/20 border-2 border-red-500/40 rounded-2xl p-6 backdrop-blur-xl">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/40 flex-shrink-0">
                      <XCircle className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-red-800 mb-2">
                        Verification was not approved
                      </p>
                      {verification?.rejectionReason && (
                        <p className="text-base text-red-700 font-medium mb-2">
                          Reason: {verification.rejectionReason}
                        </p>
                      )}
                      <p className="text-base text-red-700 font-medium">
                        Please update your information and resubmit.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {status === 'suspended' && (
                <div className="relative bg-gradient-to-br from-red-500/20 to-pink-500/20 border-2 border-red-500/40 rounded-2xl p-6 backdrop-blur-xl">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/40 flex-shrink-0">
                      <XCircle className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-red-800 mb-2">
                        Your verification has been suspended
                      </p>
                      <p className="text-base text-red-700 font-medium">
                        Please contact support for more information.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Verification Checks */}
          {verification?.verificationChecks && (
            <div className="card relative overflow-hidden group/checks hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/checks:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Verification Checks</h2>
                <div className="space-y-4">
                  <CheckItem 
                    label="Email Domain" 
                    passed={verification.verificationChecks.emailDomainVerified}
                    icon={Mail}
                  />
                  <CheckItem 
                    label="Business Registry" 
                    passed={verification.verificationChecks.businessRegistryChecked}
                    icon={Building2}
                  />
                  <CheckItem 
                    label="LinkedIn Profile" 
                    passed={verification.verificationChecks.linkedInVerified}
                    icon={Linkedin}
                  />
                  <CheckItem 
                    label="Website Verification" 
                    passed={verification.verificationChecks.websiteVerified}
                    icon={Globe}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Verification Form */}
          {(status === 'unverified' || status === 'rejected') && (
            <div className="card relative overflow-hidden group/form hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/form:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  {status === 'rejected' ? 'Resubmit Verification' : 'Submit for Verification'}
                </h2>
                
                {message && (
                  <div className={`mb-6 p-5 rounded-2xl border-2 ${
                    message.type === 'success' 
                      ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/40 text-green-800' 
                      : 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/40 text-red-800'
                  } backdrop-blur-xl`}>
                    <p className="text-base font-bold">{message.text}</p>
                  </div>
                )}

                <VerificationForm 
                  onSubmit={handleSubmit}
                  initialData={verification}
                />
              </div>
            </div>
          )}

          {/* Benefits Section */}
          <div className="card relative overflow-hidden group/benefits hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover/benefits:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                Benefits of Verification
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-lg font-semibold text-blue-800">Verified badge on all your job postings</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-lg font-semibold text-blue-800">Higher trust score increases application rates</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-lg font-semibold text-blue-800">Priority placement in job search results</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-lg font-semibold text-blue-800">Access to premium features and analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckItem({ label, passed, icon: Icon }: { label: string; passed: boolean; icon: any }) {
  return (
    <div className="flex items-center justify-between py-4 px-4 rounded-xl border-2 border-white/40 bg-white/40 backdrop-blur hover:bg-white/60 transition-all duration-300 group/item">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all duration-300 ${
          passed 
            ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/40' 
            : 'bg-gradient-to-br from-gray-500/20 to-gray-600/20 border-gray-500/40'
        }`}>
          <Icon className={`h-6 w-6 ${passed ? 'text-green-600' : 'text-gray-400'}`} />
        </div>
        <span className="text-lg font-bold text-gray-900">{label}</span>
      </div>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${
        passed 
          ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-500/40 text-green-700' 
          : 'bg-gradient-to-br from-gray-500/20 to-gray-600/20 border-2 border-gray-500/40 text-gray-500'
      }`}>
        {passed ? (
          <>
            <CheckCircle className="h-5 w-5" />
            <span>Verified</span>
          </>
        ) : (
          <>
            <span className="text-2xl">○</span>
            <span>Not verified</span>
          </>
        )}
      </div>
    </div>
  )
}
