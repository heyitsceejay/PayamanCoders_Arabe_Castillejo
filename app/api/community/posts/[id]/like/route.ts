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

    const post = await CommunityPost.findById(params.id).populate('author', 'firstName lastName');

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const userLiked = post.likes.includes(user.userId);

    if (userLiked) {
      // Unlike
      post.likes = post.likes.filter((id: any) => id.toString() !== user.userId);
      
      // Remove notification if exists
      await Notification.deleteOne({
        recipient: post.author._id,
        sender: user.userId,
        post: post._id,
        type: 'like',
      });
    } else {
      // Like
      post.likes.push(user.userId);
      
      // Create notification if not liking own post
      if (post.author._id.toString() !== user.userId) {
        const sender: any = await User.findById(user.userId).select('firstName lastName');
        
        await Notification.create({
          recipient: post.author._id,
          sender: user.userId,
          post: post._id,
          type: 'like',
          message: `${sender.firstName} ${sender.lastName} liked your post`,
        });
      }
    }

    await post.save();

    return NextResponse.json({
      liked: !userLiked,
      likes: post.likes.length,
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
