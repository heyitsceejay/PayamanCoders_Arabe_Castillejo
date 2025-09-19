import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

export async function verifyToken(request: NextRequest): Promise<TokenPayload | null> {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' })
}