'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Award, Clock, BarChart, BookOpen, Filter, Trophy } from 'lucide-react'

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ category: '', difficulty: '' })

  useEffect(() => {
    fetchAssessments()
  }, [filter])

  // Real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchAssessments, 30000)
    return () => clearInterval(interval)
  }, [filter])

  const fetchAssessments = async () => {
    try {
      const params = new URLSearchParams()
      if (filter.category) params.append('category', filter.category)
      if (filter.difficulty) params.append('difficulty', filter.difficulty)
      
      const response = await fetch(`/api/assessments?${params}`)
      if (response.ok) {
        const data = await response.json()
        setAssessments(data.assessments)
      }
    } catch (error) {
      console.error('Failed to fetch assessments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl animate-pulse"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-[-10%] bottom-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-purple-400/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <div className="relative overflow-hidden group/header mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover/header:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="relative flex items-center gap-4">
              <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-500 text-white shadow-xl shadow-blue-500/40 group/icon flex-shrink-0">
                <Award className="h-8 w-8 md:h-10 md:w-10 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 to-purple-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-2xl blur-xl opacity-0 group-hover/icon:opacity-100 animate-pulse transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  Skill Assessments
                </h1>
                <p className="text-lg md:text-xl text-secondary-600">
                  Test your skills and earn certificates to boost your employability
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card relative overflow-hidden group/filter hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 mb-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/filter:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30">
                    <Filter className="h-4 w-4 text-primary-600" />
                  </div>
                  Category
                </label>
                <select
                  value={filter.category}
                  onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                  className="w-full px-5 py-3 text-base font-medium rounded-xl border-2 border-primary-500/30 bg-white/70 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 shadow-lg backdrop-blur-xl hover:border-primary-400 hover:bg-white/90 transition-all"
                >
                  <option value="">All Categories</option>
                  <option value="technical">Technical</option>
                  <option value="soft_skills">Soft Skills</option>
                  <option value="industry_specific">Industry Specific</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="block text-base font-bold text-gray-700 mb-3">
                  Difficulty
                </label>
                <select
                  value={filter.difficulty}
                  onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
                  className="w-full px-5 py-3 text-base font-medium rounded-xl border-2 border-primary-500/30 bg-white/70 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 shadow-lg backdrop-blur-xl hover:border-primary-400 hover:bg-white/90 transition-all"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="flex items-end">
                <Link
                  href="/certificates"
                  className="relative w-full flex items-center justify-center gap-3 px-6 py-4 text-base font-bold rounded-xl border-2 border-primary-500/50 bg-white/60 backdrop-blur-xl text-primary-600 shadow-xl shadow-primary-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-500/70 hover:bg-white/80 overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  <Trophy className="w-5 h-5 relative z-10 group-hover/btn:scale-125 transition-transform duration-300" />
                  <span className="relative z-10">View My Certificates</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-1000"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Assessments Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="futuristic-loader mx-auto mb-6">
              <div className="futuristic-loader-inner"></div>
            </div>
            <p className="text-lg text-secondary-600 font-medium">Loading assessments...</p>
          </div>
        ) : assessments.length === 0 ? (
          <div className="card relative overflow-hidden group/empty hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500"></div>
            <div className="relative py-20 text-center">
              <div className="feature-icon mx-auto mb-6 w-20 h-20">
                <BookOpen className="w-12 h-12 text-primary-500" />
              </div>
              <p className="text-xl text-gray-500 font-bold">No assessments found</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assessments.map((assessment) => (
              <div 
                key={assessment._id} 
                className="card relative overflow-hidden group/assessment hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover/assessment:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)] opacity-0 group-hover/assessment:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover/assessment:text-primary-600 transition-colors">
                        {assessment.title}
                      </h3>
                      <p className="text-base text-secondary-600 line-clamp-2 leading-relaxed">
                        {assessment.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${getDifficultyColor(assessment.difficulty)}`}>
                      {assessment.difficulty}
                    </span>
                    <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 border border-blue-500/40 shadow-md">
                      {assessment.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-base text-secondary-600 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-semibold">{assessment.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
                        <BarChart className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-semibold">{assessment.questions?.length || 0} questions</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30">
                      <Award className="w-5 h-5 text-yellow-600" />
                    </div>
                    <span className="text-base text-gray-600 font-semibold">
                      Pass: {assessment.passingScore}%
                    </span>
                  </div>

                  <Link
                    href={`/assessments/${assessment._id}`}
                    className="relative block w-full px-6 py-4 text-base font-bold rounded-xl border-2 border-primary-500/50 bg-white/60 backdrop-blur-xl text-primary-600 shadow-xl shadow-primary-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-500/70 hover:bg-white/80 overflow-hidden group/btn text-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                    <span className="relative z-10">Start Assessment</span>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-1000"></div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
