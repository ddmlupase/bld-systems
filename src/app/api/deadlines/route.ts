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

    const deadlines = await prisma.deadline.findMany({
      where: {
        userId: session.user.id,
        project: project
      },
      orderBy: {
        deadline: 'asc'
      }
    })

    return NextResponse.json(deadlines)
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

    const newDeadline = await prisma.deadline.create({
      data: {
        title,
        description,
        deadline: new Date(deadline),
        project: project || 'sia',
        userId: session.user.id
      }
    })

    return NextResponse.json(newDeadline)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}