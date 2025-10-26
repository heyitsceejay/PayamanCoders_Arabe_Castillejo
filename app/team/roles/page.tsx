'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Role {
  id: string
  name: string
  displayName: string
  description: string
  permissions: string[]
}

interface TeamMember {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

export default function RolesManagementPage() {
  const [roles] = useState<Role[]>([
    {
      id: 'recruiter',
      name: 'recruiter',
      displayName: 'Recruiter',
      description: 'Can post jobs, review applications, and schedule interviews',
      permissions: ['view_applications', 'post_jobs', 'schedule_interviews', 'contact_candidates']
    },
    {
      id: 'hiring_manager',
      name: 'hiring_manager',
      displayName: 'Hiring Manager',
      description: 'Can review applications, make hiring decisions, and manage job postings',
      permissions: ['view_applications', 'post_jobs', 'make_hiring_decisions', 'manage_team', 'schedule_interviews']
    },
    {
      id: 'hr_admin',
      name: 'hr_admin',
      displayName: 'HR Admin',
      description: 'Full access to all HR functions and team management',
      permissions: ['full_access', 'manage_team', 'view_analytics', 'system_settings']
    }
  ])

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingRole, setUpdatingRole] = useState<string | null>(null)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team')
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data.teamMembers || [])
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateMemberRole = async (memberId: string, newRole: string) => {
    setUpdatingRole(memberId)
    
    try {
      const response = await fetch(`/api/team/${memberId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        fetchTeamMembers()
        alert('Role updated successfully!')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update role')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Failed to update role')
    } finally {
      setUpdatingRole(null)
    }
  }

  const getPermissionDescription = (permission: string) => {
    const descriptions: { [key: string]: string } = {
      'view_applications': 'View and review job applications',
      'post_jobs': 'Create and manage job postings',
      'schedule_interviews': 'Schedule and manage interviews',
      'contact_candidates': 'Contact and communicate with candidates',
      'make_hiring_decisions': 'Make final hiring decisions',
      'manage_team': 'Invite and manage team members',
      'view_analytics': 'Access hiring analytics and reports',
      'system_settings': 'Modify system settings and configurations',
      'full_access': 'Complete access to all system features'
    }
    return descriptions[permission] || permission
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading roles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
              <p className="mt-2 text-gray-600">
                Manage team member roles and permissions
              </p>
            </div>
            <Link
              href="/team"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back to Team
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Roles */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Available Roles</h2>
            </div>
            <div className="p-6 space-y-6">
              {roles.map((role) => (
                <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{role.displayName}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {teamMembers.filter(m => m.role === role.name).length} members
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions:</h4>
                    <ul className="space-y-1">
                      {role.permissions.map((permission) => (
                        <li key={permission} className="text-sm text-gray-600 flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {getPermissionDescription(permission)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Member Roles */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Team Member Roles</h2>
            </div>
            <div className="p-6">
              {teamMembers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No team members</h3>
                  <p className="text-gray-600 mb-4">Invite team members to assign roles</p>
                  <Link
                    href="/team"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Invite Members
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={member.role}
                          onChange={(e) => updateMemberRole(member._id, e.target.value)}
                          disabled={updatingRole === member._id}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.name}>
                              {role.displayName}
                            </option>
                          ))}
                        </select>
                        {updatingRole === member._id && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}