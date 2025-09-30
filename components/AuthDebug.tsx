'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function AuthDebug() {
  const { user, loading, error, logout } = useAuth()

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg shadow-lg">
        <div className="text-sm font-medium">Auth Status: Loading...</div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow-lg max-w-xs">
      <div className="text-sm">
        <div className="font-medium mb-2">Auth Debug</div>
        {user ? (
          <div>
            <div className="text-green-600">✓ Authenticated</div>
            <div>Name: {user.firstName} {user.lastName}</div>
            <div>Role: {user.role}</div>
            <div>Email: {user.email}</div>
            <button 
              onClick={logout}
              className="mt-2 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="text-red-600">✗ Not authenticated</div>
        )}
        {error && (
          <div className="text-red-600 text-xs mt-1">Error: {error}</div>
        )}
      </div>
    </div>
  )
}