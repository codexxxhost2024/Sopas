"use client"

import { useState, useEffect } from "react"
import { isOnline } from "@/lib/utils"

interface OfflineSyncOptions {
  key: string
  onSync?: (data: any[]) => Promise<void>
}

export function useOfflineSync<T>({ key, onSync }: OfflineSyncOptions) {
  const [offlineData, setOfflineData] = useState<T[]>([])
  const [isSyncing, setIsSyncing] = useState(false)

  // Load offline data from localStorage
  useEffect(() => {
    const loadOfflineData = () => {
      try {
        const savedData = localStorage.getItem(key)
        if (savedData) {
          setOfflineData(JSON.parse(savedData))
        }
      } catch (error) {
        console.error(`Failed to load offline data for ${key}:`, error)
      }
    }

    loadOfflineData()
  }, [key])

  // Save offline data to localStorage whenever it changes
  useEffect(() => {
    if (offlineData.length > 0) {
      localStorage.setItem(key, JSON.stringify(offlineData))
    }
  }, [offlineData, key])

  // Sync data when coming back online
  useEffect(() => {
    const handleOnline = async () => {
      if (offlineData.length > 0 && onSync) {
        setIsSyncing(true)
        try {
          await onSync(offlineData)
          // Clear offline data after successful sync
          setOfflineData([])
          localStorage.removeItem(key)
        } catch (error) {
          console.error(`Failed to sync offline data for ${key}:`, error)
        } finally {
          setIsSyncing(false)
        }
      }
    }

    window.addEventListener("online", handleOnline)

    // Check if we're online and have data to sync
    if (isOnline() && offlineData.length > 0 && onSync) {
      handleOnline()
    }

    return () => {
      window.removeEventListener("online", handleOnline)
    }
  }, [offlineData, key, onSync])

  // Function to add data to offline storage
  const addOfflineData = (data: T) => {
    setOfflineData((prev) => [...prev, data])
  }

  return {
    offlineData,
    addOfflineData,
    isSyncing,
  }
}

