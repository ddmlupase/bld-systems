'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import HomePage from '@/components/dashboard/HomePage'
import TasksPage from '@/components/dashboard/TasksPage'
import FilesPage from '@/components/dashboard/FilesPage'
import CalendarPage from '@/components/dashboard/CalendarPage'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentProject, setCurrentProject] = useState<'sia' | 'techno'>('sia')
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'tasks':
        return <TasksPage currentProject={currentProject} />
      case 'files':
        return <FilesPage currentProject={currentProject} />
      case 'calendar':
        return <CalendarPage currentProject={currentProject} />
      default:
        return <HomePage />
    }
  }

  return (
    <DashboardLayout
      currentProject={currentProject}
      onProjectChange={setCurrentProject}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    >
      {renderPage()}
    </DashboardLayout>
  )
}