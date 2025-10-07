import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { generateVerificationToken, getVerificationTokenExpiry, sendVerificationEmail } from '@/lib/email'
import { validatePassword } from '@/lib/password-validation'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { email, password, firstName, lastName, role } = await request.json()

    // Validate input
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 400 }
        )
      } else {
        // User exists but email not verified - resend verification
        const verificationToken = generateVerificationToken()
        const verificationExpires = getVerificationTokenExpiry()

        await User.findByIdAndUpdate(existingUser._id, {
          emailVerificationToken: verificationToken,
          emailVerificationExpires: verificationExpires,
        })

        await sendVerificationEmail(email, verificationToken, firstName)

        return NextResponse.json(
          { 
            message: 'Account exists but email not verified. Verification email resent.',
            requiresVerification: true 
          },
          { status: 200 }
        )
      }
    }

    // Validate password is provided
    if (!password) {
      return NextResponse.json(
        { 
          error: 'Password is required',
          passwordRequirements: [
            'At least 12 characters long',
            'At least one uppercase letter (A-Z)',
            'At least one lowercase letter (a-z)',
            'At least one numeric digit (0-9)',
            'At least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)',
            'Must not contain your username or email',
            'Must not contain common dictionary words',
            'Must not contain more than 3 repeated characters',
            'Must not contain sequential characters (e.g., 123, abc)'
          ]
        },
        { status: 400 }
      )
    }

    // Validate password strength and requirements
    const username = email.split('@')[0] // Use email local part as username for validation
    const passwordValidation = validatePassword(password, username, email)
    
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Password does not meet security requirements',
          passwordErrors: passwordValidation.errors,
          passwordRequirements: [
            'At least 12 characters long',
            'At least one uppercase letter (A-Z)',
            'At least one lowercase letter (a-z)',
            'At least one numeric digit (0-9)',
            'At least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)',
            'Must not contain your username or email',
            'Must not contain common dictionary words',
            'Must not contain more than 3 repeated characters',
            'Must not contain sequential characters (e.g., 123, abc)'
          ]
        },
        { status: 400 }
      )
    }

    // Hash password with higher cost for better security
    const hashedPassword = await bcrypt.hash(password, 14)

    // Generate email verification token
    const verificationToken = generateVerificationToken()
    const verificationExpires = getVerificationTokenExpiry()

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      role: role || 'job_seeker',
      authProvider: 'local',
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
      passwordChangedAt: new Date(), // Track when password was set
    })

    // Send verification email
    await sendVerificationEmail(email, verificationToken, firstName)

    // Remove sensitive data from response
    const { password: _, emailVerificationToken: __, ...userWithoutSensitiveData } = user.toObject()

    return NextResponse.json(
      { 
        message: 'Account created successfully. Please check your email to verify your account.',
        user: userWithoutSensitiveData,
        requiresVerification: true
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}