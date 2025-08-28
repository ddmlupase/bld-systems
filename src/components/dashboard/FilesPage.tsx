'use client'
import { useState, useEffect } from 'react'

interface Link {
  id: string
  title: string
  description: string
  url: string
  type: string
}

interface FilesPageProps {
  currentProject: 'sia' | 'techno'
}

export default function FilesPage({ currentProject }: FilesPageProps) {
  const [canvaLinks, setCanvaLinks] = useState<Link[]>([])
  const [githubLinks, setGithubLinks] = useState<Link[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentLinkType, setCurrentLinkType] = useState<'canva' | 'github'>('canva')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: ''
  })

  useEffect(() => {
    fetchLinks()
  }, [currentProject])

  const fetchLinks = async () => {
    setLoading(true)
    setError(null)
    try {
      const [canvaResponse, githubResponse] = await Promise.all([
        fetch(`/api/links?project=${currentProject}&type=canva`),
        fetch(`/api/links?project=${currentProject}&type=github`)
      ])

      if (canvaResponse.ok) {
        const canvaData = await canvaResponse.json()
        setCanvaLinks(canvaData)
      } else {
        throw new Error('Failed to fetch Canva links')
      }

      if (githubResponse.ok) {
        const githubData = await githubResponse.json()
        setGithubLinks(githubData)
      } else {
        throw new Error('Failed to fetch GitHub links')
      }
    } catch (error) {
      console.error('Error fetching links:', error)
      setError('Failed to load links. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type: currentLinkType,
          project: currentProject
        }),
      })

      if (response.ok) {
        await fetchLinks()
        setShowAddModal(false)
        setFormData({ title: '', description: '', url: '' })
      } else {
        throw new Error('Failed to create link')
      }
    } catch (error) {
      console.error('Error creating link:', error)
      setError('Failed to add link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLink = async (linkId: string, linkType: 'canva' | 'github') => {
    if (!confirm('Are you sure you want to delete this link?')) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchLinks()
      } else {
        throw new Error('Failed to delete link')
      }
    } catch (error) {
      console.error('Error deleting link:', error)
      setError('Failed to delete link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const openAddLinkModal = (type: 'canva' | 'github') => {
    setCurrentLinkType(type)
    setShowAddModal(true)
    setError(null)
  }

  const closeModal = () => {
    setShowAddModal(false)
    setFormData({ title: '', description: '', url: '' })
    setError(null)
  }

  return (
    <div className="space-y-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}

      {/* File Storage */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2">
          File Storage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => window.open('https://drive.google.com', '_blank')}
            className="bg-white rounded-lg shadow p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-5xl mb-4">📁</div>
            <h3 className="text-lg font-semibold mb-2">Google Drive</h3>
            <p className="text-gray-600">Access shared files and documents</p>
          </div>
        </div>
      </div>

      {/* Canva Links */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2">
          Canva Links
        </h2>
        <div className="bg-white rounded-lg shadow p-6">
          {canvaLinks.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No Canva links added yet.</p>
          ) : (
            <div className="space-y-4">
              {canvaLinks.map(link => (
                <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{link.title}</h3>
                    <button
                      onClick={() => handleDeleteLink(link.id, 'canva')}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-gray-600 mb-3">{link.description}</p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm break-all"
                  >
                    {link.url}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => openAddLinkModal('canva')}
          disabled={loading}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Canva Link
        </button>
      </div>

      {/* GitHub Links */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2">
          GitHub Links
        </h2>
        <div className="bg-white rounded-lg shadow p-6">
          {githubLinks.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No GitHub links added yet.</p>
          ) : (
            <div className="space-y-4">
              {githubLinks.map(link => (
                <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{link.title}</h3>
                    <button
                      onClick={() => handleDeleteLink(link.id, 'github')}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-gray-600 mb-3">{link.description}</p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm break-all"
                  >
                    {link.url}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => openAddLinkModal('github')}
          disabled={loading}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add GitHub Link
        </button>
      </div>

      {/* Add Link Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h3 className="text-xl font-bold mb-6">
              Add {currentLinkType === 'canva' ? 'Canva' : 'GitHub'} Link
            </h3>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 h-20 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  required
                  disabled={loading}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}