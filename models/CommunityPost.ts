import mongoose from 'mongoose';

const CommunityPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Career Advice', 'Career Growth', 'Learning', 'Work Life', 'Networking', 'General'],
      default: 'General',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    trending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
CommunityPostSchema.index({ createdAt: -1 });
CommunityPostSchema.index({ category: 1 });
CommunityPostSchema.index({ trending: -1, createdAt: -1 });

export default mongoose.models.CommunityPost || mongoose.model('CommunityPost', CommunityPostSchema);
