import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import CommunityPost from '@/models/CommunityPost';
import { verifyToken } from '@/lib/auth';

// GET - Fetch all posts
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get current user if authenticated
    const currentUser = await verifyToken(request);
    const userId = currentUser?.userId;

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const trending = searchParams.get('trending');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    let query: any = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (trending === 'true') {
      query.trending = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const posts = await CommunityPost.find(query)
      .populate('author', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await CommunityPost.countDocuments(query);

    // Format posts for frontend
    const formattedPosts = posts.map((post: any) => ({
      id: post._id.toString(),
      author: {
        name: `${post.author.firstName} ${post.author.lastName}`,
        role: post.author.role?.replace('_', ' ') || 'Member',
        avatar: post.author.profilePicture,
      },
      title: post.title,
      content: post.content,
      category: post.category,
      likes: post.likes?.length || 0,
      comments: post.comments?.length || 0,
      timestamp: getTimeAgo(post.createdAt),
      trending: post.trending,
      createdAt: post.createdAt,
      isLiked: userId ? post.likes?.some((id: any) => id.toString() === userId) : false,
    }));

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST - Create a new post
export async function POST(request: NextRequest) {
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
    const { title, content, category } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    const post = await CommunityPost.create({
      author: user.userId,
      title,
      content,
      category,
    });

    const populatedPost: any = await CommunityPost.findById(post._id)
      .populate('author', 'firstName lastName email role')
      .lean();

    if (!populatedPost) {
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Post created successfully',
      post: {
        id: populatedPost._id.toString(),
        author: {
          name: `${populatedPost.author.firstName} ${populatedPost.author.lastName}`,
          role: populatedPost.author.role?.replace('_', ' ') || 'Member',
        },
        title: populatedPost.title,
        content: populatedPost.content,
        category: populatedPost.category,
        likes: 0,
        comments: 0,
        timestamp: 'Just now',
        trending: false,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' year' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' month' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' day' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hour' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minute' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';

  return 'Just now';
}
