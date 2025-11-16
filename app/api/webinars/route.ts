import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import Webinar from '@/models/Webinar';
import User from '@/models/User';

// GET - List all webinars
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'scheduled';
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    const query: any = {};
    
    if (status !== 'all') {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }

    const webinars = await Webinar.find(query)
      .sort({ scheduledDate: 1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await Webinar.countDocuments(query);

    return NextResponse.json({
      success: true,
      webinars,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Webinars list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new webinar
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

    // Only mentors and admins can create webinars
    const userProfile = await User.findById(user.userId);
    if (!userProfile || !['mentor', 'admin'].includes(userProfile.role)) {
      return NextResponse.json(
        { error: 'Only mentors and admins can create webinars' },
        { status: 403 }
      );
    }

    const data = await request.json();

    const webinar = await Webinar.create({
      title: data.title,
      description: data.description,
      host: {
        userId: user.userId,
        name: `${userProfile.firstName} ${userProfile.lastName}`,
        role: userProfile.role,
        avatar: userProfile.profile?.profilePicture,
      },
      scheduledDate: new Date(data.scheduledDate),
      duration: data.duration || 60,
      meetLink: data.meetLink,
      maxAttendees: data.maxAttendees || 100,
      category: data.category || 'other',
      tags: data.tags || [],
      status: 'scheduled',
    });

    return NextResponse.json({
      success: true,
      webinar,
      message: 'Webinar created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Create webinar error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
