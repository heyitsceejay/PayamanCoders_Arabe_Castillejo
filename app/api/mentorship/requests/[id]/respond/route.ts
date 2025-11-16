import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import MentorshipRequest from '@/models/MentorshipRequest'
import Notification from '@/models/Notification'
import Conversation from '@/models/Conversation'
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

    // If accepted, automatically create conversation
    if (status === 'accepted') {
      try {
        console.log('Creating conversation for accepted mentorship request')
        console.log('Mentee ID:', mentorshipRequest.mentee._id)
        console.log('Mentor ID:', mentorshipRequest.mentor._id)

        // Check if conversation already exists
        const existingConversation = await Conversation.findOne({
          participants: { $all: [mentorshipRequest.mentee._id, mentorshipRequest.mentor._id] },
        })

        console.log('Existing conversation:', existingConversation ? 'Found' : 'Not found')

        if (!existingConversation) {
          const welcomeMessage = `Hi ${mentorshipRequest.mentee.firstName}! I'm excited to be your mentor. ${response || "Let's start our mentorship journey together!"}`
          
          // Create new conversation with welcome message
          const newConversation = await Conversation.create({
            participants: [mentorshipRequest.mentee._id, mentorshipRequest.mentor._id],
            messages: [
              {
                sender: mentorshipRequest.mentor._id,
                content: welcomeMessage,
                read: false,
                createdAt: new Date(),
              },
            ],
            lastMessage: welcomeMessage.substring(0, 100),
            lastMessageAt: new Date(),
          })

          console.log('Conversation created successfully:', newConversation._id)
        } else {
          console.log('Conversation already exists, skipping creation')
        }
      } catch (convError) {
        console.error('Error creating conversation:', convError)
        // Don't fail the whole request if conversation creation fails
      }
    }

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
