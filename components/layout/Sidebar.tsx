'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  Home,
  Briefcase,
  FileText,
  BookOpen,
  Users,
  Video,
  Award,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Target,
  MessageCircle,
  TrendingUp,
  Calendar,
  Building2,
  UserPlus,
  Shield,
  BarChart3
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[]
  badge?: string
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Don't render sidebar if user is not authenticated
  if (!user) {
    return null
  }

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname?.startsWith(path)
  }

  const navItems: NavItem[] = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Jobs', href: '/jobs', icon: Briefcase },
    { 
      label: 'Resume Builder', 
      href: '/resume-builder', 
      icon: FileText,
      roles: ['job_seeker']
    },
    { 
      label: 'My Applications', 
      href: '/applications', 
      icon: Target,
      roles: ['job_seeker']
    },
    { label: 'Career Map', href: '/career-map', icon: TrendingUp },
    { label: 'Webinars', href: '/webinars', icon: Video },
    { label: 'Mentors', href: '/mentors', icon: Users },
    { 
      label: 'My Mentorship', 
      href: '/my-mentorship', 
      icon: UserPlus,
      roles: ['job_seeker', 'student']
    },
    { 
      label: 'Mentorship Requests', 
      href: '/mentorship/requests', 
      icon: Users,
      roles: ['mentor']
    },
    { label: 'Community', href: '/community', icon: MessageCircle },
    { 
      label: 'Assessments', 
      href: '/assessments', 
      icon: Award,
      roles: ['job_seeker', 'student']
    },
    { 
      label: 'Certificates', 
      href: '/certificates', 
      icon: Award,
      roles: ['job_seeker', 'student']
    },
    { 
      label: 'Resources', 
      href: '/resources', 
      icon: BookOpen,
      roles: ['mentor', 'admin']
    },
    { 
      label: 'Post Job', 
      href: '/jobs/new', 
      icon: Building2,
      roles: ['employer']
    },
    { 
      label: 'Verification', 
      href: '/verification', 
      icon: Shield,
      roles: ['admin']
    },
    { 
      label: 'Analytics', 
      href: '/admin/analytics', 
      icon: BarChart3,
      roles: ['admin', 'employer']
    },
  ]

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true
    return user?.role && item.roles.includes(user.role)
  })

  const handleLogout = async () => {
    await logout()
    setIsMobileOpen(false)
  }

  const SidebarContent = () => (
    <>
      {/* Logo/Brand */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-white/30`}>
        {!isCollapsed && (
          <Link href="/" className="brand-logo text-xl">
            WorkQit
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-primary-100 transition-colors text-secondary-600 hover:text-primary-600"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-3 pt-4 space-y-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${active 
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/25' 
                  : 'text-secondary-700 hover:bg-primary-50 hover:text-primary-600'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${active ? '' : 'group-hover:scale-110 transition-transform'}`} />
              {!isCollapsed && (
                <span className="font-medium text-sm truncate">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow-sm">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-white/30 space-y-1">
        <Link
          href="/settings"
          onClick={() => setIsMobileOpen(false)}
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
            text-secondary-700 hover:bg-primary-50 hover:text-primary-600
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} group-hover:scale-110 transition-transform`} />
          {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
        </Link>
        
        {user && (
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              text-secondary-700 hover:bg-red-50 hover:text-red-600
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} group-hover:scale-110 transition-transform`} />
            {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col
          fixed left-0 top-0 h-screen
          bg-white/60 backdrop-blur-2xl border-r border-white/30
          shadow-lg shadow-primary-900/10 transition-all duration-300 z-40
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`
          lg:hidden flex flex-col
          fixed left-0 top-0 h-screen w-64 sm:w-72
          bg-white/80 backdrop-blur-2xl border-r border-white/30
          shadow-2xl transition-transform duration-300 z-50
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <SidebarContent />
      </aside>

      {/* Spacer for desktop */}
      <div className={`hidden lg:block transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`} />
    </>
  )
}
