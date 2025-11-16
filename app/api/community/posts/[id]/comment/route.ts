import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import CommunityPost from '@/models/CommunityPost';
import Notification from '@/models/Notification';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyToken(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    const post = await CommunityPost.findById(params.id).populate('author', 'firstName lastName');

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    post.comments.push({
      author: user.userId,
      content: content.trim(),
      createdAt: new Date(),
    });

    await post.save();

    // Create notification if not commenting on own post
    if (post.author._id.toString() !== user.userId) {
      const sender: any = await User.findById(user.userId).select('firstName lastName');
      
      await Notification.create({
        recipient: post.author._id,
        sender: user.userId,
        post: post._id,
        type: 'comment',
        message: `${sender.firstName} ${sender.lastName} commented on your post`,
      });
    }

    return NextResponse.json({
      message: 'Comment added successfully',
      comments: post.comments.length,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}
