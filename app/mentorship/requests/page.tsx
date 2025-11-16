'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  Calendar,
  Target,
  BookOpen,
} from 'lucide-react'

interface MentorshipRequest {
  _id: string
  mentee: {
    _id: string
    firstName: string
    lastName: string
    email: string
    profile: {
      bio?: string
      skills: string[]
      profilePicture?: string
    }
  }
  mentor: {
    _id: string
    firstName: string
    lastName: string
    email: string
    profile?: {
      bio?: string
      skills: string[]
      profilePicture?: string
    }
  }
  message: string
  goals: string[]
  preferredTopics: string[]
  meetingFrequency: string
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  response?: string
  respondedAt?: string
  createdAt: string
}

export default function MentorshipRequestsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<MentorshipRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')
  const [selectedRequest, setSelectedRequest] = useState<MentorshipRequest | null>(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [responseForm, setResponseForm] = useState({
    status: 'accepted' as 'accepted' | 'rejected',
    response: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      fetchRequests()
    }
  }, [user])

  const fetchRequests = async () => {
    try {
      const type = user?.role === 'mentor' ? 'received' : 'sent'
      console.log('Fetching mentorship requests, type:', type, 'user:', user)
      const response = await fetch(`/api/mentorship/request?type=${type}`)
      console.log('Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched requests:', data.requests)
        setRequests(data.requests || [])
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRespond = async () => {
    if (!selectedRequest || !responseForm.response) return

    try {
      setSubmitting(true)
      const response = await fetch(
        `/api/mentorship/requests/${selectedRequest._id}/respond`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(responseForm),
        }
      )

      if (response.ok) {
        alert('Response sent successfully!')
        setShowResponseModal(false)
        setResponseForm({ status: 'accepted', response: '' })
        fetchRequests()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to send response')
      }
    } catch (error) {
      console.error('Error responding:', error)
      alert('Failed to send response')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredRequests = requests.filter((req) => {
    if (filter === 'all') return true
    return req.status === filter
  })

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      accepted: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
    }
    const icons = {
      pending: Clock,
      accepted: CheckCircle,
      rejected: XCircle,
      cancelled: XCircle,
    }
    const Icon = icons[status as keyof typeof icons]
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        <Icon className="h-4 w-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25">
              <Users className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === 'mentor' ? 'Mentorship Requests' : 'My Requests'}
            </h1>
          </div>
          <p className="text-secondary-600">
            {user?.role === 'mentor'
              ? 'Manage incoming mentorship requests from aspiring professionals'
              : 'Track your mentorship requests and responses'}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {['all', 'pending', 'accepted', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-white/60 text-gray-700 hover:bg-white/80'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-2 text-xs opacity-75">
                ({requests.filter((r) => f === 'all' || r.status === f).length})
              </span>
            </button>
          ))}
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-24 w-full rounded bg-white/70"></div>
              </div>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="card py-16 text-center">
            <Users className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No requests found
            </h3>
            <p className="text-secondary-600">
              {filter === 'all'
                ? 'You have no mentorship requests yet'
                : `No ${filter} requests`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredRequests.map((request) => {
              const person =
                user?.role === 'mentor' ? request.mentee : request.mentor
              return (
                <div key={request._id} className="feature-card">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {person.profile?.profilePicture ? (
                        <img
                          src={person.profile.profilePicture}
                          alt={`${person.firstName} ${person.lastName}`}
                          className="h-16 w-16 rounded-full object-cover ring-2 ring-white/50"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-xl font-bold text-white shadow-lg">
                          {person.firstName[0]}
                          {person.lastName[0]}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {person.firstName} {person.lastName}
                        </h3>
                        <p className="text-sm text-secondary-600">
                          {person.email}
                        </p>
                        <p className="mt-1 text-xs text-secondary-500">
                          Requested{' '}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  {/* Message */}
                  <div className="mb-4 rounded-lg bg-white/60 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <MessageCircle className="h-4 w-4 text-primary-500" />
                      Message
                    </div>
                    <p className="text-sm text-secondary-700">
                      {request.message}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="mb-4 grid gap-4 md:grid-cols-3">
                    {request.goals.length > 0 && (
                      <div className="rounded-lg bg-white/60 p-3">
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-900">
                          <Target className="h-3.5 w-3.5 text-green-500" />
                          Goals
                        </div>
                        <ul className="space-y-1">
                          {request.goals.map((goal, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-secondary-700"
                            >
                              • {goal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {request.preferredTopics.length > 0 && (
                      <div className="rounded-lg bg-white/60 p-3">
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-900">
                          <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                          Topics
                        </div>
                        <ul className="space-y-1">
                          {request.preferredTopics.map((topic, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-secondary-700"
                            >
                              • {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="rounded-lg bg-white/60 p-3">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-900">
                        <Calendar className="h-3.5 w-3.5 text-purple-500" />
                        Frequency
                      </div>
                      <p className="text-xs text-secondary-700">
                        {request.meetingFrequency.charAt(0).toUpperCase() +
                          request.meetingFrequency.slice(1)}{' '}
                        meetings
                      </p>
                    </div>
                  </div>

                  {/* Response */}
                  {request.response && (
                    <div className="mb-4 rounded-lg border-2 border-primary-200 bg-primary-50 p-4">
                      <div className="mb-2 text-sm font-semibold text-gray-900">
                        Response
                      </div>
                      <p className="text-sm text-secondary-700">
                        {request.response}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {user?.role === 'mentor' && request.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedRequest(request)
                          setResponseForm({ status: 'accepted', response: '' })
                          setShowResponseModal(true)
                        }}
                        className="btn-primary flex-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(request)
                          setResponseForm({ status: 'rejected', response: '' })
                          setShowResponseModal(true)
                        }}
                        className="btn-secondary flex-1"
                      >
                        <XCircle className="h-4 w-4" />
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedRequest && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl border-2 border-white/40 bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              {responseForm.status === 'accepted' ? 'Accept' : 'Decline'}{' '}
              Request
            </h2>
            <p className="mb-4 text-sm text-secondary-600">
              Send a message to{' '}
              <span className="font-semibold">
                {selectedRequest.mentee.firstName}{' '}
                {selectedRequest.mentee.lastName}
              </span>
            </p>
            <textarea
              value={responseForm.response}
              onChange={(e) =>
                setResponseForm({ ...responseForm, response: e.target.value })
              }
              placeholder={
                responseForm.status === 'accepted'
                  ? "I'd be happy to mentor you! Let's schedule our first meeting..."
                  : 'Thank you for your interest, but...'
              }
              rows={4}
              className="mb-4 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              required
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowResponseModal(false)}
                className="btn-secondary flex-1"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleRespond}
                disabled={submitting || !responseForm.response}
                className="btn-primary flex-1"
              >
                {submitting ? 'Sending...' : 'Send Response'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
