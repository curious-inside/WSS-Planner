import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import dbConnect from '@/lib/mongodb'
import Issue from '@/models/Issue'
import Project from '@/models/Project'
import { z } from 'zod'

const createIssueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['epic', 'story', 'task', 'bug', 'sub_task', 'improvement']),
  priority: z.enum(['critical', 'high', 'medium', 'low']).default('medium'),
  projectId: z.string(),
  assigneeId: z.string().optional(),
  labels: z.array(z.string()).default([]),
  storyPoints: z.number().optional(),
})

// GET /api/issues
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')
    const assigneeId = searchParams.get('assigneeId')

    await dbConnect()

    let query: any = {}
    if (projectId) query.projectId = projectId
    if (status) query.status = status
    if (priority) query.priority = priority
    if (assigneeId) query.assigneeId = assigneeId
    if (search) {
      query.$text = { $search: search }
    }

    const issues = await Issue.find(query)
      .populate('reporterId', 'name email avatar')
      .populate('assigneeId', 'name email avatar')
      .populate('projectId', 'name key')
      .sort({ createdAt: -1 })
      .limit(100)

    return NextResponse.json(issues)
  } catch (error: any) {
    console.error('Get issues error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 }
    )
  }
}

// POST /api/issues
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createIssueSchema.parse(body)

    await dbConnect()

    const project = await Project.findById(validatedData.projectId)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Generate issue key
    const issueCount = await Issue.countDocuments({ projectId: validatedData.projectId })
    const issueKey = `${project.key}-${issueCount + 1}`

    const issue = await Issue.create({
      ...validatedData,
      key: issueKey,
      reporterId: session.user.id,
      status: 'todo',
    })

    const populatedIssue = await Issue.findById(issue._id)
      .populate('reporterId', 'name email avatar')
      .populate('assigneeId', 'name email avatar')
      .populate('projectId', 'name key')

    return NextResponse.json(populatedIssue, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Create issue error:', error)
    return NextResponse.json(
      { error: 'Failed to create issue' },
      { status: 500 }
    )
  }
}