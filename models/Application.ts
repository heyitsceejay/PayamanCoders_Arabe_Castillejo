import mongoose from 'mongoose'

export interface IApplication extends mongoose.Document {
  jobId: mongoose.Types.ObjectId
  applicantId: mongoose.Types.ObjectId
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  coverLetter?: string
  resume?: string
  feedbacks?: {
    rating?: number
    comments?: string
    skills_assessment?: {
      skill: string
      rating: number
    }[]
    employerId?: mongoose.Types.ObjectId
    createdAt?: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending',
  },
  coverLetter: String,
  resume: String,
  feedbacks: [{
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comments: String,
    skills_assessment: [{
      skill: String,
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
    }],
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
})

export default mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema)