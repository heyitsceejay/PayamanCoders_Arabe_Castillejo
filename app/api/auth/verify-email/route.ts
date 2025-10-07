import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // First, try to find user with this verification token (active verification)
    let user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    })

    if (user) {
      // User found with valid token - verify them
      await User.findByIdAndUpdate(user._id, {
        emailVerified: true,
        $unset: {
          emailVerificationToken: 1,
          emailVerificationExpires: 1
        }
      })

      return NextResponse.json(
        { message: 'Email verified successfully! You can now log in.' },
        { status: 200 }
      )
    }

    // If no user found with active token, check if token exists but expired
    const expiredUser = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $lte: new Date() }
    })

    if (expiredUser) {
      return NextResponse.json(
        { 
          error: 'Verification token has expired',
          expired: true,
          email: expiredUser.email
        },
        { status: 400 }
      )
    }

    // Check if there's a user who might have already been verified with this token
    // (This is a fallback check - in practice, tokens are removed after verification)
    const allUsers = await User.find({})
    const possiblyVerifiedUser = allUsers.find(u => u.emailVerified && u.email)

    // If we can't find the token anywhere, it might be:
    // 1. Already used (user is verified)
    // 2. Invalid token
    // 3. User doesn't exist
    
    // Let's provide a more helpful error message
    return NextResponse.json(
      { 
        error: 'This verification link is no longer valid. This usually means your email has already been verified or the link has expired.',
        alreadyVerified: true
      },
      { status: 400 }
    )

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Generate new verification token
    const { generateVerificationToken, getVerificationTokenExpiry, sendVerificationEmail } = await import('@/lib/email')
    
    const verificationToken = generateVerificationToken()
    const verificationExpires = getVerificationTokenExpiry()

    // Update user with new verification token
    await User.findByIdAndUpdate(user._id, {
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    })

    // Send verification email
    await sendVerificationEmail(email, verificationToken, user.firstName)

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}