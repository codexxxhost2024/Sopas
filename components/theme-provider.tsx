"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

// Update the Theme and Font types to include the new options
type Theme = "default" | "forest" | "ocean" | "sunset" | "lavender" | "mint"
type Font = "default" | "forest" | "ocean" | "helvetica" | "lato" | "sans-serif"

interface ThemeContextType {
  theme: Theme
  font: Font
  setTheme: (theme: Theme) => void
  setFont: (font: Font) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>("default")
  const [font, setFontState] = useState<Font>("default")

  // Load saved preferences on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("shapna-theme") as Theme | null
    const savedFont = localStorage.getItem("shapna-font") as Font | null

    if (savedTheme) setThemeState(savedTheme)
    if (savedFont) setFontState(savedFont)

    // Apply theme and font classes
    applyThemeAndFont(savedTheme || "default", savedFont || "default")
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("shapna-theme", newTheme)
    applyThemeAndFont(newTheme, font)
  }

  const setFont = (newFont: Font) => {
    setFontState(newFont)
    localStorage.setItem("shapna-font", newFont)
    applyThemeAndFont(theme, newFont)
  }

  const applyThemeAndFont = (themeValue: Theme, fontValue: Font) => {
    // Remove all theme classes
    document.documentElement.classList.remove(
      "theme-default",
      "theme-forest",
      "theme-ocean",
      "theme-sunset",
      "theme-lavender",
      "theme-mint",
    )

    // Add the selected theme class
    if (themeValue !== "default") {
      document.documentElement.classList.add(`theme-${themeValue}`)
    }

    // Remove all font classes from body
    document.body.classList.remove(
      "font-default",
      "font-forest",
      "font-ocean",
      "font-helvetica",
      "font-lato",
      "font-sans-serif",
    )

    // Add the selected font class
    document.body.classList.add(`font-${fontValue}`)
  }

  return (
    <ThemeContext.Provider value={{ theme, font, setTheme, setFont }}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider")
  }
  return context
}

