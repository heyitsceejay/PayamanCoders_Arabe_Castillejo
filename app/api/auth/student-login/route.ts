import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { studentManagementService } from '@/services/studentManagementService'

export async function POST(request: NextRequest) {
  console.log('🎓 Student Login API called')
  
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('🔍 Validating student credentials from external API...')
    
    // Validate credentials against student management system
    const student = await studentManagementService.validateStudentCredentials(
      email,
      password
    )

    if (!student) {
      console.log('❌ Invalid student credentials')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('✅ Student validated:', student.email)

    // Connect to database
    await dbConnect()

    // Check if user already exists in local database
    let user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      console.log('📝 Creating new user from student data...')
      
      // Create new user from student data
      const hashedPassword = await bcrypt.hash(password, 10)
      
      user = await User.create({
        email: student.email.toLowerCase(),
        password: hashedPassword,
        firstName: student.firstName,
        lastName: student.lastName,
        role: 'student',
        emailVerified: true, // Auto-verify students from management system
        authProvider: 'student-management',
        profile: {
          department: student.department,
          program: student.program,
          year: student.year,
          block: student.block,
        },
      })
      
      console.log('✅ User created successfully')
    } else {
      console.log('✅ Existing user found')
      
      // Update password if it changed in the student management system
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        console.log('🔄 Updating user password...')
        user.password = await bcrypt.hash(password, 10)
        await user.save()
      }
    }

    // Create JWT token
    const tokenPayload = { 
      userId: user._id, 
      email: user.email, 
      role: user.role 
    }
    
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject()

    const response = NextResponse.json(
      { 
        message: 'Login successful', 
        user: userWithoutPassword,
        isStudentManagementUser: true 
      },
      { status: 200 }
    )

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    console.log('🎉 Student login successful')
    return response
  } catch (error) {
    console.error('💥 Student login error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
