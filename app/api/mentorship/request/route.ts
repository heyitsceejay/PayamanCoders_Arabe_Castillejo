import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import MentorshipRequest from '@/models/MentorshipRequest';
import User from '@/models/User';

// POST - Create mentorship request
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { mentorId, message, goals, preferredTopics, meetingFrequency } = data;

    // Get mentee and mentor details
    const [mentee, mentor] = await Promise.all([
      User.findById(user.userId),
      User.findById(mentorId),
    ]);

    if (!mentee || !mentor) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (mentor.role !== 'mentor') {
      return NextResponse.json(
        { error: 'Selected user is not a mentor' },
        { status: 400 }
      );
    }

    // Check if request already exists
    const existing = await MentorshipRequest.findOne({
      'mentee.userId': user.userId,
      'mentor.userId': mentorId,
      status: { $in: ['pending', 'accepted', 'active'] },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'You already have an active request with this mentor' },
        { status: 400 }
      );
    }

    const mentorshipRequest = await MentorshipRequest.create({
      mentee: {
        userId: user.userId,
        name: `${mentee.firstName} ${mentee.lastName}`,
        email: mentee.email,
      },
      mentor: {
        userId: mentorId,
        name: `${mentor.firstName} ${mentor.lastName}`,
        email: mentor.email,
      },
      message,
      goals: goals || [],
      preferredTopics: preferredTopics || [],
      meetingFrequency: meetingFrequency || 'monthly',
    });

    return NextResponse.json({
      success: true,
      request: mentorshipRequest,
      message: 'Mentorship request sent successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Create mentorship request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
