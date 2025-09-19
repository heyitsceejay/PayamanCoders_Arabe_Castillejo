'use client'

import { useState, useEffect } from 'react'
import { Briefcase, Users, TrendingUp, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    offers: 0,
    profile_views: 0,
  })

  useEffect(() => {
    // In a real app, fetch user data and stats from API
    // For now, we'll use mock data
    setStats({
      applications: 12,
      interviews: 3,
      offers: 1,
      profile_views: 45,
    })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening with your job search.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.applications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.interviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Offers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.offers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.profile_views}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Applications</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Frontend Developer</h3>
                <p className="text-sm text-gray-600">TechCorp Inc.</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                Under Review
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">UI/UX Intern</h3>
                <p className="text-sm text-gray-600">Design Studio</p>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                Interview Scheduled
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Marketing Assistant</h3>
                <p className="text-sm text-gray-600">StartupXYZ</p>
              </div>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                Not Selected
              </span>
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended for You</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
              <h3 className="font-medium text-gray-900 mb-1">React Developer Intern</h3>
              <p className="text-sm text-gray-600 mb-2">WebDev Solutions</p>
              <p className="text-sm text-gray-500">Remote • $15-20/hour</p>
              <button className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium">
                View Details →
              </button>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
              <h3 className="font-medium text-gray-900 mb-1">Junior Designer</h3>
              <p className="text-sm text-gray-600 mb-2">Creative Agency</p>
              <p className="text-sm text-gray-500">New York, NY • $18-25/hour</p>
              <button className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium">
                View Details →
              </button>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
              <h3 className="font-medium text-gray-900 mb-1">Content Writer Apprentice</h3>
              <p className="text-sm text-gray-600 mb-2">Media Company</p>
              <p className="text-sm text-gray-500">Remote • $12-16/hour</p>
              <button className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium">
                View Details →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}