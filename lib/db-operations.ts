import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  orderBy,
  limit,
  startAfter,
  type DocumentData,
  type QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Product, Category } from "@/lib/product-data"
import type { CartItem } from "@/context/cart-context"

// Products
export async function fetchProducts(limitCount = 20) {
  try {
    const productsRef = collection(db, "products")
    const q = query(productsRef, orderBy("createdAt", "desc"), limit(limitCount))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

export async function fetchMoreProducts(lastDoc: QueryDocumentSnapshot<DocumentData>, limitCount = 20) {
  try {
    const productsRef = collection(db, "products")
    const q = query(productsRef, orderBy("createdAt", "desc"), startAfter(lastDoc), limit(limitCount))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch (error) {
    console.error("Error fetching more products:", error)
    throw error
  }
}

// Update the fetchProductById function to handle offline scenarios better

export async function fetchProductById(productId: string) {
  try {
    // Check if we're offline first
    if (!navigator.onLine) {
      console.log("Device is offline, trying to get product from cache only")

      // Try to get from IndexedDB if available
      try {
        const cachedProduct = await getCachedProductFromIndexedDB(productId)
        if (cachedProduct) {
          console.log("Found product in IndexedDB cache")
          return cachedProduct
        }
      } catch (cacheError) {
        console.error("Error accessing IndexedDB cache:", cacheError)
      }

      // If we couldn't get from cache, throw a more user-friendly error
      throw new Error("You are currently offline. Please check your connection and try again.")
    }

    // If online, proceed with Firestore fetch
    const docRef = doc(db, "products", productId)

    // Add timeout to Firestore operation
    const docSnap = (await Promise.race([
      getDoc(docRef),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out. Please try again.")), 5000)),
    ])) as any

    if (docSnap.exists()) {
      const product = {
        id: docSnap.id,
        ...docSnap.data(),
      } as Product

      // Cache the product in IndexedDB for offline access
      try {
        await cacheProductInIndexedDB(product)
      } catch (cacheError) {
        console.error("Failed to cache product in IndexedDB:", cacheError)
        // Continue even if caching fails
      }

      return product
    } else {
      return null
    }
  } catch (error) {
    console.error("Error fetching product:", error)

    // Try to get from IndexedDB as fallback if Firestore fails
    try {
      const cachedProduct = await getCachedProductFromIndexedDB(productId)
      if (cachedProduct) {
        console.log("Firestore fetch failed, using cached product")
        return cachedProduct
      }
    } catch (cacheError) {
      console.error("Error accessing IndexedDB cache:", cacheError)
    }

    throw error
  }
}

// Helper function to cache product in IndexedDB
async function cacheProductInIndexedDB(product: Product): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open("shapna-products-cache", 1)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains("products")) {
          db.createObjectStore("products", { keyPath: "id" })
        }
      }

      request.onsuccess = () => {
        const db = request.result
        const tx = db.transaction("products", "readwrite")
        const store = tx.objectStore("products")

        store.put({
          ...product,
          timestamp: Date.now(),
        })

        tx.oncomplete = () => resolve()
        tx.onerror = (event) => reject(event)
      }

      request.onerror = (event) => reject(event)
    } catch (error) {
      reject(error)
    }
  })
}

// Helper function to get cached product from IndexedDB
async function getCachedProductFromIndexedDB(productId: string): Promise<Product | null> {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open("shapna-products-cache", 1)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains("products")) {
          db.createObjectStore("products", { keyPath: "id" })
        }
      }

      request.onsuccess = () => {
        const db = request.result
        const tx = db.transaction("products", "readonly")
        const store = tx.objectStore("products")

        const getRequest = store.get(productId)

        getRequest.onsuccess = () => {
          if (getRequest.result) {
            resolve(getRequest.result)
          } else {
            resolve(null)
          }
        }

        getRequest.onerror = (event) => reject(event)
      }

      request.onerror = (event) => reject(event)
    } catch (error) {
      reject(error)
    }
  })
}

export async function fetchProductsByCategory(categoryId: string, limitCount = 20) {
  try {
    const productsRef = collection(db, "products")
    const q = query(productsRef, where("category", "==", categoryId), orderBy("createdAt", "desc"), limit(limitCount))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch (error) {
    console.error("Error fetching products by category:", error)
    throw error
  }
}

export async function fetchFeaturedProducts(limitCount = 4) {
  try {
    const productsRef = collection(db, "products")
    const q = query(productsRef, where("featured", "==", true), limit(limitCount))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch (error) {
    console.error("Error fetching featured products:", error)
    throw error
  }
}

export async function fetchNewProducts(limitCount = 8) {
  try {
    const productsRef = collection(db, "products")
    const q = query(productsRef, where("isNew", "==", true), limit(limitCount))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch (error) {
    console.error("Error fetching new products:", error)
    throw error
  }
}

export async function fetchSaleProducts(limitCount = 8) {
  try {
    const productsRef = collection(db, "products")
    const q = query(productsRef, where("isOnSale", "==", true), limit(limitCount))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch (error) {
    console.error("Error fetching sale products:", error)
    throw error
  }
}

export async function searchProducts(searchTerm: string, limitCount = 20) {
  try {
    // Basic search implementation - in a real app, you might want to use Algolia or another search service
    const productsRef = collection(db, "products")
    const querySnapshot = await getDocs(productsRef)

    const results = querySnapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Product,
      )
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))),
      )
      .slice(0, limitCount)

    return results
  } catch (error) {
    console.error("Error searching products:", error)
    throw error
  }
}

