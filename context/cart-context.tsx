"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useOfflineSync } from "@/hooks/use-offline-sync"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  const { addOfflineData, offlineData, isSyncing } = useOfflineSync<{
    action: "add" | "remove" | "update" | "clear"
    item?: CartItem
    id?: string
    quantity?: number
  }>({
    key: "cart-offline-actions",
    onSync: async (actions) => {
      if (!user) return

      // Process all offline actions in sequence
      for (const action of actions) {
        if (action.action === "add" && action.item) {
          await addToFirestore(action.item)
        } else if (action.action === "remove" && action.id) {
          await removeFromFirestore(action.id)
        } else if (action.action === "update" && action.id && action.quantity) {
          await updateQuantityInFirestore(action.id, action.quantity)
        } else if (action.action === "clear") {
          await clearFirestoreCart()
        }
      }
    },
  })

  // Load cart from Firestore or localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true)
      try {
        if (user) {
          // User is logged in, load from Firestore
          const cartRef = doc(db, "carts", user.uid)
          const cartSnap = await getDoc(cartRef)

          if (cartSnap.exists()) {
            const cartData = cartSnap.data()
            setItems(cartData.items || [])
          } else {
            // No cart exists yet, create one
            await setDoc(cartRef, {
              items: [],
              updatedAt: serverTimestamp(),
            })
            setItems([])
          }
        } else {
          // User is not logged in, load from localStorage
          const savedCart = localStorage.getItem("cart")
          if (savedCart) {
            try {
              setItems(JSON.parse(savedCart))
            } catch (e) {
              console.error("Failed to parse cart from localStorage", e)
            }
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error)
        toast({
          title: "Error loading cart",
          description: "There was a problem loading your cart. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [user, toast])

  // Save cart to localStorage whenever it changes (for non-logged in users)
  useEffect(() => {
    if (!user && !isLoading) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, user, isLoading])

  // Helper functions for Firestore operations
  const addToFirestore = async (newItem: Omit<CartItem, "quantity">) => {
    if (!user) return

    try {
      const cartRef = doc(db, "carts", user.uid)
      const cartSnap = await getDoc(cartRef)

      if (cartSnap.exists()) {
        const cartData = cartSnap.data()
        const currentItems = cartData.items || []
        const existingItemIndex = currentItems.findIndex((item: CartItem) => item.id === newItem.id)

        let updatedItems
        if (existingItemIndex >= 0) {
          // Item exists, increment quantity
          updatedItems = [...currentItems]
          updatedItems[existingItemIndex].quantity += 1
        } else {
          // Item doesn't exist, add it
          updatedItems = [...currentItems, { ...newItem, quantity: 1 }]
        }

        await updateDoc(cartRef, {
          items: updatedItems,
          updatedAt: serverTimestamp(),
        })
      } else {
        // Cart doesn't exist, create it
        await setDoc(cartRef, {
          items: [{ ...newItem, quantity: 1 }],
          updatedAt: serverTimestamp(),
        })
      }
    } catch (error) {
      console.error("Error adding item to Firestore cart:", error)
      throw error
    }
  }

  const removeFromFirestore = async (id: string) => {
    if (!user) return

    try {
      const cartRef = doc(db, "carts", user.uid)
      const cartSnap = await getDoc(cartRef)

      if (cartSnap.exists()) {
        const cartData = cartSnap.data()
        const updatedItems = (cartData.items || []).filter((item: CartItem) => item.id !== id)

        await updateDoc(cartRef, {
          items: updatedItems,
          updatedAt: serverTimestamp(),
        })
      }
    } catch (error) {
      console.error("Error removing item from Firestore cart:", error)
      throw error
    }
  }

  const updateQuantityInFirestore = async (id: string, quantity: number) => {
    if (!user) return

    try {
      const cartRef = doc(db, "carts", user.uid)
      const cartSnap = await getDoc(cartRef)

      if (cartSnap.exists()) {
        const cartData = cartSnap.data()
        const currentItems = cartData.items || []

        if (quantity < 1) {
          // Remove item if quantity is less than 1
          const updatedItems = currentItems.filter((item: CartItem) => item.id !== id)
          await updateDoc(cartRef, {
            items: updatedItems,
            updatedAt: serverTimestamp(),
          })
        } else {
          // Update quantity
          const updatedItems = currentItems.map((item: CartItem) => (item.id === id ? { ...item, quantity } : item))

          await updateDoc(cartRef, {
            items: updatedItems,
            updatedAt: serverTimestamp(),
          })
        }
      }
    } catch (error) {
      console.error("Error updating quantity in Firestore cart:", error)
      throw error
    }
  }

  const clearFirestoreCart = async () => {
    if (!user) return

    try {
      const cartRef = doc(db, "carts", user.uid)
      await updateDoc(cartRef, {
        items: [],
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error clearing Firestore cart:", error)
      throw error
    }
  }

  // Cart operations
  const addItem = async (newItem: Omit<CartItem, "quantity">) => {
    try {
      // Update local state
      setItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === newItem.id)

        if (existingItem) {
          return prevItems.map((item) => (item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item))
        } else {
          return [...prevItems, { ...newItem, quantity: 1 }]
        }
      })

      // Update Firestore if user is logged in
      if (user) {
        await addToFirestore(newItem)
      } else {
        // Store action for offline sync
        addOfflineData({
          action: "add",
          item: { ...newItem, quantity: 1 },
        })
      }

      toast({
        title: "Item added to cart",
        description: `${newItem.name} has been added to your cart.`,
      })
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast({
        title: "Error adding item",
        description: "There was a problem adding this item to your cart.",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (id: string) => {
    try {
      // Update local state
      setItems((prevItems) => prevItems.filter((item) => item.id !== id))

      // Update Firestore if user is logged in
      if (user) {
        await removeFromFirestore(id)
      } else {
        // Store action for offline sync
        addOfflineData({
          action: "remove",
          id,
        })
      }

      toast({
        title: "Item removed from cart",
        description: "The item has been removed from your cart.",
      })
    } catch (error) {
      console.error("Error removing item from cart:", error)
      toast({
        title: "Error removing item",
        description: "There was a problem removing this item from your cart.",
        variant: "destructive",
      })
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      if (quantity < 1) {
        await removeItem(id)
        return
      }

      // Update local state
      setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))

      // Update Firestore if user is logged in
      if (user) {
        await updateQuantityInFirestore(id, quantity)
      } else {
        // Store action for offline sync
        addOfflineData({
          action: "update",
          id,
          quantity,
        })
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast({
        title: "Error updating quantity",
        description: "There was a problem updating the quantity.",
        variant: "destructive",
      })
    }
  }

  const clearCart = async () => {
    try {
      // Update local state
      setItems([])

      // Update Firestore if user is logged in
      if (user) {
        await clearFirestoreCart()
      } else {
        // Store action for offline sync
        addOfflineData({
          action: "clear",
        })
      }

      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      })
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        title: "Error clearing cart",
        description: "There was a problem clearing your cart.",
        variant: "destructive",
      })
    }
  }

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

