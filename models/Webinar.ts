import mongoose, { Schema, Document } from 'mongoose';

export interface IWebinar extends Document {
  title: string;
  description: string;
  host: {
    userId: mongoose.Types.ObjectId;
    name: string;
    role: string;
    avatar?: string;
  };
  scheduledDate: Date;
  duration: number; // in minutes
  meetLink?: string;
  maxAttendees?: number;
  category: 'career_development' | 'technical_skills' | 'interview_prep' | 'industry_insights' | 'other';
  tags: string[];
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  attendees: {
    userId: mongoose.Types.ObjectId;
    registeredAt: Date;
    attended?: boolean;
  }[];
  recording?: {
    url: string;
    uploadedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const WebinarSchema = new Schema<IWebinar>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    host: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      avatar: String,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 60,
    },
    meetLink: {
      type: String,
    },
    maxAttendees: {
      type: Number,
      default: 100,
    },
    category: {
      type: String,
      enum: ['career_development', 'technical_skills', 'interview_prep', 'industry_insights', 'other'],
      default: 'other',
    },
    tags: [String],
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    attendees: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
        attended: {
          type: Boolean,
          default: false,
        },
      },
    ],
    recording: {
      url: String,
      uploadedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
WebinarSchema.index({ scheduledDate: 1, status: 1 });
WebinarSchema.index({ 'host.userId': 1 });
WebinarSchema.index({ category: 1 });

export default mongoose.models.Webinar || mongoose.model<IWebinar>('Webinar', WebinarSchema);
