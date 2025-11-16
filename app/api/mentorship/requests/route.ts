import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import MentorshipRequest from '@/models/MentorshipRequest';

// GET - List mentorship requests
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'received'; // 'received' or 'sent'

    const query = type === 'received'
      ? { 'mentor.userId': user.userId }
      : { 'mentee.userId': user.userId };

    const requests = await MentorshipRequest.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error('List requests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
