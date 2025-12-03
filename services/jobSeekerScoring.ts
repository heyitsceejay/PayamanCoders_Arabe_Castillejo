import User from '@/models/User'
import mongoose from 'mongoose'

interface ScoreBreakdown {
  profileCompleteness: number
  resumeDocuments: number
  skillsAssessments: number
  platformEngagement: number
  accountQuality: number
}

interface ScoreResult {
  totalScore: number
  breakdown: ScoreBreakdown
  tier: 'incomplete' | 'basic' | 'ready' | 'strong' | 'excellent'
  missingItems: string[]
  recommendations: string[]
}

/**
 * Calculate comprehensive job seeker score
 * Total: 100 points
 */
export async function calculateJobSeekerScore(userId: string | mongoose.Types.ObjectId): Promise<ScoreResult> {
  const user = await User.findById(userId)
  
  if (!user) {
    throw new Error('User not found')
  }

  if (user.role !== 'job_seeker' && user.role !== 'student') {
    throw new Error('Scoring is only available for job seekers and students')
  }

  const breakdown: ScoreBreakdown = {
    profileCompleteness: calculateProfileCompleteness(user),
    resumeDocuments: calculateResumeScore(user),
    skillsAssessments: await calculateSkillsAssessmentsScore(userId.toString()),
    platformEngagement: await calculateEngagementScore(userId.toString()),
    accountQuality: calculateAccountQuality(user)
  }

  const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0)
  const tier = calculateTier(totalScore)
  const missingItems = identifyMissingItems(user, breakdown)
  const recommendations = generateRecommendations(user, breakdown, missingItems)

  return {
    totalScore: Math.round(totalScore * 10) / 10, // Round to 1 decimal
    breakdown,
    tier,
    missingItems,
    recommendations
  }
}

/**
 * Profile Completeness: 30 points
 * - Basic Information: 10 points
 * - Profile Details: 10 points
 * - Professional Information: 10 points
 */
function calculateProfileCompleteness(user: any): number {
  let score = 0
  
  // Basic Information (10 points)
  if (user.firstName) score += 1
  if (user.lastName) score += 1
  if (user.email && user.emailVerified) score += 2
  else if (user.email) score += 1
  if (user.contactNumber) score += 2
  if (user.address) score += 2
  if (user.birthdate) score += 2
  
  // Profile Details (10 points)
  if (user.profile?.bio && user.profile.bio.length >= 50) score += 3
  else if (user.profile?.bio && user.profile.bio.length >= 20) score += 1.5
  if (user.profile?.location) score += 2
  if (user.profile?.availability) score += 2
  if (user.profile?.remote !== undefined) score += 1
  if (user.profile?.profilePicture) score += 2
  
  // Professional Information (10 points)
  const skillCount = user.profile?.skills?.length || 0
  if (skillCount >= 5) score += 3
  else if (skillCount >= 3) score += 2
  else if (skillCount >= 1) score += 1
  
  if (user.profile?.experience && user.profile.experience.length >= 100) score += 4
  else if (user.profile?.experience && user.profile.experience.length >= 50) score += 2
  else if (user.profile?.experience) score += 1
  
  if (user.profile?.education && user.profile.education.length >= 50) score += 3
  else if (user.profile?.education && user.profile.education.length >= 20) score += 1.5
  else if (user.profile?.education) score += 0.5
  
  return Math.min(score, 30)
}

/**
 * Resume & Documents: 20 points
 * - Resume Upload: 15 points
 * - Resume Quality: 5 points
 */
function calculateResumeScore(user: any): number {
  let score = 0
  
  if (user.resume?.cloudinaryUrl) {
    score += 15 // Resume uploaded
    
    // Basic quality checks
    if (user.resume.fileSize && user.resume.fileSize > 10000) score += 1 // Not empty
    if (user.resume.fileType === 'application/pdf') score += 1 // PDF format
    if (user.resume.originalName && user.resume.originalName.length > 5) score += 1 // Proper filename
    
    // Additional points for having resume
    score += 2
  }
  
  return Math.min(score, 20)
}

/**
 * Skills & Assessments: 25 points
 * - Skills Listed: 5 points
 * - Assessments Taken: 10 points
 * - Certificates Earned: 10 points
 */
