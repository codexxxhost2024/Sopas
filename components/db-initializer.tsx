"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { seedDatabase } from "@/lib/db-operations"
import { useToast } from "@/components/ui/use-toast"

export function DbInitializer() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const { toast } = useToast()

  // Check if database has been initialized
  useEffect(() => {
    const checkInitialization = () => {
      const initialized = localStorage.getItem("db-initialized")
      if (initialized === "true") {
        setIsInitialized(true)
      }
    }

    checkInitialization()
  }, [])

  const handleInitializeDb = async () => {
    setIsInitializing(true)
    try {
      await seedDatabase()
      localStorage.setItem("db-initialized", "true")
      setIsInitialized(true)
      toast({
        title: "Database initialized",
        description: "Sample data has been loaded successfully.",
      })
    } catch (error) {
      console.error("Error initializing database:", error)
      toast({
        title: "Initialization failed",
        description: "There was a problem loading sample data.",
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  if (isInitialized) {
    return null
  }

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <Button onClick={handleInitializeDb} disabled={isInitializing} className="bg-red-600 hover:bg-red-700">
        {isInitializing ? "Initializing..." : "Initialize Database"}
      </Button>
    </div>
  )
}

