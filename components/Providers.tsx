'use client'

import { SessionProvider } from 'next-auth/react'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <FluentProvider theme={webLightTheme}>
        {children}
      </FluentProvider>
    </SessionProvider>
  )
}