async function calculateSkillsAssessmentsScore(userId: string): Promise<number> {
  let score = 0
  
  // Skills listed (5 points)
  const user = await User.findById(userId)
  const skillCount = user?.profile?.skills?.length || 0
  score += Math.min(skillCount, 5)
  
  // Check if Assessment model exists
  try {
    const Assessment = mongoose.models.Assessment
    if (Assessment) {
      // Assessments taken (10 points)
      const assessmentResults = await Assessment.find({ 
        userId: new mongoose.Types.ObjectId(userId),
        completed: true 
      })
      const assessmentCount = assessmentResults.length
      if (assessmentCount >= 5) score += 10
      else if (assessmentCount >= 3) score += 6
      else if (assessmentCount >= 1) score += 3
      
      // Certificates earned (10 points)
      const certificates = assessmentResults.filter((a: any) => a.passed && a.certificateIssued)
      const certCount = certificates.length
      if (certCount >= 4) score += 10
      else if (certCount >= 2) score += 6
      else if (certCount >= 1) score += 3
    }
  } catch (error) {
    // Assessment model doesn't exist yet, skip this scoring
    console.log('Assessment model not found, skipping assessment scoring')
  }
  
  return Math.min(score, 25)
}

/**
 * Platform Engagement: 15 points
 * - Applications Submitted: 5 points
 * - Profile Views: 3 points
 * - Mentorship: 4 points
 * - Bookmarks: 3 points
 */
async function calculateEngagementScore(userId: string): Promise<number> {
  let score = 0
  
  // Check if Application model exists
  try {
    const Application = mongoose.models.Application
    if (Application) {
      const applications = await Application.countDocuments({ 
        applicantId: new mongoose.Types.ObjectId(userId) 
      })
      if (applications >= 8) score += 5
      else if (applications >= 4) score += 4
      else if (applications >= 1) score += 2
    }
  } catch (error) {
    console.log('Application model not found, skipping application scoring')
  }
  
  // Bookmarks (3 points)
  const user = await User.findById(userId)
  const bookmarkCount = user?.bookmarkedResources?.length || 0
  if (bookmarkCount >= 11) score += 3
  else if (bookmarkCount >= 6) score += 2
  else if (bookmarkCount >= 1) score += 1
  
  // Career path selected (2 points)
  if (user?.careerPath?.title) score += 2
  
  // Mentorship participation (4 points) - placeholder for future
  // This can be implemented when mentorship tracking is added
  
  return Math.min(score, 15)
}

/**
 * Account Quality: 10 points
 * - Email Verified: 5 points
 * - Account Age: 2 points
 * - Last Active: 3 points
 */
function calculateAccountQuality(user: any): number {
  let score = 0
  
  // Email verified (5 points)
  if (user.emailVerified) score += 5
  
  // Account age (2 points)
  const accountAge = Date.now() - new Date(user.createdAt).getTime()
  const daysOld = accountAge / (1000 * 60 * 60 * 24)
  if (daysOld >= 30) score += 2
  else if (daysOld >= 7) score += 1
  
  // Last active (3 points)
  const lastActive = Date.now() - new Date(user.updatedAt).getTime()
  const daysInactive = lastActive / (1000 * 60 * 60 * 24)
  if (daysInactive <= 7) score += 3
  else if (daysInactive <= 30) score += 2
  else if (daysInactive <= 90) score += 1
  
  return Math.min(score, 10)
}

/**
 * Calculate tier based on total score
 */
function calculateTier(score: number): 'incomplete' | 'basic' | 'ready' | 'strong' | 'excellent' {
  if (score >= 85) return 'excellent'
  if (score >= 75) return 'strong'
  if (score >= 60) return 'ready'
  if (score >= 40) return 'basic'
  return 'incomplete'
}

/**
 * Identify missing items from profile
 */
