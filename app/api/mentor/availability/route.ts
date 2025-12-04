import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userProfile = await User.findById(user.userId).select('role mentorshipAvailable')
    if (!userProfile || userProfile.role !== 'mentor') {
      return NextResponse.json(
        { error: 'Only mentors can access this endpoint' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      isAvailable: userProfile.mentorshipAvailable !== false // Default to true if not set
    })

  } catch (error) {
    console.error('Get availability error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userProfile = await User.findById(user.userId)
    if (!userProfile || userProfile.role !== 'mentor') {
      return NextResponse.json(
        { error: 'Only mentors can update availability' },
        { status: 403 }
      )
    }

    const { isAvailable } = await request.json()

    if (typeof isAvailable !== 'boolean') {
      return NextResponse.json(
        { error: 'isAvailable must be a boolean' },
        { status: 400 }
      )
    }

    userProfile.mentorshipAvailable = isAvailable
    await userProfile.save()

    return NextResponse.json({
      isAvailable: userProfile.mentorshipAvailable,
      message: isAvailable 
        ? 'You are now accepting mentorship requests' 
        : 'You are no longer accepting new mentorship requests'
    })

  } catch (error) {
    console.error('Update availability error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
