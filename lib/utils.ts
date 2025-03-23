import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Update the formatCurrency function to use PHP instead of MXN
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount)
}

// Check if we're running in the browser
export const isBrowser = typeof window !== "undefined"

// Function to check if the app is installed (PWA)
export function isPWAInstalled(): boolean {
  if (!isBrowser) return false

  // Check if the display mode is standalone or fullscreen
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    // @ts-ignore - Safari specific
    window.navigator.standalone === true
  )
}

// Function to check if the browser supports service workers
export function supportsServiceWorker(): boolean {
  return isBrowser && "serviceWorker" in navigator
}

// Function to check if the device is online
export function isOnline(): boolean {
  return isBrowser ? navigator.onLine : true
}

