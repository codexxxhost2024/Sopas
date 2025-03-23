import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OfflineBanner } from "@/components/offline-banner"
import { FallbackImage } from "@/components/ui/fallback-image"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <OfflineBanner />
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">About ShapNa</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 text-center">
            Create your online shop in just 1 minute
          </p>

          <div className="relative aspect-video mb-12 rounded-lg overflow-hidden">
            <FallbackImage
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
              alt="ShapNa Team"
              fill
              className="object-cover"
              fallbackSrc="/placeholder.svg"
            />
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                ShapNa was founded in 2022 with a clear vision: to make e-commerce accessible to everyone. What started
                as a simple idea has evolved into a powerful platform that allows anyone to create an online shop in
                just 1 minute, regardless of their technical skills.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Our team of e-commerce specialists, designers, and developers works tirelessly to provide you with the
                easiest and fastest way to launch your online business and start selling immediately.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400">
                At ShapNa, our mission is to democratize e-commerce by removing technical barriers and making it
                possible for anyone to create and run a successful online shop. We believe that starting an online
                business should be quick, easy, and accessible to everyone.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Quality</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We carefully select each feature to ensure the highest standards of quality for your online shop.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Innovation</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We constantly improve our platform to provide you with the best e-commerce experience.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Integrity</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We act with honesty and transparency in all our operations and customer relationships.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Our Team</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Behind ShapNa is a passionate team of professionals dedicated to making your e-commerce journey
                exceptional. We are experts in e-commerce, technology, and customer service, united by our passion for
                providing the best service possible.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {
                    name: "Carlos Mendoza",
                    role: "CEO & Founder",
                    image:
                      "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
                  },
                  {
                    name: "María López",
                    role: "Operations Director",
                    image:
                      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
                  },
                  {
                    name: "Javier Sánchez",
                    role: "CTO",
                    image:
                      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
                  },
                  {
                    name: "Ana García",
                    role: "Marketing Director",
                    image:
                      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
                  },
                ].map((member, index) => (
                  <div key={index} className="text-center">
                    <div className="relative w-full aspect-square overflow-hidden rounded-full mb-3">
                      <FallbackImage
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        fallbackSrc="/placeholder.svg"
                      />
                    </div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-b border-gray-200 dark:border-gray-800 py-8 my-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to create your online shop?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Get started in just 1 minute and launch your e-commerce business today.
                </p>
                <Link href="/shop">
                  <Button size="lg">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

