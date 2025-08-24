import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import dbConnect from '@/lib/mongodb'
import Project from '@/models/Project'
import Organization from '@/models/Organization'
import { z } from 'zod'

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  key: z.string().min(2, 'Project key must be at least 2 characters').max(5, 'Project key must be 5 characters or less').regex(/^[A-Z0-9]+$/, 'Project key must be uppercase letters and numbers'),
  organizationId: z.string().min(1, 'Organization is required'),
})

// GET /api/projects
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Find projects where the user is a member
    const projects = await Project.find({ 'members.userId': session.user.id })
      .populate('leadId', 'name email avatar')
      .populate('organizationId', 'name slug')
      .sort({ name: 1 })

    return NextResponse.json(projects)
  } catch (error: any) {
    console.error('Get projects error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST /api/projects
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    await dbConnect()

    // Check if project key is unique within the organization
    const existingProject = await Project.findOne({
      key: validatedData.key,
      organizationId: validatedData.organizationId
    })
    if (existingProject) {
      return NextResponse.json({ error: 'Project key must be unique within the organization' }, { status: 400 })
    }

    // Verify user is a member of the organization
    const organization = await Organization.findById(validatedData.organizationId)
    if (!organization || !organization.members.some(m => m.userId.toString() === session.user.id)) {
      return NextResponse.json({ error: 'You are not a member of this organization' }, { status: 403 })
    }

    const project = await Project.create({
      ...validatedData,
      leadId: session.user.id,
      members: [{ userId: session.user.id, role: 'project_admin' }],
    })

    const populatedProject = await Project.findById(project._id)
      .populate('leadId', 'name email avatar')
      .populate('organizationId', 'name slug')

    return NextResponse.json(populatedProject, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Create project error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
