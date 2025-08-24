'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { IProject } from '@/types'

interface ProjectContextType {
  projects: IProject[]
  selectedProject: IProject | null
  setSelectedProject: (project: IProject | null) => void
  loading: boolean
  error: string | null
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<IProject[]>([])
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/projects')
        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }
        const data = await response.json()
        setProjects(data)
        if (data.length > 0) {
          setSelectedProject(data[0])
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <ProjectContext.Provider value={{ projects, selectedProject, setSelectedProject, loading, error }}>
      {children}
    </ProjectContext.Provider>
  )
}

export const useProject = () => {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}
