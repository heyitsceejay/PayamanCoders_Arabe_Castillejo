import mongoose from 'mongoose'

const mentorshipRequestSchema = new mongoose.Schema(
  {
    mentee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    goals: [String],
    preferredTopics: [String],
    meetingFrequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly'],
      default: 'monthly',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
    },
    response: String,
    respondedAt: Date,
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.MentorshipRequest ||
  mongoose.model('MentorshipRequest', mentorshipRequestSchema)
