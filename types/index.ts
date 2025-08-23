export type UserRole = 'super_admin' | 'org_admin' | 'project_admin' | 'team_lead' | 'developer' | 'viewer' | 'guest'

export type IssueType = 'epic' | 'story' | 'task' | 'bug' | 'sub_task' | 'improvement'

export type IssuePriority = 'critical' | 'high' | 'medium' | 'low'

export type IssueStatus = 'todo' | 'in_progress' | 'in_review' | 'done' | 'cancelled'

export type BoardType = 'kanban' | 'scrum'

export type SprintStatus = 'planned' | 'active' | 'completed'

export interface IUser {
  _id?: string
  email: string
  password?: string
  name: string
  avatar?: string
  role: UserRole
  organizationId?: string
  teams: string[]
  preferences: Record<string, any>
  lastActive: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface IOrganization {
  _id?: string
  name: string
  slug: string
  description?: string
  logo?: string
  ownerId: string
  members: {
    userId: string
    role: UserRole
    joinedAt: Date
  }[]
  settings: Record<string, any>
  createdAt?: Date
  updatedAt?: Date
}

export interface IProject {
  _id?: string
  name: string
  key: string
  description?: string
  organizationId: string
  leadId: string
  members: {
    userId: string
    role: string
    joinedAt: Date
  }[]
  settings: {
    issueTypes: IssueType[]
    workflowId?: string
    boardType: BoardType
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface IIssue {
  _id?: string
  key: string
  title: string
  description?: string
  type: IssueType
  status: IssueStatus
  priority: IssuePriority
  projectId: string
  reporterId: string
  assigneeId?: string
  epicId?: string
  sprintId?: string
  labels: string[]
  storyPoints?: number
  timeTracking: {
    estimated?: number
    logged?: number
    remaining?: number
  }
  attachments: {
    filename: string
    url: string
    uploadedBy: string
    uploadedAt: Date
  }[]
  watchers: string[]
  customFields?: Record<string, any>
  createdAt?: Date
  updatedAt?: Date
  resolvedAt?: Date
}

export interface ISprint {
  _id?: string
  name: string
  projectId: string
  startDate: Date
  endDate: Date
  goal?: string
  status: SprintStatus
  issues: string[]
  velocity?: number
  createdAt?: Date
  completedAt?: Date
}

export interface IComment {
  _id?: string
  issueId: string
  authorId: string
  content: string
  mentions: string[]
  attachments: {
    filename: string
    url: string
  }[]
  edited: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IBoard {
  _id?: string
  name: string
  type: BoardType
  projectId: string
  columns: {
    id: string
    name: string
    wipLimit?: number
    issueIds: string[]
    order: number
  }[]
  swimlanes?: {
    type: 'assignee' | 'priority' | 'epic'
    enabled: boolean
  }
  filters?: Record<string, any>
  createdAt?: Date
  updatedAt?: Date
}