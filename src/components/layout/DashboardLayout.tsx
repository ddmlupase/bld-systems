'use client'
import { useState, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
  currentProject: 'sia' | 'techno'
  onProjectChange: (project: 'sia' | 'techno') => void
  currentPage: string
  onPageChange: (page: string) => void
}

export default function DashboardLayout({
  children,
  currentProject,
  onProjectChange,
  currentPage,
  onPageChange
}: DashboardLayoutProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  const themeClass = currentProject === 'sia' ? 'theme-sia' : 'theme-techno'

  return (
    <div className={`min-h-screen bg-gray-50 ${themeClass}`}>
      <style jsx global>{`
        .theme-sia {
          --theme-color: #10b981;
        }
        .theme-techno {
          --theme-color: #3b82f6;
        }
      `}</style>
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">BLD Systems</h1>
            
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span>{currentProject === 'sia' ? 'SIA' : 'Technopreneurship'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg border min-w-[150px] z-10">
                  <button
                    onClick={() => {
                      onProjectChange('sia')
                      setDropdownOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    SIA
                  </button>
                  <button
                    onClick={() => {
                      onProjectChange('techno')
                      setDropdownOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    Technopreneurship
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {[
                { id: 'home', label: 'Home' },
                { id: 'tasks', label: 'Tasks' },
                { id: 'files', label: 'Files' },
                { id: 'calendar', label: 'Calendar' }
              ].map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => onPageChange(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors border-l-4 ${
                      currentPage === item.id
                        ? `bg-gray-50 border-l-[var(--theme-color)] text-[var(--theme-color)]`
                        : 'border-l-transparent hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}