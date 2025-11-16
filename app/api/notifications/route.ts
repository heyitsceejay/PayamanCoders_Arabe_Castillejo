import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Notification from '@/models/Notification';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const notifications = await Notification.find({ recipient: user.userId })
      .populate('sender', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const formattedNotifications = notifications.map((notif: any) => ({
      id: notif._id.toString(),
      message: notif.message,
      createdAt: notif.createdAt,
      read: notif.read,
    }));

    return NextResponse.json({
      notifications: formattedNotifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
