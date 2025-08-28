'use client'
import { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  description: string
  deadline: string
  completed: boolean
}

interface TasksPageProps {
  currentProject: 'sia' | 'techno'
}

export default function TasksPage({ currentProject }: TasksPageProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [taskToComplete, setTaskToComplete] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: ''
  })

  useEffect(() => {
    fetchTasks()
  }, [currentProject])

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?project=${currentProject}`)
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/tasks', {
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
        fetchTasks()
        setShowAddModal(false)
        setFormData({ title: '', description: '', deadline: '' })
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const markTaskDone = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true }),
      })

      if (response.ok) {
        fetchTasks()
        setShowConfirmModal(false)
        setTaskToComplete(null)
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
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

  const activeTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  return (
    <div className="space-y-8">
      {/* Active Tasks */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-[var(--theme-color)] pb-2">
          Tasks
        </h2>
        <div className="space-y-4">
          {activeTasks.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No active tasks. Add a task to get started!</p>
          ) : (
            activeTasks.map(task => (
              <div key={task.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-[var(--theme-color)]">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                <p className="text-gray-700 mb-3">{task.description}</p>
                <p className="text-sm text-gray-600 mb-4">
                  {new Date(task.deadline).toLocaleDateString()} ({getDaysRemaining(task.deadline)})
                </p>
                <button
                  onClick={() => {
                    setTaskToComplete(task.id)
                    setShowConfirmModal(true)
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Done
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-[var(--theme-color)] pb-2">
          Done Tasks
        </h2>
        <div className="space-y-4">
          {completedTasks.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No completed tasks yet.</p>
          ) : (
            completedTasks.map(task => (
              <div key={task.id} className="bg-gray-50 rounded-lg shadow p-6 border-l-4 border-gray-400">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">{task.title}</h3>
                <p className="text-gray-600 mb-3">{task.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(task.deadline).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Task Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="px-6 py-3 bg-[var(--theme-color)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
      >
        Add Task
      </button>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h3 className="text-xl font-bold mb-6">Add New Task</h3>
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
                 Add Task
               </button>
             </div>
           </form>
         </div>
       </div>
     )}

     {/* Confirmation Modal */}
     {showConfirmModal && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white rounded-lg p-8 w-full max-w-md">
           <h3 className="text-xl font-bold mb-4">Confirm Action</h3>
           <p className="mb-6">Are you sure this task is done?</p>
           <div className="flex justify-end space-x-4">
             <button
               onClick={() => setShowConfirmModal(false)}
               className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
             >
               Cancel
             </button>
             <button
               onClick={() => taskToComplete && markTaskDone(taskToComplete)}
               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
             >
               Yes, Mark as Done
             </button>
           </div>
         </div>
       </div>
     )}
   </div>
 )
}