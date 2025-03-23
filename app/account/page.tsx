"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Package, Heart, CreditCard, MapPin, ChevronRight, Edit2, Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OfflineBanner } from "@/components/offline-banner"
import { formatCurrency } from "@/lib/utils"
import { FallbackImage } from "@/components/ui/fallback-image"
import { ThemeToggle } from "@/components/theme-toggle"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useThemeContext } from "@/components/theme-provider"

export default function AccountPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { theme, font, setTheme, setFont } = useThemeContext()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 555 123 4567",
    address: "123 Main St, Anytown, USA",
  })

  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePreferenceChange = (name: string, checked: boolean) => {
    setPreferences((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setProfile(formData)
      setLoading(false)
      toast({
        title: "Profile updated",
        description: "Your information has been updated successfully.",
      })
    }, 1000)
  }

  // Sample orders data
  const orders = [
    {
      id: "ORD-12345",
      date: "March 12, 2023",
      status: "Delivered",
      total: 2499.0,
      items: 3,
    },
    {
      id: "ORD-12346",
      date: "April 15, 2023",
      status: "In Process",
      total: 1899.0,
      items: 2,
    },
  ]

  // Sample wishlist data
  const wishlist = [
    {
      id: "1",
      name: "Sports Smartwatch",
      price: 1899,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "5",
      name: "Polarized Sunglasses",
      price: 599,
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ]

  return (
    <main className="min-h-screen">
      <OfflineBanner />
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-center mb-8">
            <TabsTrigger value="profile" className="flex-1 flex justify-center">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex-1 flex justify-center">
              <Package className="h-5 w-5" />
              <span className="sr-only">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex-1 flex justify-center">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex-1 flex justify-center">
              <MapPin className="h-5 w-5" />
              <span className="sr-only">Addresses</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex-1 flex justify-center">
              <CreditCard className="h-5 w-5" />
              <span className="sr-only">Payment Methods</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex-1 flex justify-center">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Preferences</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
              <Card className="lg:col-span-1 h-auto">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your personal and contact information</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 bg-gray-100">
                    <FallbackImage
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                      alt="Profile"
                      fill
                      className="object-cover"
                      fallbackSrc="/placeholder.svg"
                    />
                    <button className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="text-xl font-semibold">{profile.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{profile.email}</p>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 h-auto">
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-0">
            <Card className="h-auto">
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
                <CardDescription>History of your recent purchases</CardDescription>
              </CardHeader>
              <CardContent className="overflow-auto">
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      >
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-semibold">{order.id}</h3>
                            <span
                              className={`ml-2 text-xs px-2 py-1 rounded-full ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {order.date} • {order.items} {order.items === 1 ? "product" : "products"}
                          </p>
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">
                          <span className="font-medium mr-4">{formatCurrency(order.total)}</span>
                          <Button variant="ghost" size="sm" className="flex items-center">
                            Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-semibold">No orders</h3>
                    <p className="text-gray-500 mt-2">You haven't made any purchases yet</p>
                    <Button className="mt-4">Go to shop</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist" className="mt-0">
            <Card className="h-auto">
              <CardHeader>
                <CardTitle>Wishlist</CardTitle>
                <CardDescription>Products you've saved for later</CardDescription>
              </CardHeader>
              <CardContent>
                {wishlist.length > 0 ? (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 items-center border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      >
                        <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                          <FallbackImage
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            fallbackSrc="/placeholder.svg"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{formatCurrency(item.price)}</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button size="sm">Add</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-semibold">Empty wishlist</h3>
                    <p className="text-gray-500 mt-2">You haven't added any products to your wishlist</p>
                    <Button className="mt-4">Explore products</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="mt-0">
            <Card className="h-auto">
              <CardHeader>
                <CardTitle>My Addresses</CardTitle>
                <CardDescription>Manage your shipping addresses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4 relative">
                    <div className="absolute top-4 right-4">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-start mb-2">
                      <MapPin className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Home</h3>
                        <p className="text-gray-600 dark:text-gray-400">{profile.address}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-100">
                      Default address
                    </span>
                  </div>

                  <Button variant="outline">
                    <MapPin className="mr-2 h-4 w-4" />
                    Add new address
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="mt-0">
            <Card className="h-auto">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your cards and payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4 relative">
                    <div className="absolute top-4 right-4">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center mb-2">
                      <CreditCard className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <h3 className="font-semibold">Visa ending in 4242</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Expires: 12/25</p>
                      </div>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-100">
                      Default method
                    </span>
                  </div>

                  <Button variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add new payment method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Preferences Tab with Theme and Font Selection */}
          <TabsContent value="preferences" className="mt-0">
            <Card className="h-auto">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your app experience and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Theme Selection Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Appearance</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Dark Mode</p>
                          <p className="text-sm text-gray-500">Toggle between light and dark mode</p>
                        </div>
                        <ThemeToggle />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="color-theme">Color Theme</Label>
                        <RadioGroup
                          id="color-theme"
                          value={theme}
                          onValueChange={(value) => setTheme(value as any)}
                          className="grid grid-cols-3 gap-4"
                        >
                          <div>
                            <RadioGroupItem value="default" id="theme-default" className="sr-only" />
                            <Label
                              htmlFor="theme-default"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <div className="mb-2 rounded-full w-8 h-8 bg-[#e11d48]"></div>
                              <span className="text-sm font-medium">Default</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="forest" id="theme-forest" className="sr-only" />
                            <Label
                              htmlFor="theme-forest"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <div className="mb-2 rounded-full w-8 h-8 bg-[#16a34a]"></div>
                              <span className="text-sm font-medium">Forest</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="ocean" id="theme-ocean" className="sr-only" />
                            <Label
                              htmlFor="theme-ocean"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <div className="mb-2 rounded-full w-8 h-8 bg-[#0284c7]"></div>
                              <span className="text-sm font-medium">Ocean</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="sunset" id="theme-sunset" className="sr-only" />
                            <Label
                              htmlFor="theme-sunset"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <div className="mb-2 rounded-full w-8 h-8 bg-[#f97316]"></div>
                              <span className="text-sm font-medium">Sunset</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="lavender" id="theme-lavender" className="sr-only" />
                            <Label
                              htmlFor="theme-lavender"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <div className="mb-2 rounded-full w-8 h-8 bg-[#9333ea]"></div>
                              <span className="text-sm font-medium">Lavender</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="mint" id="theme-mint" className="sr-only" />
                            <Label
                              htmlFor="theme-mint"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <div className="mb-2 rounded-full w-8 h-8 bg-[#10b981]"></div>
                              <span className="text-sm font-medium">Mint</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2 pt-4">
                        <Label htmlFor="font-style">Font Style</Label>
                        <RadioGroup
                          id="font-style"
                          value={font}
                          onValueChange={(value) => setFont(value as any)}
                          className="grid grid-cols-3 gap-4"
                        >
                          <div>
                            <RadioGroupItem value="default" id="font-default" className="sr-only" />
                            <Label
                              htmlFor="font-default"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <span className="font-sans text-lg mb-2">Aa</span>
                              <span className="text-sm font-medium">Default</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="forest" id="font-forest" className="sr-only" />
                            <Label
                              htmlFor="font-forest"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <span className="font-montserrat text-lg mb-2">Aa</span>
                              <span className="text-sm font-medium">Montserrat</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="ocean" id="font-ocean" className="sr-only" />
                            <Label
                              htmlFor="font-ocean"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <span className="font-poppins text-lg mb-2">Aa</span>
                              <span className="text-sm font-medium">Poppins</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="helvetica" id="font-helvetica" className="sr-only" />
                            <Label
                              htmlFor="font-helvetica"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <span style={{ fontFamily: "Helvetica, Arial, sans-serif" }} className="text-lg mb-2">
                                Aa
                              </span>
                              <span className="text-sm font-medium">Helvetica</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="lato" id="font-lato" className="sr-only" />
                            <Label
                              htmlFor="font-lato"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <span className="font-lato text-lg mb-2">Aa</span>
                              <span className="text-sm font-medium">Lato</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="sans-serif" id="font-sans-serif" className="sr-only" />
                            <Label
                              htmlFor="font-sans-serif"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <span style={{ fontFamily: "system-ui, sans-serif" }} className="text-lg mb-2">
                                Aa
                              </span>
                              <span className="text-sm font-medium">Sans Serif</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>

                  {/* Notification Preferences */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive updates via email</p>
                        </div>
                        <Switch
                          checked={preferences.emailNotifications}
                          onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-gray-500">Receive updates via text message</p>
                        </div>
                        <Switch
                          checked={preferences.smsNotifications}
                          onCheckedChange={(checked) => handlePreferenceChange("smsNotifications", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order Updates</p>
                          <p className="text-sm text-gray-500">Get notified about your order status</p>
                        </div>
                        <Switch
                          checked={preferences.orderUpdates}
                          onCheckedChange={(checked) => handlePreferenceChange("orderUpdates", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Promotions and Offers</p>
                          <p className="text-sm text-gray-500">Receive special offers and discounts</p>
                        </div>
                        <Switch
                          checked={preferences.promotions}
                          onCheckedChange={(checked) => handlePreferenceChange("promotions", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </main>
  )
}

