import { RefreshCw } from 'lucide-react'

interface RefreshButtonProps {
  onRefresh: () => void
  refreshing: boolean
  lastUpdated?: Date
  className?: string
}

export default function RefreshButton({
  onRefresh,
  refreshing,
  lastUpdated,
  className = ''
}: RefreshButtonProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="group relative flex items-center justify-center h-10 w-10 rounded-xl border-2 border-primary-500/40 bg-white/70 text-primary-600 shadow-lg backdrop-blur-xl hover:border-primary-500/70 hover:bg-white/90 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Refresh data"
      >
        <RefreshCw
          className={`h-5 w-5 ${
            refreshing
              ? 'animate-spin'
              : 'group-hover:rotate-180 transition-transform duration-500'
          }`}
        />
      </button>
      {lastUpdated && (
        <span className="text-xs text-gray-500">
          Updated: {lastUpdated.toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}
