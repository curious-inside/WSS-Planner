'use client'

import { SessionProvider } from 'next-auth/react'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import { ProjectProvider } from '@/contexts/ProjectContext'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ProjectProvider>
        <FluentProvider theme={webLightTheme}>
          {children}
        </FluentProvider>
      </ProjectProvider>
    </SessionProvider>
  )
}