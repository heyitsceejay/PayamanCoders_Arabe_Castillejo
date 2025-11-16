import mongoose, { Schema, Document } from 'mongoose';

export interface IMentorshipRequest extends Document {
  mentee: {
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
  };
  mentor: {
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'active' | 'completed';
  message: string;
  goals: string[];
  preferredTopics: string[];
  meetingFrequency: 'weekly' | 'biweekly' | 'monthly';
  createdAt: Date;
  respondedAt?: Date;
  completedAt?: Date;
}

const MentorshipRequestSchema = new Schema<IMentorshipRequest>(
  {
    mentee: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: String,
      email: String,
    },
    mentor: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: String,
      email: String,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'active', 'completed'],
      default: 'pending',
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
    respondedAt: Date,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
MentorshipRequestSchema.index({ 'mentee.userId': 1 });
MentorshipRequestSchema.index({ 'mentor.userId': 1 });
MentorshipRequestSchema.index({ status: 1 });

export default mongoose.models.MentorshipRequest || mongoose.model<IMentorshipRequest>('MentorshipRequest', MentorshipRequestSchema);
