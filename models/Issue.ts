import mongoose, { Schema, Model } from 'mongoose'
import { IIssue } from '@/types'

const IssueSchema = new Schema<IIssue>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    type: {
      type: String,
      enum: ['epic', 'story', 'task', 'bug', 'sub_task', 'improvement'],
      required: true,
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'in_review', 'done', 'cancelled'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assigneeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    epicId: {
      type: Schema.Types.ObjectId,
      ref: 'Issue',
    },
    sprintId: {
      type: Schema.Types.ObjectId,
      ref: 'Sprint',
    },
    labels: [{
      type: String,
      trim: true,
    }],
    storyPoints: Number,
    timeTracking: {
      estimated: Number,
      logged: {
        type: Number,
        default: 0,
      },
      remaining: Number,
    },
    attachments: [{
      filename: String,
      url: String,
      uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    watchers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    customFields: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
)

// Index for text search
IssueSchema.index({ key: 'text', title: 'text', description: 'text' })

// Compound indexes for common queries
IssueSchema.index({ projectId: 1, status: 1 })
IssueSchema.index({ assigneeId: 1, status: 1 })
IssueSchema.index({ sprintId: 1, status: 1 })

const Issue: Model<IIssue> = mongoose.models.Issue || mongoose.model<IIssue>('Issue', IssueSchema)

export default Issue