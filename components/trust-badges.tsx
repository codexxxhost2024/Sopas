import { Shield, Truck, CreditCard, RefreshCcw } from "lucide-react"

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6 border-t border-b py-6 border-gray-200 dark:border-gray-800">
      <div className="flex flex-col items-center text-center p-3">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2 mb-2">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <h4 className="text-sm font-medium">Secure Checkout</h4>
        <p className="text-xs text-gray-500 mt-1">100% Protected Payment</p>
      </div>

      <div className="flex flex-col items-center text-center p-3">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2 mb-2">
          <Truck className="h-5 w-5 text-primary" />
        </div>
        <h4 className="text-sm font-medium">Fast Shipping</h4>
        <p className="text-xs text-gray-500 mt-1">Free on orders over ₱1,000</p>
      </div>

      <div className="flex flex-col items-center text-center p-3">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2 mb-2">
          <CreditCard className="h-5 w-5 text-primary" />
        </div>
        <h4 className="text-sm font-medium">Flexible Payment</h4>
        <p className="text-xs text-gray-500 mt-1">Multiple payment options</p>
      </div>

      <div className="flex flex-col items-center text-center p-3">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2 mb-2">
          <RefreshCcw className="h-5 w-5 text-primary" />
        </div>
        <h4 className="text-sm font-medium">Easy Returns</h4>
        <p className="text-xs text-gray-500 mt-1">30 day return policy</p>
      </div>
    </div>
  )
}

