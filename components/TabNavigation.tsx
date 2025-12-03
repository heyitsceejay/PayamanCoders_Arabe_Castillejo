'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
}

interface TabNavigationProps {
  tabs: Tab[]
  defaultTab?: string
  onTabChange?: (tabId: string) => void
  children: (activeTab: string) => React.ReactNode
}

export default function TabNavigation({ 
  tabs, 
  defaultTab, 
  onTabChange,
  children 
}: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '')

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-3 min-w-max pb-2">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                relative px-6 py-3 rounded-xl font-semibold text-base
                transition-all duration-300 flex items-center gap-2
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/40 scale-105'
                  : 'bg-white/70 backdrop-blur border border-primary-500/20 text-gray-700 hover:border-primary-500/40 hover:shadow-md'
                }
              `}
              style={{ '--float-delay': `${index * 0.1}s` } as CSSProperties}
            >
              {tab.icon && (
                <span className={`
                  flex items-center justify-center w-6 h-6 rounded-lg
                  ${activeTab === tab.id 
                    ? 'bg-white/20' 
                    : 'bg-primary-500/10'
                  }
                `}>
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-[floatUp_0.5s_ease-out]">
        {children(activeTab)}
      </div>
    </div>
  )
}
