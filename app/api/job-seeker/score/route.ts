import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import { verifyToken } from '@/lib/auth'
import { calculateJobSeekerScore, updateJobSeekerScore } from '@/services/jobSeekerScoring'

/**
 * GET /api/job-seeker/score
 * Get current job seeker score
 */
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

    const userId = user.userId

    // Check if user is job seeker or student
    if (user.role !== 'job_seeker' && user.role !== 'student') {
      return NextResponse.json(
        { error: 'Scoring is only available for job seekers and students' },
        { status: 403 }
      )
    }

    const result = await calculateJobSeekerScore(userId)
    
    return NextResponse.json({
      success: true,
      score: result
    })
  } catch (error: any) {
    console.error('Score calculation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to calculate score' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/job-seeker/score
 * Recalculate and update job seeker score
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = user.userId

    // Check if user is job seeker or student
    if (user.role !== 'job_seeker' && user.role !== 'student') {
      return NextResponse.json(
        { error: 'Scoring is only available for job seekers and students' },
        { status: 403 }
      )
    }

    const result = await updateJobSeekerScore(userId)
    
    return NextResponse.json({
      success: true,
      message: 'Score updated successfully',
      score: result
    })
  } catch (error: any) {
    console.error('Score update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update score' },
      { status: 500 }
    )
  }
}
