import mongoose, { Schema, Model } from 'mongoose'
import { IOrganization } from '@/types'

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: String,
    logo: String,
    ownerId: {
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
        enum: ['super_admin', 'org_admin', 'project_admin', 'team_lead', 'developer', 'viewer', 'guest'],
        required: true,
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    settings: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

const Organization: Model<IOrganization> = mongoose.models.Organization || mongoose.model<IOrganization>('Organization', OrganizationSchema)

export default Organization