// Categories
export async function fetchCategories() {
  try {
    const categoriesRef = collection(db, "categories")
    const querySnapshot = await getDocs(categoriesRef)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[]
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export async function fetchCategoryById(categoryId: string) {
  try {
    const docRef = doc(db, "categories", categoryId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Category
    } else {
      return null
    }
  } catch (error) {
    console.error("Error fetching category:", error)
    throw error
  }
}

// Orders
export interface Order {
  id?: string
  userId: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: string
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zipCode: string
    phone: string
  }
  createdAt?: any
  updatedAt?: any
}

export async function createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) {
  try {
    const ordersRef = collection(db, "orders")
    const newOrder = {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(ordersRef, newOrder)
    return {
      id: docRef.id,
      ...newOrder,
    }
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export async function fetchOrdersByUser(userId: string) {
  try {
    const ordersRef = collection(db, "orders")
    const q = query(ordersRef, where("userId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[]
  } catch (error) {
    console.error("Error fetching user orders:", error)
    throw error
  }
}

export async function fetchOrderById(orderId: string) {
  try {
    const docRef = doc(db, "orders", orderId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Order
    } else {
      return null
    }
  } catch (error) {
    console.error("Error fetching order:", error)
    throw error
  }
}

export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  try {
    const orderRef = doc(db, "orders", orderId)
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}

// User profiles
export interface UserProfile {
  id?: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  addresses?: {
    id: string
    name: string
    address: string
    city: string
    state: string
    zipCode: string
    isDefault: boolean
  }[]
  wishlist?: string[]
  createdAt?: any
  updatedAt?: any
}

export async function createUserProfile(userData: Omit<UserProfile, "id" | "createdAt" | "updatedAt">) {
  try {
    // Use userId as the document ID for easy retrieval
    const userRef = doc(db, "userProfiles", userData.userId)
    const newUser = {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await setDoc(userRef, newUser)
    return {
      id: userData.userId,
      ...newUser,
    }
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

export async function fetchUserProfile(userId: string) {
  try {
    const docRef = doc(db, "userProfiles", userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as UserProfile
    } else {
      return null
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

export async function updateUserProfile(userId: string, userData: Partial<UserProfile>) {
  try {
    const userRef = doc(db, "userProfiles", userId)
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// Wishlist operations
export async function addToWishlist(userId: string, productId: string) {
  try {
    const userRef = doc(db, "userProfiles", userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data() as UserProfile
      const wishlist = userData.wishlist || []

      if (!wishlist.includes(productId)) {
        await updateDoc(userRef, {
          wishlist: [...wishlist, productId],
          updatedAt: serverTimestamp(),
        })
      }

      return true
    } else {
      throw new Error("User profile not found")
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    throw error
  }
}

export async function removeFromWishlist(userId: string, productId: string) {
  try {
    const userRef = doc(db, "userProfiles", userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data() as UserProfile
      const wishlist = userData.wishlist || []

      await updateDoc(userRef, {
        wishlist: wishlist.filter((id) => id !== productId),
        updatedAt: serverTimestamp(),
      })

      return true
    } else {
      throw new Error("User profile not found")
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    throw error
  }
}

export async function fetchWishlistProducts(userId: string) {
  try {
    const userRef = doc(db, "userProfiles", userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data() as UserProfile
      const wishlist = userData.wishlist || []

      if (wishlist.length === 0) {
        return []
      }

      const products: Product[] = []

      for (const productId of wishlist) {
        const product = await fetchProductById(productId)
        if (product) {
          products.push(product)
        }
      }

      return products
    } else {
      throw new Error("User profile not found")
    }
  } catch (error) {
    console.error("Error fetching wishlist products:", error)
    throw error
  }
}

// Data seeding function (for development)
export async function seedDatabase() {
  try {
    const batch = writeBatch(db)

    // Seed categories
    const categoriesRef = collection(db, "categories")
    const categories = [
      {
        id: "clothing",
        name: "Clothing",
        image:
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        productCount: 42,
      },
      {
        id: "shoes",
        name: "Shoes",
        image:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        productCount: 24,
      },
      // Add more categories as needed
    ]

    categories.forEach((category) => {
      const docRef = doc(categoriesRef, category.id)
      batch.set(docRef, {
        name: category.name,
        image: category.image,
        productCount: category.productCount,
        createdAt: serverTimestamp(),
      })
    })

    // Seed products
    const productsRef = collection(db, "products")
    const products = [
      {
        id: "1",
        name: "Premium Cotton T-Shirt",
        price: 599,
        originalPrice: 799,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        ],
        description:
          "100% organic cotton t-shirt with premium finish. Minimalist design and modern cut that adapts to any style.",
        category: "clothing",
        isOnSale: true,
        featured: true,
        stock: 12,
        sku: "TS-001-BLK",
        tags: ["cotton", "casual", "summer"],
        rating: 4.8,
        reviewCount: 124,
      },
      // Add more products as needed
    ]

    products.forEach((product) => {
      const docRef = doc(productsRef, product.id)
      batch.set(docRef, {
        ...product,
        createdAt: serverTimestamp(),
      })
    })

    await batch.commit()
    console.log("Database seeded successfully")
    return true
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}

