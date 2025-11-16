import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Webinar from '@/models/Webinar';
import MentorshipRequest from '@/models/MentorshipRequest';

export const dynamic = 'force-dynamic';

// GET - List available mentors
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    const mentors = await User.find({ role: 'mentor' })
      .select('firstName lastName email profile')
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    // Fetch stats for each mentor
    const mentorsWithStats = await Promise.all(
      mentors.map(async (mentor) => {
        const webinarsCount = await Webinar.countDocuments({
          'host.userId': mentor._id,
        });
        
        const menteesCount = await MentorshipRequest.countDocuments({
          'mentor.userId': mentor._id,
          status: { $in: ['accepted', 'active', 'completed'] },
        });

        return {
          ...mentor,
          stats: {
            webinars: webinarsCount,
            mentees: menteesCount,
            rating: 4.5, // Placeholder for future rating system
          },
        };
      })
    );

    const total = await User.countDocuments({ role: 'mentor' });

    return NextResponse.json({
      success: true,
      mentors: mentorsWithStats,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Mentors list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
