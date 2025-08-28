'use client'
import { useState, useEffect } from 'react'

interface Deadline {
  id: string
  title: string
  description: string
  deadline: string
}

interface CalendarPageProps {
  currentProject: 'sia' | 'techno'
}

export default function CalendarPage({ currentProject }: CalendarPageProps) {
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: ''
  })

  useEffect(() => {
    fetchDeadlines()
  }, [currentProject])

  const fetchDeadlines = async () => {
    try {
      const response = await fetch(`/api/deadlines?project=${currentProject}`)
      if (response.ok) {
        const data = await response.json()
        setDeadlines(data)
      }
    } catch (error) {
      console.error('Error fetching deadlines:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/deadlines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          project: currentProject
        }),
      })

      if (response.ok) {
        fetchDeadlines()
        setShowAddModal(false)
        setFormData({ title: '', description: '', deadline: '' })
      }
    } catch (error) {
      console.error('Error creating deadline:', error)
    }
  }

  const changeMonth = (direction: number) => {
    setCurrentMonth(prev => {
      const newMonth = prev + direction
      if (newMonth > 11) {
        setCurrentYear(currentYear + 1)
        return 0
      } else if (newMonth < 0) {
        setCurrentYear(currentYear - 1)
        return 11
      }
      return newMonth
    })
  }

  const renderCalendar = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const today = new Date()
    
    const days = []
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    // Add day headers
    dayHeaders.forEach(day => {
      days.push(
        <div key={day} className="p-3 font-semibold text-center bg-gray-100">
          {day}
        </div>
      )
    })
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-3 bg-white"></div>)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = currentYear === today.getFullYear() && 
                     currentMonth === today.getMonth() && 
                     day === today.getDate()
      
      const dayString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      const hasDeadline = deadlines.some(deadline => deadline.deadline.startsWith(dayString))
      
      days.push(
        <div
          key={day}
          className={`p-3 text-center border border-gray-200 ${
            isToday ? 'bg-[var(--theme-color)] text-white font-bold' :
            hasDeadline ? 'bg-yellow-100 text-yellow-800' : 'bg-white'
          }`}
        >
          {day}
        </div>
      )
    }
    
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            ‹
          </button>
          <h3 className="text-xl font-semibold">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            ›
          </button>
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-300 border border-gray-300">
          {days}
        </div>
      </div>
    )
  }

  const getDaysRemaining = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const timeDiff = deadlineDate.getTime() - today.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    
    if (daysDiff > 0) {
      return `${daysDiff} days remaining`
    } else if (daysDiff === 0) {
      return 'Due today'
    } else {
      return `${Math.abs(daysDiff)} days overdue`
    }
  }

  return (
    <div className="space-y-8">
      {/* Calendar */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-[var(--theme-color)] pb-2">
          Calendar
        </h2>
        <div className="bg-white rounded-lg shadow p-6">
          {renderCalendar()}
        </div>
      </div>

      {/* Important Deadlines */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-[var(--theme-color)] pb-2">
          Important Deadlines
        </h2>
        <div className="bg-white rounded-lg shadow p-6">
          {deadlines.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No deadlines added yet.</p>
          ) : (
            <div className="space-y-4">
              {deadlines
                .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                .map(deadline => (
                  <div key={deadline.id} className="border-l-4 border-[var(--theme-color)] pl-4 py-3 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 mb-2">{deadline.title}</h3>
                    <p className="text-gray-700 mb-2">{deadline.description}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(deadline.deadline).toLocaleDateString()} ({getDaysRemaining(deadline.deadline)})
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 px-6 py-3 bg-[var(--theme-color)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Add Deadline
        </button>
      </div>

      {/* Add Deadline Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h3 className="text-xl font-bold mb-6">Add Deadline</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--theme-color)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--theme-color)] h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline Date</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--theme-color)]"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--theme-color)] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Add Deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}