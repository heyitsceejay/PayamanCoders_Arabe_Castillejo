'use client'

import { useState, useEffect } from 'react'
import { Shield, TrendingUp, AlertCircle, CheckCircle, XCircle, Clock, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface VerificationData {
  status: 'unverified' | 'pending' | 'verified' | 'rejected' | 'suspended'
  trustScore?: number
  verifiedAt?: string
  submittedAt?: string
  rejectionReason?: string
  requirements: {
    businessDocuments: boolean
    companyProfile: boolean
    contactVerification: boolean
    addressVerification: boolean
  }
  missingItems: string[]
  recommendations: string[]
}

export default function EmployerVerificationCard() {
  const { user } = useAuth()
  const [verification, setVerification] = useState<VerificationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchVerification()
  }, [])

  const fetchVerification = async () => {
    try {
      setError('')
      const response = await fetch('/api/employer/verification')
      if (response.ok) {
        const data = await response.json()
        setVerification(data.verification)
      } else {
        // Fallback to user verification data
        if (user?.verification) {
          setVerification({
            status: user.verification.status,
            trustScore: user.verification.trustScore,
            verifiedAt: user.verification.verifiedAt,
            requirements: {
              businessDocuments: false,
              companyProfile: false,
              contactVerification: false,
              addressVerification: false,
            },
            missingItems: [],
            recommendations: [],
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch verification:', error)
      setError('Failed to load verification status')
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          color: 'from-green-500 to-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
          icon: <CheckCircle className="w-6 h-6" />,
          label: 'Verified',
          description: 'Your company is verified and trusted'
        }
      case 'pending':
        return {
          color: 'from-yellow-500 to-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-700',
          icon: <Clock className="w-6 h-6" />,
          label: 'Pending Review',
          description: 'Your verification is being reviewed'
        }
      case 'rejected':
        return {
          color: 'from-red-500 to-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
          icon: <XCircle className="w-6 h-6" />,
          label: 'Rejected',
          description: 'Verification was rejected. Please resubmit.'
        }
      case 'suspended':
        return {
          color: 'from-red-500 to-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
          icon: <XCircle className="w-6 h-6" />,
          label: 'Suspended',
          description: 'Your account has been suspended'
        }
      default:
        return {
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-700',
          icon: <AlertCircle className="w-6 h-6" />,
          label: 'Unverified',
          description: 'Complete verification to build trust'
        }
    }
  }

  if (loading) {
    return (
      <div className="card relative overflow-hidden animate-pulse">
        <div className="p-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card relative overflow-hidden border-2 border-red-200 bg-red-50">
        <div className="p-8">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle className="w-6 h-6" />
            <p className="font-semibold">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const status = verification?.status || user?.verification?.status || 'unverified'
  const trustScore = verification?.trustScore || user?.verification?.trustScore || 0
  const config = getStatusConfig(status)

  return (
    <div className={`card relative overflow-hidden border-2 ${config.borderColor} ${config.bgColor} group hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${config.color} text-white shadow-lg`}>
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Verification Status</h3>
              <p className="text-sm text-secondary-600">{config.description}</p>
            </div>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${config.borderColor} ${config.bgColor}`}>
            {config.icon}
            <span className={`font-bold text-sm ${config.textColor}`}>{config.label}</span>
          </div>
        </div>

        {/* Trust Score */}
        {status === 'verified' && trustScore > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-white/60 border border-primary-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Trust Score</span>
              <span className="text-2xl font-bold text-primary-600">{trustScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500"
                style={{ width: `${trustScore}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Verification Date */}
        {verification?.verifiedAt && (
          <div className="mb-4 text-sm text-gray-600">
            <span className="font-semibold">Verified on:</span>{' '}
            {new Date(verification.verifiedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        )}

        {/* Requirements Checklist */}
        {status !== 'verified' && verification?.requirements && (
          <div className="mb-6">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-left mb-3"
            >
              <span className="text-sm font-bold text-gray-900">Verification Requirements</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {isExpanded && (
              <div className="space-y-2 animate-[floatUp_0.3s_ease-out]">
                {Object.entries(verification.requirements).map(([key, completed]) => (
                  <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-white/60">
                    {completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${completed ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Missing Items */}
        {verification?.missingItems && verification.missingItems.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-yellow-900 mb-2">Action Required</h4>
                <ul className="space-y-1">
                  {verification.missingItems.map((item, index) => (
                    <li key={index} className="text-sm text-yellow-800">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {verification?.recommendations && verification.recommendations.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-blue-900 mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {verification.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-blue-800">• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {status === 'unverified' && (
          <Link
            href="/verification"
            className="btn-primary w-full justify-center text-center"
          >
            Start Verification Process
          </Link>
        )}
        
        {status === 'rejected' && (
          <Link
            href="/verification"
            className="btn-primary w-full justify-center text-center"
          >
            Resubmit Verification
          </Link>
        )}
      </div>
    </div>
  )
}
