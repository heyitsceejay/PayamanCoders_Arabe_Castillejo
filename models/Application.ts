import mongoose from 'mongoose'

export interface IApplication extends mongoose.Document {
  jobId: mongoose.Types.ObjectId
  applicantId: mongoose.Types.ObjectId
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  coverLetter?: string
  resume?: string
  feedback?: {
    rating?: number
    comments?: string
    skills_assessment?: {
      skill: string
      rating: number
    }[]
  }
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
  feedback: {
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
  },
}, {
  timestamps: true,
})

export default mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema)