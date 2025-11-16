'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Search, 
  MapPin, 
  Briefcase, 
  MessageCircle,
  Filter,
  X,
  Users,
  Award
} from 'lucide-react'

interface Mentor {
  _id: string
  firstName: string
  lastName: string
  email: string
  profile: {
    bio?: string
    skills: string[]
    location?: string
    experience?: string
    profilePicture?: string
  }
  stats?: {
    webinars: number
    mentees: number
    rating: number
  }
}

export default function MentorsPage() {
  const { user } = useAuth()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [careerField, setCareerField] = useState<string>('')
  const [requestForm, setRequestForm] = useState({
    message: '',
    goals: '',
    preferredTopics: '',
    meetingFrequency: 'monthly' as 'weekly' | 'biweekly' | 'monthly'
  })

  // Get career skills from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const skillsParam = params.get('skills')
    if (skillsParam) {
      const skills = skillsParam.split(',').filter(s => s.trim())
      setSelectedSkills(skills)
      setCareerField(skills.join(', '))
    }
  }, [])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchMentors()
  }, [])

  useEffect(() => {
    filterMentors()
  }, [searchQuery, selectedSkills, mentors])

  const fetchMentors = async () => {
    try {
      const response = await fetch('/api/mentors')
      if (response.ok) {
        const data = await response.json()
        setMentors(data.mentors || [])
      }
    } catch (error) {
      console.error('Error fetching mentors:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterMentors = () => {
    let filtered = [...mentors]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (mentor) =>
          mentor.firstName.toLowerCase().includes(query) ||
          mentor.lastName.toLowerCase().includes(query) ||
          mentor.profile.bio?.toLowerCase().includes(query) ||
          mentor.profile.skills.some((skill) =>
            skill.toLowerCase().includes(query)
          )
      )
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter((mentor) =>
        selectedSkills.some((skill) =>
          mentor.profile.skills.some((s) =>
            s.toLowerCase().includes(skill.toLowerCase())
          )
        )
      )
    }

    setFilteredMentors(filtered)
  }

  const allSkills = Array.from(
    new Set(mentors.flatMap((m) => m.profile.skills))
  ).sort()

  const toggleSkillFilter = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    )
  }

  const handleRequestMentorship = (mentor: Mentor) => {
    setSelectedMentor(mentor)
    setShowRequestModal(true)
  }

  const submitMentorshipRequest = async () => {
    if (!selectedMentor || !requestForm.message) return

    try {
      setSubmitting(true)
      const response = await fetch('/api/mentorship/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: selectedMentor._id,
          message: requestForm.message,
          goals: requestForm.goals.split(',').map((g) => g.trim()).filter(Boolean),
          preferredTopics: requestForm.preferredTopics.split(',').map((t) => t.trim()).filter(Boolean),
          meetingFrequency: requestForm.meetingFrequency,
        }),
      })

      if (response.ok) {
        alert('Mentorship request sent successfully!')
        setShowRequestModal(false)
        setRequestForm({
          message: '',
          goals: '',
          preferredTopics: '',
          meetingFrequency: 'monthly'
        })
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to send request')
      }
    } catch (error) {
      console.error('Error sending request:', error)
      alert('Failed to send mentorship request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25">
              <Users className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 animate-[floatUp_0.85s_ease-out]">
              Find Your Mentor 🎯
            </h1>
          </div>
          <p className="text-secondary-600">
            Connect with experienced professionals who can guide your career journey
          </p>
        </div>
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-400" />
              <input
                type="text"
                placeholder="Search mentors by name, skills, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/40 bg-white/60 py-3 pl-12 pr-4 text-gray-900 placeholder-secondary-400 shadow-sm backdrop-blur transition-all hover:border-primary-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center gap-2 px-6 whitespace-nowrap"
            >
              <Filter className="h-5 w-5" />
              Filters
              {selectedSkills.length > 0 && (
                <span className="ml-1 rounded-full bg-primary-500 px-2 py-0.5 text-xs font-semibold text-white shadow-lg shadow-primary-500/25">
                  {selectedSkills.length}
                </span>
              )}
            </button>
          </div>

          {/* Active Filters Display */}
          {selectedSkills.length > 0 && (
            <div className="card animate-[floatUp_0.85s_ease-out]">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Active Filters:</h3>
                <button
                  onClick={() => setSelectedSkills([])}
                  className="auth-link text-sm flex items-center gap-1"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary-500 bg-primary-500 px-3 py-1.5 text-sm font-medium text-white shadow-lg shadow-primary-500/25"
                  >
                    {skill}
                    <button
                      onClick={() => toggleSkillFilter(skill)}
                      className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Filters Panel */}
          {showFilters && (
            <div className="card animate-[floatUp_0.85s_ease-out]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Filter by Skills</h3>
                {selectedSkills.length > 0 && (
                  <button
                    onClick={() => setSelectedSkills([])}
                    className="auth-link text-sm"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allSkills.slice(0, 20).map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkillFilter(skill)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                      selectedSkills.includes(skill)
                        ? 'border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                        : 'border-white/40 bg-white/60 text-gray-700 hover:border-primary-500/40 hover:bg-white/80'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-secondary-600 font-medium">
          Showing {filteredMentors.length} of {mentors.length} mentors
        </div>

        {/* Mentors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="mb-4 h-16 w-16 rounded-full bg-white/70"></div>
                <div className="mb-2 h-6 w-3/4 rounded bg-white/70"></div>
                <div className="mb-4 h-4 w-full rounded bg-white/70"></div>
                <div className="h-10 w-full rounded bg-white/70"></div>
              </div>
            ))}
          </div>
        ) : filteredMentors.length === 0 ? (
          <div className="card py-16 text-center">
            <div className="feature-icon mx-auto mb-4 w-16 h-16">
              <Users className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No mentors found
            </h3>
            <p className="text-secondary-600">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor._id}
                className="feature-card group transition-all hover:-translate-y-1"
              >
                {/* Profile Picture */}
                <div className="mb-4 flex items-center gap-3">
                  {mentor.profile.profilePicture ? (
                    <img
                      src={mentor.profile.profilePicture}
                      alt={`${mentor.firstName} ${mentor.lastName}`}
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-white/50"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-xl font-bold text-white shadow-lg shadow-primary-500/25">
                      {mentor.firstName[0]}
                      {mentor.lastName[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {mentor.firstName} {mentor.lastName}
                    </h3>
                    {mentor.profile.location && (
                      <p className="flex items-center gap-1 text-sm text-secondary-600">
                        <MapPin className="h-3.5 w-3.5" />
                        {mentor.profile.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Experience */}
                {mentor.profile.experience && (
                  <div className="mb-3 flex items-center gap-2 text-sm text-secondary-600">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                    <span>{mentor.profile.experience}</span>
                  </div>
                )}

                {/* Bio */}
                {mentor.profile.bio && (
                  <p className="mb-4 line-clamp-3 text-sm text-secondary-700">
                    {mentor.profile.bio}
                  </p>
                )}

                {/* Skills */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {mentor.profile.skills.slice(0, 4).map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700"
                    >
                      {skill}
                    </span>
                  ))}
                  {mentor.profile.skills.length > 4 && (
                    <span className="rounded-full bg-secondary-100 px-2.5 py-1 text-xs font-medium text-secondary-700">
                      +{mentor.profile.skills.length - 4} more
                    </span>
                  )}
                </div>

                {/* Stats */}
                {mentor.stats && (
                  <div className="mb-4 flex items-center gap-4 border-t border-white/40 pt-4 text-sm">
                    <div className="flex items-center gap-1.5 text-secondary-600">
                      <Award className="h-4 w-4 text-purple-500" />
                      <span>{mentor.stats.webinars} webinars</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-secondary-600">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>{mentor.stats.mentees} mentees</span>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleRequestMentorship(mentor)}
                  disabled={!user || user.role === 'mentor'}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Request Mentorship
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mentorship Request Modal */}
      {showRequestModal && selectedMentor && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-[fadeIn_0.3s_ease-out]">
          <div className="w-full max-w-2xl rounded-2xl border-2 border-white/40 bg-white backdrop-blur-xl shadow-2xl animate-[floatUp_0.5s_ease-out] flex flex-col max-h-[90vh]">
            
            {/* Modal Header with Gradient */}
            <div className="relative bg-gradient-to-br from-primary-500 to-secondary-500 p-6 pb-8 rounded-t-2xl flex-shrink-0">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 rounded-t-2xl"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg ring-4 ring-white/30">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Request Mentorship
                    </h2>
                    <p className="text-white/90 text-sm">
                      Connect with your future mentor
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Mentor Info Card */}
            <div className="flex-shrink-0 p-6 bg-gradient-to-br from-primary-50 to-secondary-50 border-b-2 border-primary-100">
              <div className="flex items-center gap-4">
                {selectedMentor.profile.profilePicture ? (
                  <img
                    src={selectedMentor.profile.profilePicture}
                    alt={`${selectedMentor.firstName} ${selectedMentor.lastName}`}
                    className="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-lg"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-xl font-bold text-white shadow-lg ring-4 ring-white">
                    {selectedMentor.firstName[0]}
                    {selectedMentor.lastName[0]}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedMentor.firstName} {selectedMentor.lastName}
                  </h3>
                  <p className="text-sm text-secondary-600 font-medium">
                    {selectedMentor.profile.experience}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Message *
                </label>
                <textarea
                  value={requestForm.message}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, message: e.target.value })
                  }
                  placeholder="Introduce yourself and explain why you'd like this person as your mentor..."
                  rows={4}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Goals (comma-separated)
                </label>
                <input
                  type="text"
                  value={requestForm.goals}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, goals: e.target.value })
                  }
                  placeholder="e.g., Career transition, Skill development, Interview prep"
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Preferred Topics (comma-separated)
                </label>
                <input
                  type="text"
                  value={requestForm.preferredTopics}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      preferredTopics: e.target.value,
                    })
                  }
                  placeholder="e.g., React, System Design, Leadership"
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Meeting Frequency
                </label>
                <select
                  value={requestForm.meetingFrequency}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      meetingFrequency: e.target.value as any,
                    })
                  }
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex-shrink-0 border-t-2 border-gray-200 bg-white p-6 rounded-b-2xl">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={submitMentorshipRequest}
                  disabled={submitting || !requestForm.message}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
