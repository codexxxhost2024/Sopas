import type React from "react"
import type { Metadata } from "next"
import { Roboto, Open_Sans, Montserrat, Poppins, Lato } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"
import { BottomNavbar } from "@/components/bottom-navbar"
import { ZoomPrevention } from "@/components/zoom-prevention"
import { DbInitializer } from "@/components/db-initializer"
import { Providers } from "@/components/providers"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-open-sans",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
})

export const metadata: Metadata = {
  title: "ShapNa - Create your Online Shop in 1 minute",
  description: "Create and launch your own online shop in just 1 minute with ShapNa",
  manifest: "/manifest.json",
  themeColor: "#1976d2",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ShapNa",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body
        className={`${roboto.variable} ${openSans.variable} ${montserrat.variable} ${poppins.variable} ${lato.variable} font-sans has-fixed-header`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>
            <ZoomPrevention />
            {children}
            <BottomNavbar />
            <Toaster />
            <DbInitializer />
          </Providers>
        </ThemeProvider>

        {/* Simple PWA check script */}
        <Script id="pwa-check" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                console.log('Service Worker is supported');
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}



import './globals.css'