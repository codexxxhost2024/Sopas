import { ProductGrid } from "@/components/product-grid"
import { FeaturedProducts } from "@/components/featured-products"
import { HeroSection } from "@/components/hero-section"
import { Categories } from "@/components/categories"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OfflineBanner } from "@/components/offline-banner"
import { PackageCard } from "@/components/package-card"

export default function Home() {
  // Starter and Business packages
  const packages = [
    {
      id: "starter",
      name: "Starter Package",
      price: 0,
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Create your shop in 1 minute! FREE to start with basic features.",
    },
    {
      id: "business",
      name: "Business Package",
      price: 2999,
      image:
        "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Advanced features for growing businesses. 14-day FREE trial!",
    },
  ]

  return (
    <main className="min-h-screen">
      <OfflineBanner />
      <Navbar />
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        {/* Special Packages Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Start Your Online Shop Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                id={pkg.id}
                name={pkg.name}
                price={pkg.price}
                image={pkg.image}
                description={pkg.description}
              />
            ))}
          </div>
        </div>

        <FeaturedProducts />
        <Categories />
        <ProductGrid />
      </div>
      <Footer />
    </main>
  )
}

