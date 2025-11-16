import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import Webinar from '@/models/Webinar';

// POST - Register for a webinar
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const webinar = await Webinar.findById(params.id);
    if (!webinar) {
      return NextResponse.json(
        { error: 'Webinar not found' },
        { status: 404 }
      );
    }

    // Check if webinar is still open for registration
    if (webinar.status === 'cancelled') {
      return NextResponse.json(
        { error: 'This webinar has been cancelled' },
        { status: 400 }
      );
    }

    if (webinar.status === 'completed') {
      return NextResponse.json(
        { error: 'This webinar has already ended' },
        { status: 400 }
      );
    }

    // Check if already registered
    const alreadyRegistered = webinar.attendees.some(
      (attendee: any) => attendee.userId.toString() === user.userId
    );

    if (alreadyRegistered) {
      return NextResponse.json(
        { error: 'You are already registered for this webinar' },
        { status: 400 }
      );
    }

    // Check if webinar is full
    if (webinar.maxAttendees && webinar.attendees.length >= webinar.maxAttendees) {
      return NextResponse.json(
        { error: 'This webinar is full' },
        { status: 400 }
      );
    }

    // Register user
    webinar.attendees.push({
      userId: user.userId as any,
      registeredAt: new Date(),
    });

    await webinar.save();

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for webinar',
      webinar,
    });
  } catch (error) {
    console.error('Register webinar error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Unregister from a webinar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const webinar = await Webinar.findById(params.id);
    if (!webinar) {
      return NextResponse.json(
        { error: 'Webinar not found' },
        { status: 404 }
      );
    }

    // Remove user from attendees
    webinar.attendees = webinar.attendees.filter(
      (attendee: any) => attendee.userId.toString() !== user.userId
    );

    await webinar.save();

    return NextResponse.json({
      success: true,
      message: 'Successfully unregistered from webinar',
    });
  } catch (error) {
    console.error('Unregister webinar error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
