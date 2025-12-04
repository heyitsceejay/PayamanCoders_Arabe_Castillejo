'use client'

import { useState, useEffect } from 'react'
import { Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function MentorshipAvailabilityToggle() {
  const [isAvailable, setIsAvailable] = useState(true)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    try {
      const response = await fetch('/api/mentor/availability')
      if (response.ok) {
        const data = await response.json()
        setIsAvailable(data.isAvailable)
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAvailability = async () => {
    try {
      setUpdating(true)
      setError('')
      
      const response = await fetch('/api/mentor/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !isAvailable })
      })

      if (response.ok) {
        const data = await response.json()
        setIsAvailable(data.isAvailable)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update availability')
      }
    } catch (error) {
      console.error('Failed to update availability:', error)
      setError('Failed to update availability')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="p-6">
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card relative overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
              isAvailable 
                ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30' 
                : 'bg-gradient-to-br from-gray-500/20 to-gray-600/20 border border-gray-500/30'
            }`}>
              <Users className={`w-6 h-6 ${isAvailable ? 'text-green-600' : 'text-gray-600'}`} />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Mentorship Requests</h3>
              <p className="text-sm text-secondary-600">
                {isAvailable 
                  ? 'You are accepting new mentorship requests' 
                  : 'You are not accepting new requests'}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={toggleAvailability}
            disabled={updating}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 ${
              isAvailable ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                isAvailable ? 'translate-x-7' : 'translate-x-1'
              }`}
            >
              {updating ? (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-purple-600"></div>
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  {isAvailable ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              )}
            </span>
          </button>
        </div>

        {/* Status Message */}
        <div className={`mt-4 p-3 rounded-lg border transition-all duration-300 ${
          isAvailable 
            ? 'bg-green-50 border-green-200' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-start gap-2">
            {isAvailable ? (
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${isAvailable ? 'text-green-800' : 'text-gray-700'}`}>
              {isAvailable 
                ? 'Students and job seekers can send you mentorship requests. You can review and accept/decline each request individually.' 
                : 'Your profile is hidden from mentorship search. Existing mentees are not affected.'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
