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

    // Check if user is an employer
    const userProfile = await User.findById(user.userId).select('verification role')
    if (!userProfile || userProfile.role !== 'employer') {
      return NextResponse.json(
        { error: 'Only employers can access verification data' },
        { status: 403 }
      )
    }

    // Calculate verification requirements
    const fullUser = await User.findById(user.userId)
    const requirements = {
      businessDocuments: !!fullUser?.verification?.documents?.length,
      companyProfile: !!(fullUser?.profile?.bio && fullUser?.profile?.location),
      contactVerification: !!fullUser?.email,
      addressVerification: !!fullUser?.address,
    }

    const missingItems: string[] = []
    const recommendations: string[] = []

    if (!requirements.businessDocuments) {
      missingItems.push('Upload business registration documents')
    }
    if (!requirements.companyProfile) {
      missingItems.push('Complete your company profile with bio and location')
    }
    if (!requirements.contactVerification) {
      missingItems.push('Verify your contact email')
    }
    if (!requirements.addressVerification) {
      missingItems.push('Add your company address')
    }

    // Add recommendations based on status
    if (userProfile.verification?.status === 'verified') {
      recommendations.push('Keep your company profile updated')
      recommendations.push('Respond to applicants promptly to maintain trust score')
    } else if (userProfile.verification?.status === 'pending') {
      recommendations.push('Our team is reviewing your verification documents')
      recommendations.push('This usually takes 1-3 business days')
    } else {
      recommendations.push('Complete all requirements to start the verification process')
      recommendations.push('Verified employers get 3x more applications')
    }

    return NextResponse.json({
      verification: {
        status: userProfile.verification?.status || 'unverified',
        trustScore: userProfile.verification?.trustScore || 0,
        verifiedAt: userProfile.verification?.verifiedAt,
        submittedAt: userProfile.verification?.submittedAt,
        requirements,
        missingItems,
        recommendations,
      }
    })

  } catch (error) {
    console.error('Employer verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
