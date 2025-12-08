import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { studentManagementService } from '@/services/studentManagementService'

export async function POST(request: NextRequest) {
  console.log('🔄 Student Sync API called')
  
  try {
    // Optional: Add admin authentication check here
    
    await dbConnect()
    
    console.log('📥 Fetching students from management system...')
    const students = await studentManagementService.getAllStudents()
    
    console.log(`Found ${students.length} students`)
    
    let created = 0
    let updated = 0
    let skipped = 0
    const errors: string[] = []

    for (const student of students) {
      try {
        const existingUser = await User.findOne({ 
          email: student.email.toLowerCase() 
        })

        if (!existingUser) {
          // Create new user
          const hashedPassword = await bcrypt.hash(student.password, 10)
          
          await User.create({
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
          
          created++
          console.log(`✅ Created user: ${student.email}`)
        } else {
          // Update existing user if needed
          let needsUpdate = false
          
          // Check if password changed
          const isPasswordSame = await bcrypt.compare(
            student.password, 
            existingUser.password
          )
          
          if (!isPasswordSame) {
            existingUser.password = await bcrypt.hash(student.password, 10)
            needsUpdate = true
          }
          
          // Update profile info
          if (existingUser.firstName !== student.firstName ||
              existingUser.lastName !== student.lastName) {
            existingUser.firstName = student.firstName
            existingUser.lastName = student.lastName
            needsUpdate = true
          }
          
          if (needsUpdate) {
            await existingUser.save()
            updated++
            console.log(`🔄 Updated user: ${student.email}`)
          } else {
            skipped++
          }
        }
      } catch (error) {
        const errorMsg = `Failed to sync ${student.email}: ${error instanceof Error ? error.message : 'Unknown error'}`
        errors.push(errorMsg)
        console.error(errorMsg)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Student sync completed',
      stats: {
        total: students.length,
        created,
        updated,
        skipped,
        errors: errors.length,
      },
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('💥 Sync error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to sync students', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
