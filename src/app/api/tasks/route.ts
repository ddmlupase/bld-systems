import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const project = searchParams.get('project') || 'sia'

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        project: project
      },
      orderBy: {
        deadline: 'asc'
      }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, deadline, project } = await request.json()

    const task = await prisma.task.create({
      data: {
        title,
        description,
        deadline: new Date(deadline),
        project: project || 'sia',
        userId: session.user.id
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}