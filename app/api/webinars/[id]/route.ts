import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import Webinar from '@/models/Webinar';

// GET - Get webinar details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const webinar = await Webinar.findById(params.id).lean();

    if (!webinar) {
      return NextResponse.json(
        { error: 'Webinar not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      webinar,
    });
  } catch (error) {
    console.error('Get webinar error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update webinar
export async function PUT(
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

    // Check if user is the host or admin
    if (webinar.host.userId.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized to update this webinar' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Update allowed fields
    if (data.title) webinar.title = data.title;
    if (data.description) webinar.description = data.description;
    if (data.scheduledDate) webinar.scheduledDate = new Date(data.scheduledDate);
    if (data.duration) webinar.duration = data.duration;
    if (data.meetLink) webinar.meetLink = data.meetLink;
    if (data.maxAttendees) webinar.maxAttendees = data.maxAttendees;
    if (data.category) webinar.category = data.category;
    if (data.tags) webinar.tags = data.tags;
    if (data.status) webinar.status = data.status;

    await webinar.save();

    return NextResponse.json({
      success: true,
      webinar,
      message: 'Webinar updated successfully',
    });
  } catch (error) {
    console.error('Update webinar error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete webinar
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

    // Check if user is the host or admin
    if (webinar.host.userId.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized to delete this webinar' },
        { status: 403 }
      );
    }

    await Webinar.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Webinar deleted successfully',
    });
  } catch (error) {
    console.error('Delete webinar error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
