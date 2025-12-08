import { NextResponse } from 'next/server'
import { studentManagementService } from '@/services/studentManagementService'

export async function GET() {
  try {
    console.log('🧪 Testing student management API connection...')
    
    const students = await studentManagementService.getAllStudents()
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to student management API',
      studentCount: students.length,
      sampleStudents: students.slice(0, 3).map(s => ({
        email: s.email,
        name: s.name,
        program: s.program,
      })),
    })
  } catch (error) {
    console.error('❌ Test failed:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to connect to student management API',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
