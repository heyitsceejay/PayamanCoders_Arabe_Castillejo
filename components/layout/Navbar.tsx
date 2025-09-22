'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, User, Briefcase, Users, BookOpen, LogOut, Settings } from 'lucide-react'

interface User {
  firstName: string
  lastName: string
  email: string
  role: string
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(true)
        setUser(data.user)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        setIsAuthenticated(false)
        setUser(null)
        setShowUserMenu(false)
        router.push('/')
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const AuthenticatedNav = () => (
    <>
      <Link href="/jobs" className="flex items-center text-gray-700 hover:text-primary-600">
        <Briefcase className="w-4 h-4 mr-1" />
        Jobs
      </Link>
      <Link href="/career-map" className="flex items-center text-gray-700 hover:text-primary-600">
        <BookOpen className="w-4 h-4 mr-1" />
        Career Map
      </Link>
      <Link href="/community" className="flex items-center text-gray-700 hover:text-primary-600">
        <Users className="w-4 h-4 mr-1" />
        Community
      </Link>
      <Link href="/dashboard" className="flex items-center text-gray-700 hover:text-primary-600">
        <User className="w-4 h-4 mr-1" />
        Dashboard
      </Link>
      
      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 focus:outline-none"
        >
          <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <span className="hidden lg:block">{user?.firstName}</span>
        </button>

        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              <div className="font-medium">{user?.firstName} {user?.lastName}</div>
              <div className="text-gray-500">{user?.email}</div>
            </div>
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setShowUserMenu(false)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Profile Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  )

  const UnauthenticatedNav = () => (
    <>
      <Link href="/jobs" className="flex items-center text-gray-700 hover:text-primary-600">
        <Briefcase className="w-4 h-4 mr-1" />
        Jobs
      </Link>
      <Link href="/career-map" className="flex items-center text-gray-700 hover:text-primary-600">
        <BookOpen className="w-4 h-4 mr-1" />
        Career Map
      </Link>
      <Link href="/community" className="flex items-center text-gray-700 hover:text-primary-600">
        <Users className="w-4 h-4 mr-1" />
        Community
      </Link>
      <Link href="/auth/login" className="btn-primary">
        Sign In
      </Link>
      <Link href="/auth/register" className="btn-secondary">
        Sign Up
      </Link>
    </>
  )

  const MobileAuthenticatedNav = () => (
    <>
      <Link href="/jobs" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
        Jobs
      </Link>
      <Link href="/career-map" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
        Career Map
      </Link>
      <Link href="/community" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
        Community
      </Link>
      <Link href="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
        Dashboard
      </Link>
      <Link href="/profile" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
        Profile Settings
      </Link>
      <div className="border-t pt-2 mt-2">
        <div className="px-3 py-2 text-sm text-gray-500">
          {user?.firstName} {user?.lastName}
        </div>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
        >
          Sign Out
        </button>
      </div>
    </>
  )

  const MobileUnauthenticatedNav = () => (
    <>
      <Link href="/jobs" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
        Jobs
      </Link>
      <Link href="/career-map" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
        Career Map
      </Link>
      <Link href="/community" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
        Community
      </Link>
      <Link href="/auth/login" className="block px-3 py-2 text-primary-600 font-medium">
        Sign In
      </Link>
      <Link href="/auth/register" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
        Sign Up
      </Link>
    </>
  )

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showUserMenu])

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600">WorkQit</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {loading ? (
              <div className="animate-pulse flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            ) : isAuthenticated ? (
              <AuthenticatedNav />
            ) : (
              <UnauthenticatedNav />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ) : isAuthenticated ? (
                <MobileAuthenticatedNav />
              ) : (
                <MobileUnauthenticatedNav />
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}