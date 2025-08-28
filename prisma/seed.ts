import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const user1 = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@bld.com',
      password: hashedPassword,
      name: 'John Smith',
      role: 'Project Manager'
    }
  })

  const user2 = await prisma.user.create({
    data: {
      username: 'developer',
      email: 'dev@bld.com',
      password: hashedPassword,
      name: 'Sarah Johnson',
      role: 'Developer'
    }
  })

  // Create sample tasks
  await prisma.task.create({
    data: {
      title: 'Complete Project Proposal',
      description: 'Draft and finalize the project proposal document with all team members input',
      deadline: new Date('2025-09-15'),
      project: 'sia',
      userId: user1.id
    }
  })

  await prisma.task.create({
    data: {
      title: 'Design System Architecture',
      description: 'Create the technical architecture diagram and documentation',
      deadline: new Date('2025-09-30'),
      project: 'sia',
      userId: user1.id
    }
  })

  // Create sample deadlines
  await prisma.deadline.create({
    data: {
      title: 'Project Proposal Submission',
      description: 'Submit final project proposal to instructor',
      deadline: new Date('2025-09-15'),
      project: 'sia',
      userId: user1.id
    }
  })

  // Create sample links
  await prisma.link.create({
    data: {
      title: 'Project Presentation Template',
      description: 'Main presentation template for final presentation',
      url: 'https://canva.com/design/example1',
      type: 'canva',
      project: 'sia',
      userId: user1.id
    }
  })

  await prisma.link.create({
    data: {
      title: 'BLD Systems Repository',
      description: 'Main project repository containing all source code',
      url: 'https://github.com/example/bld-systems',
      type: 'github',
      project: 'sia',
      userId: user1.id
    }
  })

  console.log('Database has been seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })