"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, CreditCard, Truck, MapPin, ShieldCheck, CheckCircle, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OfflineBanner } from "@/components/offline-banner"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { FallbackImage } from "@/components/ui/fallback-image"

export default function CheckoutPage() {
  const { toast } = useToast()
  const { items, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [createAccount, setCreateAccount] = useState(true)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    password: "",
    confirmPassword: "",
    paymentMethod: "card",
    saveInfo: true,
  })

  const TAX_RATE = 0.16 // 16% IVA
  const SHIPPING_COST = items.length > 0 ? 99 : 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create user account if checkbox is checked
      let userId = null

      if (createAccount && formData.password && formData.password === formData.confirmPassword) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)

          userId = userCredential.user.uid

          // Save user profile to Firestore
          await setDoc(doc(db, "users", userId), {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            createdAt: serverTimestamp(),
          })

          toast({
            title: "Account created successfully!",
            description: "You can now log in with your email and password.",
          })
        } catch (error: any) {
          console.error("Error creating account:", error)
          toast({
            title: "Account creation failed",
            description: error.message,
            variant: "destructive",
          })
        }
      }

      // Create order in Firestore
      const orderData = {
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        subtotal: totalPrice,
        tax: totalPrice * TAX_RATE,
        shipping: SHIPPING_COST,
        total: totalPrice + totalPrice * TAX_RATE + SHIPPING_COST,
        paymentMethod: formData.paymentMethod,
        status: "pending",
        createdAt: serverTimestamp(),
        userId: userId || null,
      }

      const orderRef = await addDoc(collection(db, "orders"), orderData)

      // Clear cart
      clearCart()

      toast({
        title: "Order completed!",
        description: "Your order has been processed successfully. You'll receive a confirmation email shortly.",
      })

      // In a real application, you would redirect to a success page
      // router.push(`/order-confirmation/${orderRef.id}`);
    } catch (error: any) {
      console.error("Error processing order:", error)
      toast({
        title: "Order processing failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const subtotal = totalPrice
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax + SHIPPING_COST

  return (
    <main className="min-h-screen">
      <OfflineBanner />
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Link href="/shop" className="inline-flex items-center text-sm font-medium mb-6 hover:text-primary">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Continue shopping
        </Link>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some products before proceeding to checkout.</p>
            <Link href="/shop">
              <Button>Go to shop</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 mb-8">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        autoComplete="given-name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        autoComplete="family-name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        required
                      />
                    </div>
                  </div>

                  {/* Create account section */}
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="createAccount"
                        checked={createAccount}
                        onCheckedChange={(checked) => setCreateAccount(checked as boolean)}
                      />
                      <Label htmlFor="createAccount" className="font-medium">
                        Create an account for faster checkout next time
                      </Label>
                    </div>

                    {createAccount && (
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="password">
                            <div className="flex items-center">
                              <Lock className="h-4 w-4 mr-1" />
                              <span>Password</span>
                            </div>
                          </Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={createAccount}
                            minLength={6}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required={createAccount}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          By creating an account, you'll be able to track your orders, save your shipping information,
                          and enjoy a faster checkout experience.
                        </p>
                      </div>
                    )}
                  </div>
                </form>
              </div>

              <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 mb-8">
                <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      autoComplete="street-address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        autoComplete="address-level2"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        autoComplete="address-level1"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Postal Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        autoComplete="postal-code"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="saveInfo"
                      checked={formData.saveInfo}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, saveInfo: checked as boolean }))}
                    />
                    <Label htmlFor="saveInfo" className="text-sm">
                      Save this information for next time
                    </Label>
                  </div>
                </form>
              </div>

              <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                    <RadioGroupItem value="card" id="payment-card" />
                    <Label htmlFor="payment-card" className="flex items-center cursor-pointer w-full">
                      <CreditCard className="mr-2 h-5 w-5" />
                      <span>Credit/Debit Card</span>
                      <div className="ml-auto flex items-center space-x-1">
                        {/* Inline SVG for Visa */}
                        <svg width="28" height="20" viewBox="0 0 780 500" className="h-5 w-auto">
                          <path fill="#0066B2" d="M290,170.3h40L310,304h-40L290,170.3z" />
                          <path
                            fill="#0066B2"
                            d="M479.8,172.4c-8-3-20.5-6.2-36.2-6.2c-39.9,0-68,20.1-68.2,48.9c-0.2,21.3,20.1,33.1,35.4,40.1c15.7,7.2,21,11.9,21,18.3c-0.1,9.9-12.6,14.4-24.3,14.4c-16.2,0-24.8-2.2-38.1-7.8l-5.2-2.4l-5.7,33.3c9.5,4.1,27,7.8,45.2,7.9c42.6,0,70.3-19.9,70.6-50.5c0.2-16.9-10.6-29.7-33.8-40.3c-14.1-6.9-22.7-11.4-22.6-18.4c0-6.2,7.4-12.8,23.3-12.8c13.3-0.2,23,2.7,30.5,5.7l3.6,1.7L479.8,172.4z"
                          />
                          <path
                            fill="#0066B2"
                            d="M615.8,170.3h-31.1c-9.6,0-16.8,2.6-21.1,12.2l-59.7,135.4h42.3l8.4-22h51.3l4.9,22h37.5L615.8,170.3z M568.1,264.8c1.3-3.4,20.1-52,20.1-52c-0.3,0.5,4.1-10.7,6.7-17.7l3.4,16c0,0,9.7,44.3,11.7,53.7H568.1z"
                          />
                          <path
                            fill="#0066B2"
                            d="M215.9,170.3L175.6,260l-4.3-21.7c-7.5-24.1-30.9-50.2-57-63.2l36.8,131.8H193l64.8-136.7H215.9z"
                          />
                          <path
                            fill="#F9A533"
                            d="M140.2,170.3H65.8L65,174c57.9,14.1,96.2,48,112,88.8l-16.1-77.3C158.2,173.1,149.9,170.7,140.2,170.3z"
                          />
                        </svg>

                        {/* Inline SVG for Mastercard */}
                        <svg width="28" height="20" viewBox="0 0 780 500" className="h-5 w-auto">
                          <path fill="#FFAB00" d="M630,21.6v456.8h-480V21.6H630z" />
                          <path fill="#FF5F00" d="M390,21.6v456.8H150V21.6H390z" />
                          <path
                            fill="#EB001B"
                            d="M390,250c0,91.4-74.1,165.5-165.5,165.5c-91.4,0-165.5-74.1-165.5-165.5C59,158.6,133.1,84.5,224.5,84.5C315.9,84.5,390,158.6,390,250z"
                          />
                          <path
                            fill="#F79E1B"
                            d="M721,250c0,91.4-74.1,165.5-165.5,165.5c-91.4,0-165.5-74.1-165.5-165.5c0-91.4,74.1-165.5,165.5-165.5C646.9,84.5,721,158.6,721,250z"
                          />
                          <path
                            fill="#FF5F00"
                            d="M522.2,177.7c7.4,0.1,14.7,1.5,21.6,4.2c6.9,2.7,13.2,6.6,18.6,11.5c5.4,4.9,9.9,10.7,13.1,17.1c3.2,6.4,5.1,13.3,5.5,20.4c0.4,7.1-0.6,14.2-2.9,20.9c-2.3,6.7-5.9,12.9-10.5,18.1c-4.6,5.3-10.1,9.5-16.3,12.4c-6.2,2.9-12.9,4.4-19.7,4.4c-6.8,0-13.5-1.5-19.7-4.4c-6.2-2.9-11.7-7.1-16.3-12.4c-4.6-5.3-8.2-11.4-10.5-18.1c-2.3-6.7-3.2-13.8-2.8-20.9c0.4-7.1,2.3-14,5.5-20.4c3.2-6.4,7.7-12.2,13.1-17.1c5.4-4.9,11.7-8.8,18.6-11.5C507.5,179.2,514.8,177.8,522.2,177.7z"
                          />
                        </svg>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                    <RadioGroupItem value="paymongo" id="payment-paymongo" />
                    <Label htmlFor="payment-paymongo" className="flex items-center cursor-pointer w-full">
                      {/* Inline SVG for Paymongo */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-2">
                        <path
                          d="M12 2L5 5V11.5C5 15.13 7.9 18.95 12 22C16.1 18.95 19 15.13 19 11.5V5L12 2ZM12 4L17 6.5V11.5C17 14.5 14.65 17.73 12 20.24C9.35 17.73 7 14.5 7 11.5V6.5L12 4Z"
                          fill="#0066FF"
                        />
                        <path
                          d="M12 7C10.34 7 9 8.34 9 10C9 11.31 9.83 12.42 11 12.83V17H13V12.83C14.17 12.42 15 11.31 15 10C15 8.34 13.66 7 12 7ZM12 11C11.45 11 11 10.55 11 10C11 9.45 11.45 9 12 9C12.55 9 13 9.45 13 10C13 10.55 12.55 11 12 11Z"
                          fill="#0066FF"
                        />
                      </svg>
                      <span>Paymongo</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                    <RadioGroupItem value="gcash" id="payment-gcash" />
                    <Label htmlFor="payment-gcash" className="flex items-center cursor-pointer w-full">
                      {/* Inline SVG for GCash */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-2">
                        <rect width="24" height="24" rx="4" fill="#0156DD" />
                        <path d="M6 7H8.5V17H6V7Z" fill="white" />
                        <path d="M9.5 7H12V17H9.5V7Z" fill="white" />
                        <path
                          d="M13 7H18C18.5523 7 19 7.44772 19 8V16C19 16.5523 18.5523 17 18 17H13V7Z"
                          fill="white"
                        />
                        <path
                          d="M15 10C15.5523 10 16 10.4477 16 11C16 11.5523 15.5523 12 15 12C14.4477 12 14 11.5523 14 11C14 10.4477 14.4477 10 15 10Z"
                          fill="#0156DD"
                        />
                        <path
                          d="M15 13C15.5523 13 16 13.4477 16 14C16 14.5523 15.5523 15 15 15C14.4477 15 14 14.5523 14 14C14 13.4477 14.4477 13 15 13Z"
                          fill="#0156DD"
                        />
                      </svg>
                      <span>GCash</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                    <RadioGroupItem value="cod" id="payment-cod" />
                    <Label htmlFor="payment-cod" className="flex items-center cursor-pointer w-full">
                      <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Cash on Delivery</span>
                    </Label>
                  </div>
                </RadioGroup>

                {formData.paymentMethod === "card" && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" autoComplete="cc-number" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiration Date</Label>
                        <Input id="expiryDate" placeholder="MM/YY" autoComplete="cc-exp" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" type="password" autoComplete="cc-csc" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md flex items-start">
                    <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-green-700 dark:text-green-300 font-medium">Secure Payment Process</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Your payment information is securely processed and encrypted with industry-standard protocols.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 sticky top-20">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                        <FallbackImage
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          fallbackSrc="/placeholder.svg"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</span>
                          <span className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax (16%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span>{formatCurrency(SHIPPING_COST)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 bg-red-600 hover:bg-red-700"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Complete Order"}
                </Button>

                <div className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                    <span>Secure payment guaranteed</span>
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-green-500" />
                    <span>Free shipping on orders over ₱1,000</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-green-500" />
                    <span>Delivery to all major locations</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>100% satisfaction guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

