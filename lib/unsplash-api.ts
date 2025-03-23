import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Interface for cached image data
interface CachedImage {
  url: string
  thumbnailUrl: string
  authorName: string
  authorUrl: string
  timestamp: number
}

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000

/**
 * Fetch an image from Unsplash based on search query
 * NOTE: This function now ONLY returns fallback images due to API authentication issues
 */
export async function fetchUnsplashImage(
  query: string,
  options: { width?: number; height?: number; fallbackUrl?: string } = {},
): Promise<{
  url: string
  thumbnailUrl: string
  authorName: string
  authorUrl: string
} | null> {
  const { fallbackUrl = "/placeholder.svg" } = options

  try {
    // First, try to get from IndexedDB cache
    const cachedImage = await getCachedImage(query)
    if (cachedImage) {
      return {
        url: cachedImage.url,
        thumbnailUrl: cachedImage.thumbnailUrl,
        authorName: cachedImage.authorName,
        authorUrl: cachedImage.authorUrl,
      }
    }

    // Skip Unsplash API entirely and just return the fallback
    console.log(`Using fallback image for "${query}" - Unsplash API disabled`)
    return {
      url: fallbackUrl,
      thumbnailUrl: fallbackUrl,
      authorName: "ShapNa",
      authorUrl: "",
    }
  } catch (error) {
    console.error("Error in fetchUnsplashImage:", error)
    // Return fallback if provided
    return {
      url: fallbackUrl,
      thumbnailUrl: fallbackUrl,
      authorName: "ShapNa",
      authorUrl: "",
    }
  }
}

/**
 * Cache image data in IndexedDB
 */
async function cacheImage(query: string, imageData: CachedImage): Promise<void> {
  try {
    // Always try to cache in IndexedDB
    const indexedDB = await openImageCache()
    const tx = indexedDB.transaction("images", "readwrite")
    const store = tx.objectStore("images")
    await store.put({
      id: query,
      ...imageData,
    })
    await tx.complete

    // Only try to cache in Firestore if online
    if (navigator.onLine) {
      try {
        const cacheRef = doc(db, "imageCache", query)
        await setDoc(cacheRef, {
          ...imageData,
          id: query,
        })
      } catch (firestoreError) {
        console.error("Error caching image in Firestore:", firestoreError)
        // Continue execution - caching in Firestore is not critical
      }
    }
  } catch (error) {
    console.error("Failed to cache image:", error)
  }
}

/**
 * Get cached image data from IndexedDB
 */
async function getCachedImage(query: string): Promise<CachedImage | null> {
  try {
    // Try IndexedDB first
    const indexedDB = await openImageCache()
    const tx = indexedDB.transaction("images", "readonly")
    const store = tx.objectStore("images")
    const cachedData = await store.get(query)

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION) {
      return cachedData
    }

    // If not in IndexedDB or expired, try Firestore only if online
    if (navigator.onLine) {
      try {
        const cacheRef = doc(db, "imageCache", query)

        // Wrap Firestore operation in a timeout to handle potential network issues
        const docSnap = (await Promise.race([
          getDoc(cacheRef),
          new Promise<null>((_, reject) => setTimeout(() => reject(new Error("Firestore operation timed out")), 3000)),
        ])) as any

        if (docSnap && docSnap.exists && docSnap.exists() && Date.now() - docSnap.data().timestamp < CACHE_EXPIRATION) {
          const firestoreData = docSnap.data() as CachedImage

          // Update IndexedDB with Firestore data
          const writeTx = indexedDB.transaction("images", "readwrite")
          const writeStore = writeTx.objectStore("images")
          await writeStore.put({
            id: query,
            ...firestoreData,
          })
          await writeTx.complete

          return firestoreData
        }
      } catch (firestoreError) {
        console.log("Skipping Firestore cache due to network issue:", firestoreError.message)
        // Silently continue - we'll return IndexedDB data or null
      }
    }

    return null
  } catch (error) {
    console.error("Failed to get cached image:", error)
    return null
  }
}

/**
 * Open IndexedDB for image cache
 */
function openImageCache(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("shapna-image-cache", 1)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "id" })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Generate a search query for a product
 */
export function generateProductImageQuery(product: { name: string; category: string; tags?: string[] }): string {
  // Start with the product name
  let query = product.name

  // Add category if it would help
  if (!query.toLowerCase().includes(product.category.toLowerCase())) {
    query += ` ${product.category}`
  }

  // Add the first tag if available and relevant
  if (product.tags && product.tags.length > 0) {
    const relevantTag = product.tags.find((tag) => !query.toLowerCase().includes(tag.toLowerCase()))
    if (relevantTag) {
      query += ` ${relevantTag}`
    }
  }

  return query
}

/**
 * Preload product images - now a no-op function since we're not using Unsplash
 */
export async function preloadProductImages(
  products: Array<{ name: string; category: string; tags?: string[] }>,
): Promise<void> {
  // Skip preloading entirely - we're not using Unsplash API anymore
  console.log("Image preloading disabled - using local placeholders instead")
  return Promise.resolve()
}

