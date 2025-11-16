import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import CommunityPost from '@/models/CommunityPost';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();

    const [totalPosts, totalMembers, activeToday] = await Promise.all([
      CommunityPost.countDocuments(),
      User.countDocuments(),
      // Count users who created posts in the last 24 hours
      CommunityPost.distinct('author', {
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }).then(authors => authors.length),
    ]);

    // Get top contributors (users with most posts)
    const topContributors = await CommunityPost.aggregate([
      {
        $group: {
          _id: '$author',
          postCount: { $sum: 1 },
        },
      },
      { $sort: { postCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          name: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
          role: '$user.role',
          posts: '$postCount',
        },
      },
    ]);

    return NextResponse.json({
      members: totalMembers,
      posts: totalPosts,
      activeToday,
      topContributors: topContributors.map(c => ({
        name: c.name,
        role: c.role?.replace('_', ' ') || 'Member',
        posts: c.posts,
      })),
    });
  } catch (error) {
    console.error('Error fetching community stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
