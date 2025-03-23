"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // Check initial online status
    setIsOffline(!navigator.onLine)

    // Add event listeners for online/offline events
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <Alert variant="destructive" className="rounded-none">
      <WifiOff className="h-4 w-4 mr-2" />
      <AlertDescription>You are currently offline. Some features may be limited.</AlertDescription>
    </Alert>
  )
}

