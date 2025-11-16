'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function TestMentorshipPage() {
  const { user } = useAuth()
  const [mentors, setMentors] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchMentors()
    fetchRequests()
  }, [])

  const fetchMentors = async () => {
    try {
      const response = await fetch('/api/mentors')
      if (response.ok) {
        const data = await response.json()
        setMentors(data.mentors || [])
      }
    } catch (error) {
      console.error('Error fetching mentors:', error)
    }
  }

  const fetchRequests = async () => {
    try {
      const type = user?.role === 'mentor' ? 'received' : 'sent'
      const response = await fetch(`/api/mentorship/request?type=${type}`)
      console.log('Fetch requests response:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Requests data:', data)
        setRequests(data.requests || [])
      } else {
        const errorData = await response.json()
        console.error('Error fetching requests:', errorData)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const sendRequest = async (mentorId: string) => {
    if (user?._id === mentorId) {
      setMessage('Error: You cannot send a mentorship request to yourself!')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/mentorship/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId,
          message: 'Test mentorship request - I would love to learn from you!',
          goals: ['Career growth', 'Skill development'],
          preferredTopics: ['React', 'Career advice'],
          meetingFrequency: 'monthly',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessage('✅ Request sent successfully!')
        console.log('Request created:', data)
        fetchRequests()
      } else {
        const errorData = await response.json()
        setMessage(`❌ Error: ${errorData.error}`)
        console.error('Error:', errorData)
      }
    } catch (error) {
      console.error('Error sending request:', error)
      setMessage('❌ Failed to send request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Test Mentorship System</h1>

        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Current User</h2>
          <div className="mb-4 rounded-lg bg-blue-50 p-4">
            <p className="font-semibold text-blue-900">
              {user?.firstName} {user?.lastName} ({user?.email})
            </p>
            <p className="text-sm text-blue-700">
              Role: <span className="font-semibold uppercase">{user?.role}</span>
            </p>
            <p className="text-xs text-blue-600 mt-2">
              {user?.role === 'mentor' 
                ? '⚠️ You are a MENTOR - you can only RECEIVE requests, not send them. Log in as a job seeker to send requests.'
                : '✅ You are a JOB SEEKER - you can send mentorship requests to mentors.'}
            </p>
          </div>
          <details className="text-sm">
            <summary className="cursor-pointer font-medium text-gray-700">View full user object</summary>
            <pre className="mt-2 rounded bg-gray-100 p-4 text-xs overflow-auto max-h-96">
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
        </div>

        {message && (
          <div className="mb-4 rounded-lg bg-blue-100 p-4 text-blue-900">
            {message}
          </div>
        )}

        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Available Mentors ({mentors.length})
          </h2>
          <div className="space-y-4">
            {mentors.map((mentor) => (
              <div
                key={mentor._id}
                className="flex items-center justify-between rounded border p-4"
              >
                <div>
                  <p className="font-semibold">
                    {mentor.firstName} {mentor.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{mentor.email}</p>
                  <p className="text-xs text-gray-500">ID: {mentor._id}</p>
                </div>
                <button
                  onClick={() => sendRequest(mentor._id)}
                  disabled={loading || user?.role === 'mentor' || user?._id === mentor._id}
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  title={
                    user?.role === 'mentor' 
                      ? 'Mentors cannot send requests' 
                      : user?._id === mentor._id 
                      ? 'Cannot request yourself' 
                      : 'Send mentorship request'
                  }
                >
                  {user?._id === mentor._id ? 'You' : 'Send Request'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            {user?.role === 'mentor' ? 'Requests I Received' : 'Requests I Sent'} ({requests.length})
          </h2>
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="rounded-lg bg-gray-50 p-8 text-center">
                <p className="text-gray-500 mb-2">No requests found</p>
                <p className="text-sm text-gray-400">
                  {user?.role === 'mentor' 
                    ? 'No one has requested you as a mentor yet. Job seekers can find you on the /mentors page.'
                    : 'You haven\'t sent any mentorship requests yet. Find mentors on the /mentors page.'}
                </p>
              </div>
            ) : (
              requests.map((request) => (
                <div key={request._id} className="rounded border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold">
                      {user?.role === 'mentor'
                        ? `From: ${request.mentee?.firstName} ${request.mentee?.lastName}`
                        : `To: ${request.mentor?.firstName} ${request.mentor?.lastName}`}
                    </p>
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold ${
                        request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : request.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{request.message}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    Created: {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
