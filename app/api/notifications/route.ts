import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Mock notifications for now - in a real app, these would come from a database
    const notifications = [
      {
        id: '1',
        message: 'New job match found for your skills in Web Development',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false,
        type: 'job_match'
      },
      {
        id: '2',
        message: 'Application status updated for Frontend Developer role at TechCorp',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        read: false,
        type: 'application_update'
      },
      {
        id: '3',
        message: 'Profile viewed by 3 employers this week',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: true,
        type: 'profile_view'
      },
      {
        id: '4',
        message: 'New mentorship opportunity available in your field',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        read: true,
        type: 'mentorship'
      },
      {
        id: '5',
        message: 'Reminder: Complete your profile to get better job matches',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        read: true,
        type: 'reminder'
      }
    ]

    return NextResponse.json({
      notifications,
      unreadCount: notifications.filter(n => !n.read).length
    })

  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}