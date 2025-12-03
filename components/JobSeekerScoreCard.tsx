'use client'

import { useState, useEffect } from 'react'
import { Award, TrendingUp, AlertCircle, CheckCircle, XCircle, RefreshCw, ChevronDown } from 'lucide-react'
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
  const [isExpanded, setIsExpanded] = useState(false)
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
    <div className="relative overflow-hidden rounded-2xl border border-primary-500/20 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500 group">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" aria-hidden="true"></div>
      
      {/* Collapsed Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full relative overflow-hidden transition-all duration-500 ease-out ${
          isExpanded ? 'bg-gradient-to-r from-primary-500 to-secondary-500' : 'bg-gradient-to-r from-primary-500/10 to-secondary-500/10 hover:from-primary-500/20 hover:to-secondary-500/20'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
        
        <div className={`relative z-10 p-5 transition-all duration-500 ${isExpanded ? 'pb-3' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Score Badge */}
              <div className={`relative flex h-14 w-14 items-center justify-center rounded-xl shadow-lg transition-all duration-500 ${
                isExpanded 
                  ? 'bg-white/20 backdrop-blur-sm border border-white/30' 
                  : 'bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/30'
              }`}>
                <Award className={`w-7 h-7 transition-colors duration-500 ${isExpanded ? 'text-white' : 'text-primary-600'}`} />
                <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white text-xs font-bold shadow-lg">
                  {Math.round(score.totalScore)}
                </div>
              </div>
              
              {/* Title & Score */}
              <div className="text-left">
                <h2 className={`text-xl font-bold mb-1 transition-colors duration-500 ${
                  isExpanded ? 'text-white' : 'text-gray-900'
                }`}>
                  Profile Score
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold transition-colors duration-500 ${
                    isExpanded ? 'text-white' : 'bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent'
                  }`}>
                    {score.totalScore.toFixed(1)}
                  </span>
                  <span className={`text-sm font-medium transition-colors duration-500 ${
                    isExpanded ? 'text-white/80' : 'text-secondary-600'
                  }`}>
                    / 100
                  </span>
                  <span className={`ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-500 ${
                    isExpanded 
                      ? 'bg-white/20 text-white border border-white/30' 
                      : 'bg-primary-500/20 text-primary-700 border border-primary-500/30'
                  }`}>
                    {tierConfig.icon}
                    {tierConfig.label}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Expand Button */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className={`text-xs font-medium transition-colors duration-500 ${
                  isExpanded ? 'text-white/90' : 'text-secondary-600'
                }`}>
                  {isExpanded ? 'Hide details' : 'View details'}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-500 ${
                isExpanded 
                  ? 'bg-white/20 border border-white/30' 
                  : 'bg-primary-500/10 border border-primary-500/20 group-hover:bg-primary-500/20'
              }`}>
                <ChevronDown 
                  className={`w-5 h-5 transition-all duration-500 ease-out ${
                    isExpanded ? 'rotate-180 text-white' : 'rotate-0 text-primary-600'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      <div 
        className={`transition-all duration-700 ease-out ${
          isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          transitionProperty: 'max-height, opacity',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Content - White Background */}
        <div className="p-6 bg-white relative z-10 space-y-6">
          {/* Application Status Alert */}
          <div className="animate-[floatUp_0.6s_ease-out_0.1s_both]">
            {score.totalScore < 60 ? (
              <div className={`p-5 ${tierConfig.bgColor} border-2 ${tierConfig.borderColor} rounded-xl shadow-lg`}>
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tierConfig.bgColor} border ${tierConfig.borderColor} flex-shrink-0`}>
                    <AlertCircle className={`w-5 h-5 ${tierConfig.textColor}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold ${tierConfig.textColor} mb-2 text-base`}>Profile Incomplete</h4>
                    <p className={`text-sm ${tierConfig.textColor} leading-relaxed`}>
                      You need a score of at least <strong>60</strong> to apply for jobs. Complete the items below to increase your score.
                    </p>
                  </div>
                </div>
              </div>
            ) : score.totalScore < 75 ? (
              <div className="p-5 bg-blue-50/80 border-2 border-blue-200 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 border border-blue-300 flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-900 mb-2 text-base">Good Start!</h4>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      You can apply for jobs, but improving your score to <strong>75+</strong> will make you more competitive.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-green-50/80 border-2 border-green-200 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 border border-green-300 flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-green-900 mb-2 text-base">Excellent Profile!</h4>
                    <p className="text-sm text-green-700 leading-relaxed">
                      Your profile is strong and competitive. You're ready to apply for jobs!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {score.recommendations.length > 0 && (
            <div className="animate-[floatUp_0.6s_ease-out_0.2s_both]">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/30">
                  <TrendingUp className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Top Recommendations</h3>
              </div>
              <ul className="space-y-3">
                {score.recommendations.slice(0, 3).map((rec, index) => (
                  <li 
                    key={index} 
                    className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-primary-50/80 to-secondary-50/80 border border-primary-200/50 hover:border-primary-300/70 hover:shadow-md transition-all duration-300 group"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed flex-1">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Items */}
          {score.missingItems.length > 0 && (
            <div className="animate-[floatUp_0.6s_ease-out_0.3s_both]">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 border border-red-300">
                  <XCircle className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">
                  Missing Items 
                  <span className="ml-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold">
                    {score.missingItems.length}
                  </span>
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {score.missingItems.slice(0, 6).map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 text-sm text-gray-700 p-3 rounded-lg bg-white/80 border border-gray-200 hover:border-red-300 hover:shadow-md transition-all duration-300"
                  >
                    <div className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0 animate-pulse"></div>
                    <span className="flex-1">{item}</span>
                  </div>
                ))}
              </div>
              {score.missingItems.length > 6 && (
                <p className="text-xs text-gray-500 mt-3 text-center font-medium">
                  +{score.missingItems.length - 6} more items to complete
                </p>
              )}
            </div>
          )}

          {/* Score Breakdown Toggle */}
          <div className="animate-[floatUp_0.6s_ease-out_0.4s_both]">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between py-4 px-5 rounded-xl border-2 border-primary-500/30 bg-gradient-to-r from-white to-primary-50/30 hover:from-primary-50/50 hover:to-secondary-50/50 hover:border-primary-500/50 hover:shadow-lg transition-all duration-300 group"
              aria-expanded={showDetails}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-4 h-4 text-primary-600" />
                </div>
                <span className="text-sm font-bold text-primary-600 group-hover:text-primary-700 transition-colors">
                  {showDetails ? 'Hide' : 'Show'} Detailed Breakdown
                </span>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-primary-600 transition-all duration-500 ease-out ${
                  showDetails ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>

            {/* Breakdown Details */}
            <div 
              className={`transition-all duration-500 ease-out overflow-hidden ${
                showDetails ? 'max-h-[1200px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
              }`}
              style={{
                transitionProperty: 'max-height, opacity, margin-top',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="space-y-4">
                {Object.entries(score.breakdown).map(([key, value], index) => {
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
                    <div 
                      key={key} 
                      className="p-5 rounded-xl bg-gradient-to-r from-white to-gray-50/50 border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 group"
                      style={{ 
                        animation: `floatUp 0.6s ease-out ${0.5 + index * 0.1}s both`
                      }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-gray-900 text-sm">
                          {categoryLabels[key]}
                        </span>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                          {value.toFixed(1)}<span className="text-sm text-gray-500">/{max}</span>
                        </span>
                      </div>
                      <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundSize: '200% 100%',
                            animation: showDetails ? 'shimmer 2s infinite' : 'none'
                          }}
                        />
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-medium">
                          {percentage.toFixed(0)}% complete
                        </span>
                        {percentage === 100 && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-[floatUp_0.6s_ease-out_0.5s_both]">
            <Link
              href="/profile"
              className="group relative overflow-hidden btn-primary text-center py-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <User className="w-5 h-5 relative z-10" />
              <span className="relative z-10 font-bold">Complete Profile</span>
            </Link>
            <Link
              href="/assessments"
              className="group relative overflow-hidden btn-secondary text-center py-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <Award className="w-5 h-5 relative z-10" />
              <span className="relative z-10 font-bold">Take Assessments</span>
            </Link>
          </div>
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
