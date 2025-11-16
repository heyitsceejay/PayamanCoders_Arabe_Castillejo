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
        className={`inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-base font-bold shadow-md ${
          styles[status as keyof typeof styles]
        }`}
      >
        <Icon className="h-5 w-5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl animate-pulse"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-[-10%] bottom-20 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-blue-400/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="relative overflow-hidden group/header mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover/header:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="relative flex items-center gap-4">
              <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-blue-600 to-purple-600 text-white shadow-xl shadow-purple-500/40 group/icon flex-shrink-0">
                <Users className="h-8 w-8 md:h-10 md:w-10 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/50 to-blue-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-2xl blur-xl opacity-0 group-hover/icon:opacity-100 animate-pulse transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {user?.role === 'mentor' ? 'Mentorship Requests' : 'My Requests'}
                </h1>
                <p className="text-lg md:text-xl text-secondary-600">
                  {user?.role === 'mentor'
                    ? 'Manage incoming mentorship requests from aspiring professionals'
                    : 'Track your mentorship requests and responses'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-10 flex gap-4">
          {['all', 'pending', 'accepted', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`relative rounded-xl px-6 py-3 text-base font-bold transition-all duration-500 overflow-hidden group/filter ${
                filter === f
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-xl shadow-primary-500/30'
                  : 'bg-white/60 backdrop-blur-xl text-gray-700 hover:bg-white/80 border-2 border-primary-500/30 hover:border-primary-500/50'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/filter:opacity-100 transition-opacity duration-500 ${filter === f ? 'opacity-100' : ''}`}></div>
              <span className="relative z-10">
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className="ml-2 text-sm opacity-75">
                  ({requests.filter((r) => f === 'all' || r.status === f).length})
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="grid gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-32 w-full rounded bg-white/70"></div>
              </div>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="card relative overflow-hidden group/empty hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 py-20 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="feature-icon mx-auto mb-6 w-20 h-20">
                <Users className="w-12 h-12 text-primary-500" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                No requests found
              </h3>
              <p className="text-lg text-secondary-600">
                {filter === 'all'
                  ? 'You have no mentorship requests yet'
                  : `No ${filter} requests`}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8">
            {filteredRequests.map((request) => {
              const person =
                user?.role === 'mentor' ? request.mentee : request.mentor
              return (
                <div key={request._id} className="card relative overflow-hidden group/request hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01]">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover/request:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.15),transparent_70%)] opacity-0 group-hover/request:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative p-8">
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex items-center gap-5">
                        {person.profile?.profilePicture ? (
                          <img
                            src={person.profile.profilePicture}
                            alt={`${person.firstName} ${person.lastName}`}
                            className="h-20 w-20 rounded-full object-cover ring-4 ring-white/50 shadow-xl group-hover/request:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-2xl font-bold text-white shadow-xl group-hover/request:scale-110 transition-transform duration-300">
                            {person.firstName[0]}
                            {person.lastName[0]}
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {person.firstName} {person.lastName}
                          </h3>
                          <p className="text-base text-secondary-600 mb-2">
                            {person.email}
                          </p>
                          <p className="text-sm text-secondary-500 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Requested{' '}
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusBadge(request.status)}
                      </div>
                    </div>

                  {/* Message */}
                  <div className="mb-6 rounded-xl border-2 border-primary-200/50 bg-gradient-to-br from-white/80 to-primary-50/50 p-6 backdrop-blur">
                    <div className="mb-3 flex items-center gap-3 text-base font-bold text-gray-900">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30">
                        <MessageCircle className="h-5 w-5 text-primary-600" />
                      </div>
                      Message
                    </div>
                    <p className="text-base text-secondary-700 leading-relaxed">
                      {request.message}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="mb-6 grid gap-6 md:grid-cols-3">
                    {request.goals.length > 0 && (
                      <div className="rounded-xl border-2 border-green-200/50 bg-gradient-to-br from-white/80 to-green-50/50 p-5 backdrop-blur">
                        <div className="mb-3 flex items-center gap-3 text-base font-bold text-gray-900">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30">
                            <Target className="h-5 w-5 text-green-600" />
                          </div>
                          Goals
                        </div>
                        <ul className="space-y-2">
                          {request.goals.map((goal, idx) => (
                            <li
                              key={idx}
                              className="text-base text-secondary-700 font-medium flex items-start gap-2"
                            >
                              <span className="text-xl font-bold text-green-600">•</span>
                              <span>{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {request.preferredTopics.length > 0 && (
                      <div className="rounded-xl border-2 border-blue-200/50 bg-gradient-to-br from-white/80 to-blue-50/50 p-5 backdrop-blur">
                        <div className="mb-3 flex items-center gap-3 text-base font-bold text-gray-900">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                          </div>
                          Topics
                        </div>
                        <ul className="space-y-2">
                          {request.preferredTopics.map((topic, idx) => (
                            <li
                              key={idx}
                              className="text-base text-secondary-700 font-medium flex items-start gap-2"
                            >
                              <span className="text-xl font-bold text-blue-600">•</span>
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="rounded-xl border-2 border-purple-200/50 bg-gradient-to-br from-white/80 to-purple-50/50 p-5 backdrop-blur">
                      <div className="mb-3 flex items-center gap-3 text-base font-bold text-gray-900">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
                          <Calendar className="h-5 w-5 text-purple-600" />
                        </div>
                        Frequency
                      </div>
                      <p className="text-base text-secondary-700 font-semibold">
                        {request.meetingFrequency.charAt(0).toUpperCase() +
                          request.meetingFrequency.slice(1)}{' '}
                        meetings
                      </p>
                    </div>
                  </div>

                  {/* Response */}
                  {request.response && (
                    <div className="mb-6 rounded-xl border-2 border-primary-300/50 bg-gradient-to-br from-primary-50/80 to-primary-100/50 p-6 backdrop-blur">
                      <div className="mb-3 text-lg font-bold text-gray-900">
                        Response
                      </div>
                      <p className="text-base text-secondary-700 leading-relaxed">
                        {request.response}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {user?.role === 'mentor' && request.status === 'pending' && (
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setSelectedRequest(request)
                          setResponseForm({ status: 'accepted', response: '' })
                          setShowResponseModal(true)
                        }}
                        className="relative flex-1 flex items-center justify-center gap-3 px-6 py-4 text-base font-bold rounded-xl border-2 border-green-500/50 bg-white/60 backdrop-blur-xl text-green-600 shadow-xl shadow-green-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50 hover:border-green-500/70 hover:bg-white/80 overflow-hidden group/accept"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-green-400/10 to-green-500/10 opacity-0 group-hover/accept:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                        <CheckCircle className="h-5 w-5 relative z-10 group-hover/accept:scale-125 transition-transform duration-300" />
                        <span className="relative z-10">Accept</span>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/accept:opacity-100 group-hover/accept:translate-x-full transition-all duration-1000"></div>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(request)
                          setResponseForm({ status: 'rejected', response: '' })
                          setShowResponseModal(true)
                        }}
                        className="relative flex-1 flex items-center justify-center gap-3 px-6 py-4 text-base font-bold rounded-xl border-2 border-red-500/50 bg-white/60 backdrop-blur-xl text-red-600 shadow-xl shadow-red-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50 hover:border-red-500/70 hover:bg-white/80 overflow-hidden group/decline"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-400/10 to-red-500/10 opacity-0 group-hover/decline:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                        <XCircle className="h-5 w-5 relative z-10 group-hover/decline:scale-125 transition-transform duration-300" />
                        <span className="relative z-10">Decline</span>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/decline:opacity-100 group-hover/decline:translate-x-full transition-all duration-1000"></div>
                      </button>
                    </div>
                  )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedRequest && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="card relative overflow-hidden group/modal w-full max-w-2xl p-10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/modal:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                {responseForm.status === 'accepted' ? 'Accept' : 'Decline'}{' '}
                Request
              </h2>
              <p className="mb-6 text-lg text-secondary-600">
                Send a message to{' '}
                <span className="font-bold text-gray-900">
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
                rows={6}
                className="glass-input mb-6 w-full px-5 py-4 text-base"
                required
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="relative flex-1 flex items-center justify-center gap-3 px-6 py-4 text-base font-bold rounded-xl border-2 border-gray-300/50 bg-white/60 backdrop-blur-xl text-gray-700 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-gray-400/70 hover:bg-white/80 overflow-hidden group/cancel"
                  disabled={submitting}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 via-gray-400/5 to-gray-500/5 opacity-0 group-hover/cancel:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  <span className="relative z-10">Cancel</span>
                </button>
                <button
                  onClick={handleRespond}
                  disabled={submitting || !responseForm.response}
                  className="relative flex-1 flex items-center justify-center gap-3 px-6 py-4 text-base font-bold rounded-xl border-2 border-primary-500/50 bg-white/60 backdrop-blur-xl text-primary-600 shadow-xl shadow-primary-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-500/70 hover:bg-white/80 overflow-hidden group/send disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/send:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  {submitting ? (
                    <>
                      <div className="futuristic-loader-inner w-5 h-5"></div>
                      <span className="relative z-10">Sending...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-5 w-5 relative z-10 group-hover/send:scale-125 transition-transform duration-300" />
                      <span className="relative z-10">Send Response</span>
                    </>
                  )}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/send:opacity-100 group-hover/send:translate-x-full transition-all duration-1000"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
