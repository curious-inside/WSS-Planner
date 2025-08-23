import mongoose, { Schema, Model } from 'mongoose'
import { ISprint } from '@/types'

const SprintSchema = new Schema<ISprint>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    goal: String,
    status: {
      type: String,
      enum: ['planned', 'active', 'completed'],
      default: 'planned',
    },
    issues: [{
      type: Schema.Types.ObjectId,
      ref: 'Issue',
    }],
    velocity: Number,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
)

const Sprint: Model<ISprint> = mongoose.models.Sprint || mongoose.model<ISprint>('Sprint', SprintSchema)

export default Sprint