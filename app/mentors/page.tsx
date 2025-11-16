'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Star, 
  MessageCircle,
  Filter,
  X,
  Users,
  Award,
  Clock
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <div className="border-b border-white/30 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Find Your Mentor 🎯
          </h1>
          <p className="text-secondary-600">
            Connect with experienced professionals who can guide your career journey
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Search mentors by name, skills, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/40 bg-white/60 py-3 pl-10 pr-4 backdrop-blur transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center gap-2 px-6"
            >
              <Filter className="h-5 w-5" />
              Filters
              {selectedSkills.length > 0 && (
                <span className="ml-1 rounded-full bg-primary-500 px-2 py-0.5 text-xs text-white">
                  {selectedSkills.length}
                </span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="card">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Filter by Skills</h3>
                {selectedSkills.length > 0 && (
                  <button
                    onClick={() => setSelectedSkills([])}
                    className="text-sm text-primary-600 hover:text-primary-500"
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
                    className={`rounded-full border px-3 py-1 text-sm transition-all ${
                      selectedSkills.includes(skill)
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-white/40 bg-white/60 text-gray-700 hover:border-primary-500/40'
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
        <div className="mb-6 text-sm text-secondary-600">
          Showing {filteredMentors.length} of {mentors.length} mentors
        </div>

        {/* Mentors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="mb-4 h-20 w-20 rounded-full bg-white/70"></div>
                <div className="mb-2 h-6 w-3/4 rounded bg-white/70"></div>
                <div className="mb-4 h-4 w-full rounded bg-white/70"></div>
                <div className="h-10 w-full rounded bg-white/70"></div>
              </div>
            ))}
          </div>
        ) : filteredMentors.length === 0 ? (
          <div className="card py-12 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-secondary-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
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
                className="card group transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Profile Picture */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {mentor.profile.profilePicture ? (
                      <img
                        src={mentor.profile.profilePicture}
                        alt={`${mentor.firstName} ${mentor.lastName}`}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-xl font-bold text-white">
                        {mentor.firstName[0]}
                        {mentor.lastName[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {mentor.firstName} {mentor.lastName}
                      </h3>
                      {mentor.profile.location && (
                        <p className="flex items-center gap-1 text-sm text-secondary-600">
                          <MapPin className="h-3 w-3" />
                          {mentor.profile.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Experience */}
                {mentor.profile.experience && (
                  <div className="mb-3 flex items-center gap-2 text-sm text-secondary-600">
                    <Briefcase className="h-4 w-4" />
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
                      className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700"
                    >
                      {skill}
                    </span>
                  ))}
                  {mentor.profile.skills.length > 4 && (
                    <span className="rounded-full bg-secondary-100 px-2 py-1 text-xs font-medium text-secondary-700">
                      +{mentor.profile.skills.length - 4} more
                    </span>
                  )}
                </div>

                {/* Stats */}
                {mentor.stats && (
                  <div className="mb-4 flex items-center gap-4 border-t border-white/40 pt-4 text-sm">
                    <div className="flex items-center gap-1 text-secondary-600">
                      <Award className="h-4 w-4" />
                      <span>{mentor.stats.webinars} webinars</span>
                    </div>
                    <div className="flex items-center gap-1 text-secondary-600">
                      <Users className="h-4 w-4" />
                      <span>{mentor.stats.mentees} mentees</span>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleRequestMentorship(mentor)}
                  disabled={!user || user.role === 'mentor'}
                  className="btn-primary w-full"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Request Mentorship
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mentorship Request Modal */}
      {showRequestModal && selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Request Mentorship
              </h2>
              <button
                onClick={() => setShowRequestModal(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 flex items-center gap-3 rounded-xl bg-primary-50 p-4">
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
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Message *
                </label>
                <textarea
                  value={requestForm.message}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, message: e.target.value })
                  }
                  placeholder="Introduce yourself and explain why you'd like this person as your mentor..."
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Your Goals (comma-separated)
                </label>
                <input
                  type="text"
                  value={requestForm.goals}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, goals: e.target.value })
                  }
                  placeholder="e.g., Career transition, Skill development, Interview prep"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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
