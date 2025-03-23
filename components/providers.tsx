"use client"

import type React from "react"
import { AuthProvider } from "@/context/auth-context"
import { CartProvider } from "@/context/cart-context"
import { RegisterSW } from "@/app/register-sw"
import { ImagePreloader } from "@/components/image-preloader"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <RegisterSW />
        <ImagePreloader />
      </CartProvider>
    </AuthProvider>
  )
}

