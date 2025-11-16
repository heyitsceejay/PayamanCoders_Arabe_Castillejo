import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import dbConnect from '@/lib/mongoose'
import Application from '@/models/Application'

export async function GET(request: NextRequest) {
  try {
    console.log('[Dashboard Applications] Starting request...')
    const tokenPayload = await verifyToken(request)
    
    if (!tokenPayload) {
      console.log('[Dashboard Applications] No token payload - unauthorized')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[Dashboard Applications] User authenticated:', tokenPayload.userId)
    await dbConnect()

    // Fetch recent applications for the user
    const applications = await Application.find({ 
      applicantId: tokenPayload.userId 
    })
      .populate('jobId', 'title company location type remote')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    console.log('[Dashboard Applications] Found applications:', applications.length)

    const formattedApplications = applications.map((app: any) => ({
      id: app._id.toString(),
      jobTitle: app.jobId?.title || 'Unknown Position',
      company: app.jobId?.company || 'Unknown Company',
      location: app.jobId?.location,
      jobType: app.jobId?.type,
      remote: app.jobId?.remote,
      status: app.status,
      appliedDate: app.createdAt,
    }))

    return NextResponse.json({
      applications: formattedApplications,
    })
  } catch (error) {
    console.error('[Dashboard Applications] Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch applications',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
