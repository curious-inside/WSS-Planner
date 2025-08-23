import mongoose, { Schema, Model } from 'mongoose'
import { IComment } from '@/types'

const CommentSchema = new Schema<IComment>(
  {
    issueId: {
      type: Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mentions: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    attachments: [{
      filename: String,
      url: String,
    }],
    edited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Index for efficient querying
CommentSchema.index({ issueId: 1, createdAt: -1 })

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)

export default Comment