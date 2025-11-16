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
  const [requestForm, setRequestForm] = useState({
    message: '',
    goals: '',
    preferredTopics: '',
    meetingFrequency: 'monthly' as 'weekly' | 'biweekly' | 'monthly'
  })
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl card shadow-2xl animate-[floatUp_0.85s_ease-out]">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Request Mentorship
              </h2>
              <button
                onClick={() => setShowRequestModal(false)}
                className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 flex items-center gap-3 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 p-4 border border-primary-100">
              {selectedMentor.profile.profilePicture ? (
                <img
                  src={selectedMentor.profile.profilePicture}
                  alt={`${selectedMentor.firstName} ${selectedMentor.lastName}`}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-lg font-bold text-white">
                  {selectedMentor.firstName[0]}
                  {selectedMentor.lastName[0]}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedMentor.firstName} {selectedMentor.lastName}
                </h3>
                <p className="text-sm text-secondary-600">
                  {selectedMentor.profile.experience}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="auth-label">
                  Message *
                </label>
                <textarea
                  value={requestForm.message}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, message: e.target.value })
                  }
                  placeholder="Introduce yourself and explain why you'd like this person as your mentor..."
                  rows={4}
                  className="auth-input w-full resize-none"
                  required
                />
              </div>

              <div>
                <label className="auth-label">
                  Your Goals (comma-separated)
                </label>
                <input
                  type="text"
                  value={requestForm.goals}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, goals: e.target.value })
                  }
                  placeholder="e.g., Career transition, Skill development, Interview prep"
                  className="auth-input w-full"
                />
              </div>

              <div>
                <label className="auth-label">
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
                  className="auth-input w-full"
                />
              </div>

              <div>
                <label className="auth-label">
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
                  className="auth-input w-full"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowRequestModal(false)}
                className="btn-secondary flex-1"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={submitMentorshipRequest}
                disabled={submitting || !requestForm.message}
                className="btn-primary flex-1"
              >
                {submitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
