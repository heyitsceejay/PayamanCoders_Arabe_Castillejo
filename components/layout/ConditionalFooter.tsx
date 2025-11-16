'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  const { user } = useAuth()
  
  // Don't show footer if user is logged in (they see role-based homepage)
  if (user) {
    return null
  }
  
  // Only show footer on landing page (root path) for non-logged-in users
  if (pathname !== '/') {
    return null
  }
  
  return <Footer />
}
