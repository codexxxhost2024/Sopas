import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OfflineBanner } from "@/components/offline-banner"
import { MapPin, Phone, Clock, Mail } from "lucide-react"
import Link from "next/link"

export default function StoreLocationPage() {
  return (
    <main className="min-h-screen">
      <OfflineBanner />
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center text-sm mb-4">
          <Link href="/" className="text-gray-500 hover:text-primary">
            Home
          </Link>
          <span className="mx-2">›</span>
          <span className="font-medium">Store Location</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Our Store Locations</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4">Main Branch</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-red-600 mr-3 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    123 Main Street, Makati City
                    <br />
                    Metro Manila, Philippines
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-red-600 mr-3 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    (+639) 123456789
                    <br />
                    (02) 8123-4567
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-red-600 mr-3 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Monday - Friday: 9:00 AM - 8:00 PM
                    <br />
                    Saturday: 10:00 AM - 6:00 PM
                    <br />
                    Sunday: 10:00 AM - 4:00 PM
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-red-600 mr-3 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400">info@shapna.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4">Quezon City Branch</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-red-600 mr-3 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    456 Commonwealth Avenue
                    <br />
                    Quezon City, Philippines
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-red-600 mr-3 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    (+639) 987654321
                    <br />
                    (02) 8765-4321
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-red-600 mr-3 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Monday - Friday: 9:00 AM - 8:00 PM
                    <br />
                    Saturday: 10:00 AM - 6:00 PM
                    <br />
                    Sunday: 10:00 AM - 4:00 PM
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-red-600 mr-3 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400">qc@shapna.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 mb-8">
          <h2 className="text-xl font-bold mb-4">Store Map</h2>
          <div className="aspect-video w-full bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Interactive map would be displayed here</p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