function identifyMissingItems(user: any, breakdown: ScoreBreakdown): string[] {
  const missing: string[] = []
  
  // Critical items
  if (!user.profile?.profilePicture) missing.push('Profile picture')
  if (!user.resume) missing.push('Resume upload')
  if (!user.emailVerified) missing.push('Email verification')
  
  // Important items
  if (!user.profile?.bio || user.profile.bio.length < 50) missing.push('Professional bio (at least 50 characters)')
  if (!user.profile?.skills || user.profile.skills.length < 3) missing.push('At least 3 skills')
  if (!user.profile?.experience || user.profile.experience.length < 100) missing.push('Work experience (at least 100 characters)')
  if (!user.profile?.education || user.profile.education.length < 50) missing.push('Education details (at least 50 characters)')
  
  // Basic items
  if (!user.contactNumber) missing.push('Contact number')
  if (!user.address) missing.push('Address')
  if (!user.birthdate) missing.push('Date of birth')
  if (!user.profile?.location) missing.push('Location')
  if (!user.profile?.availability) missing.push('Job availability preference')
  
  return missing
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(user: any, breakdown: ScoreBreakdown, missingItems: string[]): string[] {
  const recommendations: string[] = []
  
  // Priority recommendations based on score breakdown
  if (breakdown.profileCompleteness < 20) {
    recommendations.push('🎯 Complete your profile - it\'s the foundation of your job search')
  }
  
  if (breakdown.resumeDocuments < 15) {
    recommendations.push('📄 Upload your resume - it\'s required to apply for jobs')
  }
  
  if (breakdown.skillsAssessments < 10) {
    recommendations.push('🏆 Take skill assessments to earn certificates and stand out')
  }
  
  if (breakdown.platformEngagement < 5) {
    recommendations.push('💼 Start applying for jobs and bookmarking resources')
  }
  
  if (breakdown.accountQuality < 5) {
    recommendations.push('✉️ Verify your email address to unlock all features')
  }
  
  // Specific actionable items
  if (!user.profile?.profilePicture) {
    recommendations.push('📸 Add a professional profile picture')
  }
  
  if (!user.profile?.skills || user.profile.skills.length < 5) {
    recommendations.push('💡 Add more skills to your profile (aim for at least 5)')
  }
  
  if (!user.careerPath?.title) {
    recommendations.push('🗺️ Explore career paths to get personalized job recommendations')
  }
  
  return recommendations.slice(0, 5) // Return top 5 recommendations
}

/**
 * Update user's score in database
 */
export async function updateJobSeekerScore(userId: string | mongoose.Types.ObjectId): Promise<ScoreResult> {
  const result = await calculateJobSeekerScore(userId)
  
  // Get previous score for history
  const user = await User.findById(userId)
  const previousScore = user?.jobSeekerScore?.totalScore || 0
  const scoreChange = result.totalScore - previousScore
  
  // Prepare history entry
  const changes: string[] = []
  if (scoreChange > 0) {
    changes.push(`Score increased by ${scoreChange.toFixed(1)} points`)
  } else if (scoreChange < 0) {
    changes.push(`Score decreased by ${Math.abs(scoreChange).toFixed(1)} points`)
  }
  
  // Update user document
  await User.findByIdAndUpdate(userId, {
    $set: {
      'jobSeekerScore.totalScore': result.totalScore,
      'jobSeekerScore.lastCalculated': new Date(),
      'jobSeekerScore.breakdown': result.breakdown,
      'jobSeekerScore.tier': result.tier,
      'jobSeekerScore.missingItems': result.missingItems,
      'jobSeekerScore.recommendations': result.recommendations
    },
    $push: {
      'jobSeekerScore.history': {
        $each: [{
          score: result.totalScore,
          calculatedAt: new Date(),
          changes
        }],
        $slice: -10 // Keep only last 10 history entries
      }
    }
  })
  
  return result
}

/**
 * Check if user can apply for jobs
 */
export async function canApplyForJobs(userId: string | mongoose.Types.ObjectId): Promise<{
  canApply: boolean
  reason?: string
  currentScore: number
  requiredScore: number
  missingItems?: string[]
}> {
  const user = await User.findById(userId)
  
  if (!user) {
    return {
      canApply: false,
      reason: 'User not found',
      currentScore: 0,
      requiredScore: 60
    }
  }
  
  // Calculate current score if not already calculated
  let score = user.jobSeekerScore?.totalScore || 0
  let missingItems = user.jobSeekerScore?.missingItems || []
  
  if (!user.jobSeekerScore || !user.jobSeekerScore.lastCalculated) {
    const result = await calculateJobSeekerScore(userId)
    score = result.totalScore
    missingItems = result.missingItems
  }
  
  const requiredScore = 60
  
  if (score < requiredScore) {
    return {
      canApply: false,
      reason: `Your profile score (${score.toFixed(1)}) is below the minimum required (${requiredScore}). Please complete your profile.`,
      currentScore: score,
      requiredScore,
      missingItems
    }
  }
  
  return {
    canApply: true,
    currentScore: score,
    requiredScore
  }
}
