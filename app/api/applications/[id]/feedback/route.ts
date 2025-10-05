import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import Application from '@/models/Application'
import Job from '@/models/Job'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = cookies().get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let payload: any
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || '')
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userId = String(payload?.id || payload?.userId || payload?.sub)
    const role = payload?.role

    if (role !== 'employer') {
      return NextResponse.json({ error: 'Forbidden: only employers can submit feedback' }, { status: 403 })
    }

    const applicationId = params.id
    if (!mongoose.isValidObjectId(applicationId)) {
      return NextResponse.json({ error: 'Invalid application id' }, { status: 400 })
    }

    // connect if not connected
    if (!mongoose.connection || mongoose.connection.readyState === 0) {
      const uri = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI || ''
      if (!uri) {
        return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
      }
      await mongoose.connect(uri)
    }

    const body = await req.json()
    const rating = Number(body.rating)
    const comments = (body.comments || '').trim()
    const skills_assessment = Array.isArray(body.skills_assessment) ? body.skills_assessment : []

    // basic validation
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 })
    }
    if (!comments) {
      return NextResponse.json({ error: 'Comments are required' }, { status: 400 })
    }

    const application = await Application.findById(applicationId).populate('jobId')
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // ensure the current employer owns the job
    const job: any = application.jobId
    if (!job || String(job.employerId) !== userId) {
      return NextResponse.json({ error: 'Forbidden: not the employer for this job' }, { status: 403 })
    }

    // append feedback entry
    const feedbackEntry = {
      rating,
      comments,
      skills_assessment,
      employerId: new mongoose.Types.ObjectId(userId),
      createdAt: new Date(),
    }

    application.feedbacks = application.feedbacks || []
    application.feedbacks.push(feedbackEntry)
    // mark reviewed if not already
    if (application.status === 'pending') {
      application.status = 'reviewed'
    }

    await application.save()

    // send notification to applicant via existing notifications route
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_VERCEL_URL ||
      'http://localhost:3000'

    try {
      await fetch(`${baseUrl.replace(/\/$/, '')}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: String(application.applicantId),
          title: 'New feedback on your application',
          message: `You received ${rating} star(s) feedback: ${comments.slice(0, 200)}`,
          metadata: { applicationId, rating },
        }),
      })
    } catch (notifErr) {
      // notification failure doesn't block feedback save - log server-side
      console.error('Notification send failed:', notifErr)
    }

    return NextResponse.json({ success: true, application }, { status: 200 })
  } catch (err) {
    console.error('Feedback route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}