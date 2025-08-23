import mongoose, { Schema, Model } from 'mongoose'
import { IBoard } from '@/types'

const BoardSchema = new Schema<IBoard>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['kanban', 'scrum'],
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    columns: [{
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      wipLimit: Number,
      issueIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Issue',
      }],
      order: {
        type: Number,
        required: true,
      },
    }],
    swimlanes: {
      type: {
        type: String,
        enum: ['assignee', 'priority', 'epic'],
      },
      enabled: {
        type: Boolean,
        default: false,
      },
    },
    filters: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

const Board: Model<IBoard> = mongoose.models.Board || mongoose.model<IBoard>('Board', BoardSchema)

export default Board