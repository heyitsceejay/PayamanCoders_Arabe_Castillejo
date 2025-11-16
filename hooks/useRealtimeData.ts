import { useState, useEffect, useCallback } from 'react'

interface UseRealtimeDataOptions<T> {
  fetchFn: () => Promise<T>
  interval?: number // in milliseconds, default 30000 (30 seconds)
  enabled?: boolean // whether to enable auto-refresh
  dependencies?: any[] // dependencies that trigger refetch
}

export function useRealtimeData<T>({
  fetchFn,
  interval = 30000,
  enabled = true,
  dependencies = []
}: UseRealtimeDataOptions<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true)
      
      const result = await fetchFn()
      setData(result)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
      if (isManualRefresh) setRefreshing(false)
    }
  }, [fetchFn, ...dependencies])

  const refresh = useCallback(() => {
    fetchData(true)
  }, [fetchData])

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchData()
    }
  }, [enabled, ...dependencies])

  // Auto-refresh interval
  useEffect(() => {
    if (!enabled) return

    const intervalId = setInterval(() => {
      fetchData()
    }, interval)

    return () => clearInterval(intervalId)
  }, [enabled, interval, fetchData])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refreshing,
    refresh
  }
}
