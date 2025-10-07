import { NextResponse } from 'next/server'
import { getPasswordRequirementsText } from '@/lib/password-validation'

export async function GET() {
  try {
    const requirements = getPasswordRequirementsText()
    
    return NextResponse.json({
      requirements,
      policy: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        forbidUsernameInPassword: true,
        forbidCommonPasswords: true
      }
    })
  } catch (error) {
    console.error('Error fetching password requirements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch password requirements' },
      { status: 500 }
    )
  }
}