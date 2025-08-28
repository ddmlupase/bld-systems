'use client'
import { useState, useEffect } from 'react'

interface Member {
  id: string
  username: string
  email: string
  name: string
  role: string
}

export default function HomePage() {
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Members Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-[var(--theme-color)] pb-2">
          Members
        </h2>
        <div className="space-y-4">
          {members.map(member => (
            <div key={member.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-[var(--theme-color)] mb-2">
                {member.name || member.username}
              </h3>
              <p className="text-gray-600 mb-1 capitalize">{member.role}</p>
              <p className="text-gray-500 text-sm">{member.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About Us Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-[var(--theme-color)] pb-2">
          About Us
        </h2>
        <div className="bg-white rounded-lg shadow p-8">
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold text-[var(--theme-color)] mb-4">
              What is BLD Systems?
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              BLD Systems is a comprehensive project management platform designed to streamline 
              collaboration and enhance productivity for academic and professional projects. Our 
              system provides intuitive tools for task management, file organization, and team coordination.
            </p>

            <h3 className="text-xl font-semibold text-[var(--theme-color)] mb-4">
              Our Mission
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We strive to empower teams with the tools they need to succeed in their projects, 
              whether they&apos;re working on Systems Integration and Architecture (SIA) or 
              Technopreneurship initiatives. Our platform bridges the gap between planning and execution.
            </p>

            <h3 className="text-xl font-semibold text-[var(--theme-color)] mb-4">
              Key Features
            </h3>
            <div className="text-gray-700 mb-6">
              <p>• Comprehensive task management with deadline tracking</p>
              <p>• Centralized file storage and organization</p>
              <p>• Interactive calendar with milestone visualization</p>
              <p>• Multi-project support with customizable themes</p>
              <p>• User-friendly interface designed for team collaboration</p>
            </div>

            <h3 className="text-xl font-semibold text-[var(--theme-color)] mb-4">
              Why Choose BLD Systems?
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Our platform is built with simplicity and efficiency in mind. We understand that 
              successful projects require clear communication, organized workflows, and reliable 
              tracking mechanisms. BLD Systems provides all these elements in one cohesive platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}