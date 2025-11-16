'use client'

import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, XCircle, LogOut } from 'lucide-react'

export default function AuthDebug() {
  const { user, loading, error, logout } = useAuth()

  if (loading) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999] bg-gradient-to-br from-yellow-50/95 to-amber-50/95 border-2 border-yellow-400/60 text-yellow-900 px-6 py-4 rounded-2xl shadow-2xl shadow-yellow-500/40 backdrop-blur-xl">
        <div className="text-base font-bold">Auth Status: Loading...</div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] bg-white/95 border-2 border-primary-500/50 text-gray-900 px-6 py-5 rounded-2xl shadow-2xl shadow-primary-500/30 backdrop-blur-xl max-w-sm min-w-[280px]">
      <div className="text-base">
        <div className="font-bold text-lg mb-3 text-primary-600 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
          Auth Debug
        </div>
        {user ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <CheckCircle className="w-5 h-5" />
              Authenticated
            </div>
            <div className="text-sm space-y-1.5 pt-2 border-t border-gray-200">
              <div className="font-semibold text-gray-700">Name: <span className="font-normal text-gray-900">{user.firstName} {user.lastName}</span></div>
              <div className="font-semibold text-gray-700">Role: <span className="font-normal text-gray-900 capitalize">{user.role}</span></div>
              <div className="font-semibold text-gray-700">Email: <span className="font-normal text-gray-900 break-all">{user.email}</span></div>
            </div>
            <button 
              onClick={logout}
              className="mt-3 w-full flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 hover:scale-105 transition-all duration-300 shadow-lg shadow-red-500/30 font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-600 font-semibold">
            <XCircle className="w-5 h-5" />
            Not authenticated
          </div>
        )}
        {error && (
          <div className="text-red-600 text-sm mt-3 pt-2 border-t border-red-200 font-medium">Error: {error}</div>
        )}
      </div>
    </div>
  )
}