"use client"

import { useEffect } from "react"
import { supportsServiceWorker } from "@/lib/utils"

export function RegisterSW() {
  useEffect(() => {
    const registerServiceWorker = async () => {
      if (!supportsServiceWorker()) {
        console.log("Service workers are not supported in this browser")
        return
      }

      try {
        // Register service worker
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        })
        console.log("Service Worker registered successfully:", registration.scope)

        // Request notification permission
        if ("Notification" in window) {
          const permission = await Notification.requestPermission()
          console.log("Notification permission:", permission)
        }

        // Set up background sync
        if ("SyncManager" in window) {
          navigator.serviceWorker.ready.then((registration) => {
            // Register a sync event for forms
            // This would be triggered when submitting forms while offline
            // registration.sync.register('sync-forms');
            console.log("Background sync supported")
          })
        }

        // Check for updates periodically
        setInterval(
          () => {
            registration.update()
          },
          1000 * 60 * 60,
        ) // Check for updates every hour
      } catch (error) {
        console.error("Service Worker registration failed:", error)
      }
    }

    // Register service worker when the window loads
    window.addEventListener("load", registerServiceWorker)

    // Request other permissions when needed
    const requestPermissions = async () => {
      // Request geolocation permission when needed
      if ("geolocation" in navigator) {
        try {
          await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              maximumAge: 600000,
            })
          })
          console.log("Geolocation permission granted")
        } catch (error) {
          console.log("Geolocation permission denied or error:", error)
        }
      }
    }

    // Only request permissions on user interaction
    // This is a placeholder - you would call this function on a button click
    // document.getElementById('permission-button')?.addEventListener('click', requestPermissions);

    return () => {
      window.removeEventListener("load", registerServiceWorker)
    }
  }, [])

  return null
}

