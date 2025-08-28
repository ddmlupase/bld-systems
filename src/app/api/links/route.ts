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
    const type = searchParams.get('type')

    const links = await prisma.link.findMany({
      where: {
        userId: session.user.id,
        project: project,
        ...(type && { type })
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(links)
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

    const { title, description, url, type, project } = await request.json()

    const link = await prisma.link.create({
      data: {
        title,
        description,
        url,
        type,
        project: project || 'sia',
        userId: session.user.id
      }
    })

    return NextResponse.json(link)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}