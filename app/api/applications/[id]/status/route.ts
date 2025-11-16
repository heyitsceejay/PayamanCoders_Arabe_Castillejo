import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Application from '@/models/Application'
import Notification from '@/models/Notification'
import Conversation from '@/models/Conversation'
import User from '@/models/User'
import Job from '@/models/Job'
import { verifyToken } from '@/lib/auth'

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await verifyToken(req)
    if (!currentUser?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { status, notes } = await req.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const params = await context.params
    const application = await Application.findById(params.id)
      .populate('applicantId', 'firstName lastName email')
      .populate('jobId', 'title company employerId')

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Verify the current user is the employer who posted the job
    if (application.jobId.employerId.toString() !== currentUser.userId) {
      return NextResponse.json(
        { error: 'You are not authorized to update this application' },
        { status: 403 }
      )
    }

    // Update application status
    application.status = status
    if (notes) {
      application.notes = notes
    }
    await application.save()

    // Create notification for applicant
    const notificationMessages: Record<string, string> = {
      accepted: `Congratulations! Your application for ${application.jobId.title} at ${application.jobId.company} has been accepted!`,
      rejected: `Your application for ${application.jobId.title} at ${application.jobId.company} has been reviewed.`,
      shortlisted: `Good news! You've been shortlisted for ${application.jobId.title} at ${application.jobId.company}.`,
      reviewing: `Your application for ${application.jobId.title} at ${application.jobId.company} is being reviewed.`,
    }

    await Notification.create({
      recipient: application.applicantId._id,
      sender: currentUser.userId,
      type: 'comment',
      message: notificationMessages[status] || `Your application status has been updated to ${status}.`,
      read: false,
    })

    // If accepted, automatically create conversation
    if (status === 'accepted') {
      try {
        console.log('Creating conversation for accepted application')
        console.log('Applicant ID:', application.applicantId._id)
        console.log('Employer ID:', currentUser.userId)

        // Check if conversation already exists
        const existingConversation = await Conversation.findOne({
          participants: { $all: [application.applicantId._id, currentUser.userId] },
        })

        console.log('Existing conversation:', existingConversation ? 'Found' : 'Not found')

        if (!existingConversation) {
          const welcomeMessage = `Hi ${application.applicantId.firstName}! Congratulations on your application for ${application.jobId.title}. We'd like to discuss the next steps with you.`

          // Create new conversation with welcome message
          const newConversation = await Conversation.create({
            participants: [application.applicantId._id, currentUser.userId],
            messages: [
              {
                sender: currentUser.userId,
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
      application,
    })
  } catch (error) {
    console.error('Error updating application status:', error)
    return NextResponse.json(
      { error: 'Failed to update application status' },
      { status: 500 }
    )
  }
}
