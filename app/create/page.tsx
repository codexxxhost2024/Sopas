"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OfflineBanner } from "@/components/offline-banner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Store, ShoppingBag, Layers, Settings } from "lucide-react"
import { FallbackImage } from "@/components/ui/fallback-image"

export default function CreatePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  // Sample templates
  const templates = [
    {
      id: "fashion",
      name: "Fashion Store",
      description: "Perfect for clothing, accessories, and fashion brands",
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "electronics",
      name: "Electronics Shop",
      description: "Ideal for gadgets, tech products, and electronics",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "home",
      name: "Home & Decor",
      description: "Perfect for furniture, home accessories, and decor items",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "beauty",
      name: "Beauty & Cosmetics",
      description: "Designed for beauty products, cosmetics, and skincare",
      image:
        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ]

  return (
    <main className="min-h-screen">
      <OfflineBanner />
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Create Your Online Shop</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started in just 1 minute with our easy-to-use platform. Choose a template and customize it to fit your
              brand.
            </p>
          </div>

          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Templates</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Products</span>
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                <span className="hidden sm:inline">Design</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === template.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      <FallbackImage
                        src={template.image}
                        alt={template.name}
                        fill
                        className="object-cover"
                        fallbackSrc="/placeholder.svg"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Select Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Continue to Next Step
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Add Products</CardTitle>
                  <CardDescription>
                    Add products to your online shop. You can add products manually or import them from a CSV file.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No products yet</h3>
                    <p className="text-gray-500 mb-6">Start by adding your first product</p>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design">
              <Card>
                <CardHeader>
                  <CardTitle>Customize Design</CardTitle>
                  <CardDescription>
                    Customize the look and feel of your online shop. Change colors, fonts, and layout.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Store className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Design your store</h3>
                    <p className="text-gray-500 mb-6">Customize your store's appearance</p>
                    <Button>Start Customizing</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Store Settings</CardTitle>
                  <CardDescription>
                    Configure your store settings, payment methods, shipping options, and more.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Configure your store</h3>
                    <p className="text-gray-500 mb-6">Set up payment methods, shipping, and other settings</p>
                    <Button>Configure Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </main>
  )
}

