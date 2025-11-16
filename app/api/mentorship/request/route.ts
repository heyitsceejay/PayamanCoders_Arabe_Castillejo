import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import MentorshipRequest from '@/models/MentorshipRequest'
import Notification from '@/models/Notification'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const currentUser = await verifyToken(req)
    if (!currentUser?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { mentorId, message, goals, preferredTopics, meetingFrequency } =
      await req.json()

    if (!mentorId || !message) {
      return NextResponse.json(
        { error: 'Mentor ID and message are required' },
        { status: 400 }
      )
    }

    // Verify mentor exists and is actually a mentor
    const mentor = await User.findById(mentorId)
    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
    }

    if (mentor.role !== 'mentor') {
      return NextResponse.json(
        { error: 'User is not a mentor' },
        { status: 400 }
      )
    }

    // Check if there's already a pending request
    const existingRequest = await MentorshipRequest.findOne({
      mentee: currentUser.userId,
      mentor: mentorId,
      status: 'pending',
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending request with this mentor' },
        { status: 400 }
      )
    }

    // Create mentorship request
    const mentorshipRequest = await MentorshipRequest.create({
      mentee: currentUser.userId,
      mentor: mentorId,
      message,
      goals: goals || [],
      preferredTopics: preferredTopics || [],
      meetingFrequency: meetingFrequency || 'monthly',
      status: 'pending',
    })

    // Populate mentee info for notification
    await mentorshipRequest.populate('mentee', 'firstName lastName email')

    // Create notification for mentor
    await Notification.create({
      recipient: mentorId,
      sender: currentUser.userId,
      type: 'mentorship_request',
      message: `${mentorshipRequest.mentee.firstName} ${mentorshipRequest.mentee.lastName} has requested you as their mentor`,
      read: false,
    })

    return NextResponse.json({
      success: true,
      request: mentorshipRequest,
    })
  } catch (error) {
    console.error('Error creating mentorship request:', error)
    return NextResponse.json(
      { error: 'Failed to create mentorship request' },
      { status: 500 }
    )
  }
}

// Get mentorship requests (for mentors to see incoming requests)
export async function GET(req: NextRequest) {
  try {
    const currentUser = await verifyToken(req)
    console.log('GET mentorship requests - currentUser:', currentUser)
    
    if (!currentUser?.userId) {
      console.log('Unauthorized - no userId')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') // 'received' or 'sent'
    console.log('Request type:', type, 'userId:', currentUser.userId)

    // First, let's check all requests to debug
    const allRequests = await MentorshipRequest.find({})
    console.log('Total requests in DB:', allRequests.length)
    if (allRequests.length > 0) {
      console.log('Sample request:', {
        mentee: allRequests[0].mentee,
        mentor: allRequests[0].mentor,
        menteeType: typeof allRequests[0].mentee,
        mentorType: typeof allRequests[0].mentor,
      })
    }

    let query: any = {}

    if (type === 'received') {
      // Requests received by mentor
      query.mentor = currentUser.userId
    } else if (type === 'sent') {
      // Requests sent by mentee
      query.mentee = currentUser.userId
    } else {
      // Default: show both
      query.$or = [
        { mentor: currentUser.userId },
        { mentee: currentUser.userId },
      ]
    }

    console.log('Query:', JSON.stringify(query))

    const requests = await MentorshipRequest.find(query)
      .populate('mentee', 'firstName lastName email profile')
      .populate('mentor', 'firstName lastName email profile')
      .sort({ createdAt: -1 })

    console.log('Found requests:', requests.length)
    if (requests.length > 0) {
      console.log('First request:', requests[0])
    }

    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Error fetching mentorship requests:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json(
      { error: 'Failed to fetch mentorship requests', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
