'use client'

import { useState, useEffect } from 'react'
import { Award, TrendingUp, AlertCircle, CheckCircle, XCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

interface ScoreData {
  totalScore: number
  breakdown: {
    profileCompleteness: number
    resumeDocuments: number
    skillsAssessments: number
    platformEngagement: number
    accountQuality: number
  }
  tier: 'incomplete' | 'basic' | 'ready' | 'strong' | 'excellent'
  missingItems: string[]
  recommendations: string[]
}

export default function JobSeekerScoreCard() {
  const [score, setScore] = useState<ScoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchScore()
  }, [])

  const fetchScore = async () => {
    try {
      setError('')
      const response = await fetch('/api/job-seeker/score')
      if (response.ok) {
        const data = await response.json()
        setScore(data.score)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to load score')
      }
    } catch (error) {
      console.error('Failed to fetch score:', error)
      setError('Failed to load score')
    } finally {
      setLoading(false)
    }
  }

  const refreshScore = async () => {
    try {
      setRefreshing(true)
      setError('')
      const response = await fetch('/api/job-seeker/score', { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        setScore(data.score)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to refresh score')
      }
    } catch (error) {
      console.error('Failed to refresh score:', error)
      setError('Failed to refresh score')
    } finally {
      setRefreshing(false)
    }
  }

  const getTierConfig = (tier: string) => {
    switch (tier) {
      case 'excellent':
        return {
          color: 'from-purple-500 to-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          textColor: 'text-purple-700',
          icon: <CheckCircle className="w-6 h-6" />,
          label: 'Excellent'
        }
      case 'strong':
        return {
          color: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700',
          icon: <CheckCircle className="w-6 h-6" />,
          label: 'Strong'
        }
      case 'ready':
        return {
          color: 'from-green-500 to-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
          icon: <CheckCircle className="w-6 h-6" />,
          label: 'Ready'
        }
      case 'basic':
        return {
          color: 'from-yellow-500 to-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-700',
          icon: <AlertCircle className="w-6 h-6" />,
          label: 'Basic'
        }
      default:
        return {
          color: 'from-red-500 to-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
          icon: <XCircle className="w-6 h-6" />,
          label: 'Incomplete'
        }
    }
  }

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (error && !score) {
    return (
      <div className="card">
        <div className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={fetchScore}
            className="mt-4 btn-primary px-6 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!score) return null

  const tierConfig = getTierConfig(score.tier)
  const circumference = 2 * Math.PI * 40

  return (
    <div className="card overflow-hidden relative group hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
      
      {/* Header */}
      <div className={`bg-gradient-to-r ${tierConfig.color} p-6 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" aria-hidden="true"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-lg">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Profile Score</h2>
                <p className="text-sm text-white/90">Your job readiness rating</p>
              </div>
            </div>
            <button
              onClick={refreshScore}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Refresh score"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
          
          {/* Score Display */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-6xl font-bold mb-2">{score.totalScore.toFixed(1)}<span className="text-3xl">/100</span></div>
              <div className="flex items-center gap-2">
                {tierConfig.icon}
                <span className="text-xl font-semibold">{tierConfig.label} Profile</span>
              </div>
            </div>
            
            {/* Circular Progress */}
            <div className="relative w-28 h-28">
              <svg className="transform -rotate-90 w-28 h-28">
                <circle
                  cx="56"
                  cy="56"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-white/30"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - score.totalScore / 100)}
                  className="text-white transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUp className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        {/* Application Status Alert */}
        {score.totalScore < 60 ? (
          <div className={`mb-6 p-4 ${tierConfig.bgColor} border ${tierConfig.borderColor} rounded-xl`}>
            <div className="flex items-start gap-3">
              <AlertCircle className={`w-5 h-5 ${tierConfig.textColor} flex-shrink-0 mt-0.5`} />
              <div>
                <h4 className={`font-bold ${tierConfig.textColor} mb-1`}>Profile Incomplete</h4>
                <p className={`text-sm ${tierConfig.textColor}`}>
                  You need a score of at least <strong>60</strong> to apply for jobs. Complete the items below to increase your score.
                </p>
              </div>
            </div>
          </div>
        ) : score.totalScore < 75 ? (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-blue-900 mb-1">Good Start!</h4>
                <p className="text-sm text-blue-700">
                  You can apply for jobs, but improving your score to <strong>75+</strong> will make you more competitive.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-green-900 mb-1">Excellent Profile!</h4>
                <p className="text-sm text-green-700">
                  Your profile is strong and competitive. You're ready to apply for jobs!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {score.recommendations.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              Top Recommendations
            </h3>
            <ul className="space-y-2">
              {score.recommendations.slice(0, 3).map((rec, index) => (
                <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-primary-50/50 to-secondary-50/50 border border-primary-100/50">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500/20 flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary-600">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-700 leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing Items */}
        {score.missingItems.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Missing Items ({score.missingItems.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {score.missingItems.slice(0, 6).map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700 p-2 rounded-lg bg-gray-50">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
                  {item}
                </div>
              ))}
            </div>
            {score.missingItems.length > 6 && (
              <p className="text-xs text-gray-500 mt-2">
                +{score.missingItems.length - 6} more items
              </p>
            )}
          </div>
        )}

        {/* Score Breakdown Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between py-3 px-4 rounded-lg border-2 border-primary-500/30 bg-white hover:bg-primary-50/50 transition-colors group"
          aria-expanded={showDetails}
        >
          <span className="text-sm font-bold text-primary-600 group-hover:text-primary-700">
            {showDetails ? 'Hide' : 'Show'} Detailed Breakdown
          </span>
          {showDetails ? (
            <ChevronUp className="w-5 h-5 text-primary-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-primary-600" />
          )}
        </button>

        {/* Breakdown Details */}
        {showDetails && (
          <div className="mt-4 space-y-4 animate-[floatUp_0.5s_ease-out]">
            {Object.entries(score.breakdown).map(([key, value]) => {
              const maxScores: Record<string, number> = {
                profileCompleteness: 30,
                resumeDocuments: 20,
                skillsAssessments: 25,
                platformEngagement: 15,
                accountQuality: 10
              }
              const max = maxScores[key]
              const percentage = (value / max) * 100

              const categoryLabels: Record<string, string> = {
                profileCompleteness: 'Profile Completeness',
                resumeDocuments: 'Resume & Documents',
                skillsAssessments: 'Skills & Assessments',
                platformEngagement: 'Platform Engagement',
                accountQuality: 'Account Quality'
              }

              return (
                <div key={key} className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900">
                      {categoryLabels[key]}
                    </span>
                    <span className="text-lg font-bold text-primary-600">
                      {value.toFixed(1)}<span className="text-sm text-gray-500">/{max}</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-1000 shadow-inner"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500 text-right">
                    {percentage.toFixed(0)}% complete
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link
            href="/profile"
            className="btn-primary text-center py-3 flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            Complete Profile
          </Link>
          <Link
            href="/assessments"
            className="btn-secondary text-center py-3 flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4" />
            Take Assessments
          </Link>
        </div>
      </div>
    </div>
  )
}

function User({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}
