'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, User, Briefcase, Users, BookOpen } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

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
          <div className="hidden md:flex items-center space-x-8">
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
            <Link href="/auth/login" className="btn-primary">
              Sign In
            </Link>
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
              <Link href="/auth/login" className="block px-3 py-2 text-primary-600 font-medium">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}