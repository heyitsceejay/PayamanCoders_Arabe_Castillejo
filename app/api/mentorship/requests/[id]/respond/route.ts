import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import MentorshipRequest from '@/models/MentorshipRequest'
import Notification from '@/models/Notification'
import { verifyToken } from '@/lib/auth'

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await verifyToken(req)
    if (!currentUser?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { status, response } = await req.json()

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "accepted" or "rejected"' },
        { status: 400 }
      )
    }

    const params = await context.params
    const mentorshipRequest = await MentorshipRequest.findById(params.id)
      .populate('mentee', 'firstName lastName email')
      .populate('mentor', 'firstName lastName email')

    if (!mentorshipRequest) {
      return NextResponse.json(
        { error: 'Mentorship request not found' },
        { status: 404 }
      )
    }

    // Verify the current user is the mentor
    if (mentorshipRequest.mentor._id.toString() !== currentUser.userId) {
      return NextResponse.json(
        { error: 'You are not authorized to respond to this request' },
        { status: 403 }
      )
    }

    // Update request
    mentorshipRequest.status = status
    mentorshipRequest.response = response
    mentorshipRequest.respondedAt = new Date()
    await mentorshipRequest.save()

    // Create notification for mentee
    const notificationMessage =
      status === 'accepted'
        ? `${mentorshipRequest.mentor.firstName} ${mentorshipRequest.mentor.lastName} has accepted your mentorship request!`
        : `${mentorshipRequest.mentor.firstName} ${mentorshipRequest.mentor.lastName} has declined your mentorship request`

    await Notification.create({
      recipient: mentorshipRequest.mentee._id,
      sender: currentUser.userId,
      type: 'mentorship_response',
      message: notificationMessage,
      read: false,
    })

    return NextResponse.json({
      success: true,
      request: mentorshipRequest,
    })
  } catch (error) {
    console.error('Error responding to mentorship request:', error)
    return NextResponse.json(
      { error: 'Failed to respond to mentorship request' },
      { status: 500 }
    )
  }
}
