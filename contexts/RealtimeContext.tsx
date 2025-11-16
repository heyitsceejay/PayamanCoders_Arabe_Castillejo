'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface RealtimeContextType {
  unreadNotifications: number
  unreadMessages: number
  refreshNotifications: () => Promise<void>
  refreshMessages: () => Promise<void>
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)

  const refreshNotifications = async () => {
    if (!user) return
    
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        const unread = data.notifications?.filter((n: any) => !n.read).length || 0
        setUnreadNotifications(unread)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const refreshMessages = async () => {
    if (!user) return
    
    try {
      const response = await fetch('/api/messages/conversations')
      if (response.ok) {
        const data = await response.json()
        const unread = data.conversations?.reduce((total: number, conv: any) => {
          return total + (conv.unreadCount || 0)
        }, 0) || 0
        setUnreadMessages(unread)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  // Initial fetch when user logs in
  useEffect(() => {
    if (user) {
      refreshNotifications()
      refreshMessages()
    } else {
      setUnreadNotifications(0)
      setUnreadMessages(0)
    }
  }, [user])

  // Poll for updates every 30 seconds
  useEffect(() => {
    if (!user) return

    const notificationInterval = setInterval(refreshNotifications, 30000)
    const messageInterval = setInterval(refreshMessages, 30000)

    return () => {
      clearInterval(notificationInterval)
      clearInterval(messageInterval)
    }
  }, [user])

  return (
    <RealtimeContext.Provider
      value={{
        unreadNotifications,
        unreadMessages,
        refreshNotifications,
        refreshMessages,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  )
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}
