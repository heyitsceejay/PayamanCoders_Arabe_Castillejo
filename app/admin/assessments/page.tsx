'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, BarChart, Award, Clock, ChevronUp, ChevronDown, ChevronsUpDown, BookOpen, Filter } from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'

type SortField = 'title' | 'category' | 'difficulty' | 'duration' | 'questions'
type SortOrder = 'asc' | 'desc'

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState<SortField>('title')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [filter, setFilter] = useState({ category: '', difficulty: '', status: '' })

  useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    try {
      const response = await fetch('/api/assessments')
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
      case 'beginner': return 'bg-green-100 text-green-800 border-green-500/40'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-500/40'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-500/40'
      default: return 'bg-gray-100 text-gray-800 border-gray-500/40'
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  const getFilteredAssessments = () => {
    return assessments.filter(assessment => {
      if (filter.category && assessment.category !== filter.category) return false
      if (filter.difficulty && assessment.difficulty !== filter.difficulty) return false
      if (filter.status === 'active' && !assessment.isActive) return false
      if (filter.status === 'inactive' && assessment.isActive) return false
      return true
    })
  }

  const getSortedAssessments = () => {
    const filtered = getFilteredAssessments()
    const sorted = [...filtered].sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === 'questions') {
        aValue = a.questions?.length || 0
        bValue = b.questions?.length || 0
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }

  const getPaginatedAssessments = () => {
    const sorted = getSortedAssessments()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sorted.slice(startIndex, endIndex)
  }

  const totalPages = Math.ceil(getSortedAssessments().length / itemsPerPage)

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-primary-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-primary-600" />
    )
  }

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl animate-pulse"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-[-10%] bottom-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-purple-400/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" role="main">
        <header className="mb-10">
          <div className="relative overflow-hidden group/header mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover/header:opacity-100 transition-opacity duration-500 rounded-2xl" aria-hidden="true"></div>
            <div className="relative flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-500 text-white shadow-xl shadow-blue-500/40 group/icon flex-shrink-0" aria-hidden="true">
                  <Award className="h-8 w-8 md:h-10 md:w-10 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" aria-hidden="true" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 to-purple-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-2xl blur-xl opacity-0 group-hover/icon:opacity-100 animate-pulse transition-opacity duration-300" aria-hidden="true"></div>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                    Assessment Management
                  </h1>
                  <p className="text-lg md:text-xl text-secondary-600">
                    Create and manage skill assessments for the platform
                  </p>
                </div>
              </div>
              <Link
                href="/admin/assessments/create"
                className="relative flex items-center justify-center gap-3 px-6 py-4 text-base font-bold rounded-xl border-2 border-primary-500/50 bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-xl shadow-primary-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50 overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
                <Plus className="w-5 h-5 relative z-10 group-hover/btn:scale-125 transition-transform duration-300" aria-hidden="true" />
                <span className="relative z-10">Create Assessment</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="stat-card" style={{ '--float-delay': '0.1s' } as CSSProperties}>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                    <Award className="h-7 w-7" />
                  </div>
                </div>
                <div className="ml-5 flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1">
                    Total Assessments
                  </p>
                  <p className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 bg-clip-text">
                    {assessments.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card" style={{ '--float-delay': '0.2s' } as CSSProperties}>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/35 bg-green-500/15 text-green-500 shadow-inner shadow-green-700/25">
                    <BookOpen className="h-7 w-7" />
                  </div>
                </div>
                <div className="ml-5 flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1">
                    Active
                  </p>
                  <p className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-gradient-to-r from-green-600 via-green-500 to-green-400 bg-clip-text">
                    {assessments.filter(a => a.isActive).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card" style={{ '--float-delay': '0.3s' } as CSSProperties}>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-500/35 bg-gray-500/15 text-gray-500 shadow-inner shadow-gray-700/25">
                    <BookOpen className="h-7 w-7" />
                  </div>
                </div>
                <div className="ml-5 flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1">
                    Inactive
                  </p>
                  <p className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 bg-clip-text">
                    {assessments.filter(a => !a.isActive).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card" style={{ '--float-delay': '0.4s' } as CSSProperties}>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/35 bg-blue-500/15 text-blue-500 shadow-inner shadow-blue-700/25">
                    <Filter className="h-7 w-7" />
                  </div>
                </div>
                <div className="ml-5 flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1">
                    Categories
                  </p>
                  <p className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text">
                    {new Set(assessments.map(a => a.category)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <section className="card relative overflow-hidden group/filter hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 mb-10" aria-label="Assessment filters">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/filter:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
          <div className="relative p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="category-filter" className="block text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30" aria-hidden="true">
                    <Filter className="h-4 w-4 text-primary-600" aria-hidden="true" />
                  </div>
                  Category
                </label>
                <select
                  id="category-filter"
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
                <label htmlFor="difficulty-filter" className="block text-base font-bold text-gray-700 mb-3">
                  Difficulty
                </label>
                <select
                  id="difficulty-filter"
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
              <div>
                <label htmlFor="status-filter" className="block text-base font-bold text-gray-700 mb-3">
                  Status
                </label>
                <select
                  id="status-filter"
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                  className="w-full px-5 py-3 text-base font-medium rounded-xl border-2 border-primary-500/30 bg-white/70 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 shadow-lg backdrop-blur-xl hover:border-primary-400 hover:bg-white/90 transition-all"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Assessments Table */}
        {loading ? (
          <div className="text-center py-16" role="status" aria-live="polite">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-6" aria-hidden="true"></div>
            <p className="text-lg text-secondary-600 font-medium">Loading assessments...</p>
          </div>
        ) : assessments.length === 0 ? (
          <div className="card relative overflow-hidden group/empty hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500" role="status">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
            <div className="relative py-20 text-center">
              <div className="feature-icon mx-auto mb-6 w-20 h-20" aria-hidden="true">
                <BookOpen className="w-12 h-12 text-primary-500" />
              </div>
              <p className="text-xl text-gray-500 font-bold">No assessments found</p>
            </div>
          </div>
        ) : (
          <>
            {/* Table Container */}
            <section className="card overflow-hidden" aria-label="Assessments table">
              <div className="overflow-x-auto">
                <table className="w-full" role="table" aria-label="Assessment management table">
                  <thead className="bg-gradient-to-r from-primary-50 to-secondary-50 border-b-2 border-primary-100">
                    <tr>
                      <th 
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold text-gray-900 cursor-pointer hover:bg-primary-100/50 transition-colors"
                        onClick={() => handleSort('title')}
                      >
                        <button className="flex items-center gap-2 w-full text-left">
                          <span>Assessment Title</span>
                          <SortIcon field="title" />
                        </button>
                      </th>
                      <th 
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold text-gray-900 cursor-pointer hover:bg-primary-100/50 transition-colors"
                        onClick={() => handleSort('category')}
                      >
                        <button className="flex items-center gap-2 w-full text-left">
                          <span>Category</span>
                          <SortIcon field="category" />
                        </button>
                      </th>
                      <th 
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold text-gray-900 cursor-pointer hover:bg-primary-100/50 transition-colors"
                        onClick={() => handleSort('difficulty')}
                      >
                        <button className="flex items-center gap-2 w-full text-left">
                          <span>Difficulty</span>
                          <SortIcon field="difficulty" />
                        </button>
                      </th>
                      <th 
                        scope="col"
                        className="px-6 py-4 text-center text-sm font-bold text-gray-900 cursor-pointer hover:bg-primary-100/50 transition-colors"
                        onClick={() => handleSort('duration')}
                      >
                        <button className="flex items-center justify-center gap-2 w-full">
                          <Clock className="w-4 h-4" aria-hidden="true" />
                          <span>Duration</span>
                          <SortIcon field="duration" />
                        </button>
                      </th>
                      <th 
                        scope="col"
                        className="px-6 py-4 text-center text-sm font-bold text-gray-900 cursor-pointer hover:bg-primary-100/50 transition-colors"
                        onClick={() => handleSort('questions')}
                      >
                        <button className="flex items-center justify-center gap-2 w-full">
                          <BarChart className="w-4 h-4" aria-hidden="true" />
                          <span>Questions</span>
                          <SortIcon field="questions" />
                        </button>
                      </th>
                      <th scope="col" className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getPaginatedAssessments().map((assessment) => (
                      <tr 
                        key={assessment._id}
                        className="hover:bg-primary-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 flex-shrink-0" aria-hidden="true">
                              <Award className="w-5 h-5 text-primary-600" aria-hidden="true" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                {assessment.title}
                              </h3>
                              <p className="text-sm text-secondary-600 line-clamp-2 mt-1">
                                {assessment.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 border border-blue-500/40">
                            {assessment.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-bold border ${getDifficultyColor(assessment.difficulty)}`}>
                            {assessment.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-base font-semibold text-gray-900">
                            {assessment.duration} min
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-base font-semibold text-gray-900">
                            {assessment.questions?.length || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-bold border ${
                            assessment.isActive 
                              ? 'bg-green-100 text-green-800 border-green-500/40' 
                              : 'bg-gray-100 text-gray-800 border-gray-500/40'
                          }`}>
                            {assessment.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              className="p-2 rounded-lg border-2 border-blue-500/50 bg-white text-blue-600 shadow-md hover:shadow-lg hover:scale-105 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
                              aria-label={`View ${assessment.title}`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 rounded-lg border-2 border-gray-500/50 bg-white text-gray-600 shadow-md hover:shadow-lg hover:scale-105 hover:border-gray-500 hover:bg-gray-50 transition-all duration-300"
                              aria-label={`Edit ${assessment.title}`}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 rounded-lg border-2 border-purple-500/50 bg-white text-purple-600 shadow-md hover:shadow-lg hover:scale-105 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300"
                              aria-label={`View analytics for ${assessment.title}`}
                            >
                              <BarChart className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 rounded-lg border-2 border-red-500/50 bg-white text-red-600 shadow-md hover:shadow-lg hover:scale-105 hover:border-red-500 hover:bg-red-50 transition-all duration-300"
                              aria-label={`Delete ${assessment.title}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="card mt-6" aria-label="Pagination navigation">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-secondary-600" role="status" aria-live="polite">
                    Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-bold text-gray-900">
                      {Math.min(currentPage * itemsPerPage, getSortedAssessments().length)}
                    </span>{' '}
                    of <span className="font-bold text-gray-900">{getSortedAssessments().length}</span> assessments
                  </div>
                  <div className="flex items-center gap-2" role="group" aria-label="Pagination controls">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-bold rounded-lg border-2 border-primary-500/50 bg-white text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      aria-label="Go to previous page"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-bold rounded-lg transition-all ${
                            currentPage === page
                              ? 'bg-primary-500 text-white shadow-lg'
                              : 'bg-white text-gray-700 hover:bg-primary-50 border border-gray-300'
                          }`}
                          aria-label={`Go to page ${page}`}
                          aria-current={currentPage === page ? 'page' : undefined}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-bold rounded-lg border-2 border-primary-500/50 bg-white text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      aria-label="Go to next page"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  )
}
