import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { AIService } from '@/lib/ai';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Job from '@/models/Job';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user profile
    const userProfile = await User.findById(user.userId);
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get active jobs
    const jobs = await Job.find({ status: 'active' })
      .limit(20)
      .lean();

    if (jobs.length === 0) {
      return NextResponse.json({
        success: true,
        recommendations: []
      });
    }

    // Get AI-powered recommendations
    const rankedJobs = await AIService.generateJobRecommendations(
      userProfile.profile,
      jobs
    );

    // Calculate match scores for top recommendations
    const recommendationsWithScores = await Promise.all(
      rankedJobs.slice(0, 10).map(async (job, index) => {
        try {
          const matchAnalysis = await AIService.analyzeJobMatch(userProfile.profile, job);
          return {
            ...job,
            matchScore: matchAnalysis.score,
            matchReason: matchAnalysis.reasoning,
            strengths: matchAnalysis.strengths,
            gaps: matchAnalysis.gaps
          };
        } catch (error) {
          // Fallback: assign decreasing scores based on ranking
          return {
            ...job,
            matchScore: Math.max(95 - (index * 5), 60),
            matchReason: `Matches ${userProfile.profile?.skills?.length || 0} of your skills`
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      recommendations: recommendationsWithScores
    });
  } catch (error) {
    console.error('AI recommendations API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
