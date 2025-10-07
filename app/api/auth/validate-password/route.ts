import { NextRequest, NextResponse } from 'next/server'
import { validatePassword, getPasswordStrengthScore } from '@/lib/password-validation'

export async function POST(request: NextRequest) {
  try {
    const { password, email, username } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const validation = validatePassword(password, username, email)
    const strength = getPasswordStrengthScore(password)

    return NextResponse.json({
      isValid: validation.isValid,
      errors: validation.errors,
      strength: strength.strength,
      score: strength.score,
      feedback: strength.feedback
    })
  } catch (error) {
    console.error('Password validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}