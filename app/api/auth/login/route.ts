import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { studentManagementService } from '@/services/studentManagementService'

export async function POST(request: NextRequest) {
  console.log('🔐 Login API called')
  
  try {
    console.log('📡 Connecting to database...')
    await dbConnect()
    console.log('✅ Database connected')
    
    const body = await request.json()
    console.log('📨 Request body received:', { email: body.email, passwordLength: body.password?.length })
    
    const { email, password } = body

    if (!email || !password) {
      console.log('❌ Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('🔍 Looking for user with email:', email)
    // Find user
    let user = await User.findOne({ email: email.toLowerCase() })
    
    // If user not found, check student management system
    if (!user) {
      console.log('❌ User not found in local database')
      console.log('🔍 Checking student management system...')
      
      const student = await studentManagementService.validateStudentCredentials(email, password)
      
      if (student) {
        console.log('✅ Valid student found in management system, creating local account...')
        
        // Create new user from student data
        const hashedPassword = await bcrypt.hash(password, 10)
        
        user = await User.create({
          email: student.email.toLowerCase(),
          password: hashedPassword,
          firstName: student.firstName,
          lastName: student.lastName,
          role: 'student',
          emailVerified: true,
          authProvider: 'student-management',
          profile: {
            department: student.department,
            program: student.program,
            year: student.year,
            block: student.block,
          },
        })
        
        console.log('✅ User created from student management system')
      } else {
        console.log('❌ Invalid credentials - not found in local DB or student management system')
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }
    } else {
      console.log('✅ User found:', user.email, 'Role:', user.role)
    }


    // Check if email is verified (skip for student-management users)
    if (!user.emailVerified && user.authProvider !== 'student-management') {
      console.log('❌ Email not verified')
      return NextResponse.json(
        { 
          error: 'Please verify your email address before logging in',
          requiresVerification: true,
          email: user.email
        },
        { status: 403 }
      )
    }

    // Check if user uses Google OAuth only (no password set)
    if (user.authProvider === 'google' && !user.password) {
      console.log('❌ User should use Google OAuth (no password set)')
      return NextResponse.json(
        { 
          error: 'This account was created with Google. Please sign in with Google or set a password in your profile.',
          requiresGoogleAuth: true
        },
        { status: 400 }
      )
    }

    // Check if user has no password (shouldn't happen, but safety check)
    if (!user.password) {
      console.log('❌ User has no password')
      return NextResponse.json(
        { 
          error: 'No password set for this account. Please sign in with Google or set a password.',
          requiresGoogleAuth: true
        },
        { status: 400 }
      )
    }

    console.log('🔑 Comparing passwords...')
    // Check password
    let isPasswordValid = await bcrypt.compare(password, user.password)
    
    // If local password doesn't match, try student management system
    if (!isPasswordValid) {
      console.log('🔍 Checking student management system...')
      const student = await studentManagementService.validateStudentCredentials(email, password)
      
      if (student) {
        console.log('✅ Valid credentials in student management system, syncing...')
        // Update local password to match student management system
        user.password = await bcrypt.hash(password, 10)
        await user.save()
        isPasswordValid = true
      }
    }
    
    if (!isPasswordValid) {
      console.log('❌ Password invalid')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    console.log('✅ Password valid')

    console.log('🎫 Creating JWT token...')
    // Create JWT token
    const tokenPayload = { userId: user._id, email: user.email, role: user.role }
    console.log('🎫 Token payload:', tokenPayload)
    
    if (!process.env.JWT_SECRET) {
      console.error('❌ Missing JWT_SECRET in environment variables')
      return NextResponse.json(
        { error: 'Server configuration error: missing JWT_SECRET' },
        { status: 500 }
      )
    }
    const JWT_SECRET = process.env.JWT_SECRET

    const token = jwt.sign(
      tokenPayload,
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    console.log('✅ JWT token created')

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject()

    const response = NextResponse.json(
      { message: 'Login successful', user: userWithoutPassword },
      { status: 200 }
    )

    console.log('🍪 Setting cookie...')
    // Set HTTP-only cookie with more permissive settings for development
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds (Next expects seconds)
      path: '/',
      // omit domain in development
    })
    console.log('✅ Cookie set successfully')

    console.log('🎉 Login successful for user:', user.email)
    return response
  } catch (error) {
    console.error('💥 Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}