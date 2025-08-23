import mongoose, { Schema, Model } from 'mongoose'
import { IProject } from '@/types'

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: String,
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    settings: {
      issueTypes: {
        type: [String],
        enum: ['epic', 'story', 'task', 'bug', 'sub_task', 'improvement'],
        default: ['epic', 'story', 'task', 'bug'],
      },
      workflowId: {
        type: Schema.Types.ObjectId,
        ref: 'Workflow',
      },
      boardType: {
        type: String,
        enum: ['kanban', 'scrum'],
        default: 'kanban',
      },
    },
  },
  {
    timestamps: true,
  }
)

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)

export default Project