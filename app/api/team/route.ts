import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    const tokenPayload = await verifyToken(request)
    
    if (!tokenPayload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Get current user
    const currentUser = await User.findById(tokenPayload.userId)
    if (!currentUser || currentUser.role !== 'employer') {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 })
    }

    // For now, return mock data since we don't have a team model yet
    // In a real implementation, you'd have a Team model with members
    const teamMembers = [
      {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'recruiter',
        joinedAt: new Date().toISOString(),
        status: 'active'
      },
      {
        _id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        role: 'hiring_manager',
        joinedAt: new Date().toISOString(),
        status: 'active'
      }
    ]

    return NextResponse.json({ teamMembers })
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}