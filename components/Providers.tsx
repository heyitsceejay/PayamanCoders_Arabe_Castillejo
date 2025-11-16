'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { CounterProvider } from '@/contexts/CounterContext'
import { MessagingProvider } from '@/contexts/MessagingContext'
import { RealtimeProvider } from '@/contexts/RealtimeContext'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <RealtimeProvider>
        <CounterProvider>
          <MessagingProvider>
            {children}
          </MessagingProvider>
        </CounterProvider>
      </RealtimeProvider>
    </AuthProvider>
  )
}