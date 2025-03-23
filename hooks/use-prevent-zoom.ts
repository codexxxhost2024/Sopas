"use client"

import { useEffect } from "react"

export function usePreventZoom() {
  useEffect(() => {
    // Prevent pinch zoom
    const handleTouchMove = (e: TouchEvent) => {
      // Only prevent pinch zoom, allow scrolling
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    // Prevent double-tap zoom
    let lastTouchEnd = 0
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        // Only prevent default for elements that might cause zoom
        // Don't interfere with scrolling or clicking buttons
        const targetElement = e.target as HTMLElement
        const targetTag = targetElement.tagName.toLowerCase()
        const clickableElements = ["a", "button", "input", "textarea", "select", "label"]

        if (!clickableElements.includes(targetTag) && e.touches.length === 0) {
          e.preventDefault()
        }
      }
      lastTouchEnd = now
    }

    // Add event listeners
    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchend", handleTouchEnd, { passive: false })

    // Clean up
    return () => {
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [])
}

