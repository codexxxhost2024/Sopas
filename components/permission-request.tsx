"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { requestAppPermissions } from "@/lib/permissions"
import { Bell, MapPin, Camera, Mic } from "lucide-react"

export function PermissionRequest() {
  const [requesting, setRequesting] = useState(false)
  const [permissions, setPermissions] = useState<any[]>([])

  const handleRequestPermissions = async () => {
    setRequesting(true)
    try {
      const results = await requestAppPermissions()
      setPermissions(results)
    } catch (error) {
      console.error("Error requesting permissions:", error)
    } finally {
      setRequesting(false)
    }
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-4">App Permissions</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        ShapNa needs the following permissions to provide you with the best experience:
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center">
          <Bell className="h-5 w-5 text-primary mr-3" />
          <div>
            <p className="font-medium">Notifications</p>
            <p className="text-sm text-gray-500">Receive order updates and promotions</p>
          </div>
        </div>

        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-primary mr-3" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-sm text-gray-500">Find stores near you and improve delivery</p>
          </div>
        </div>

        <div className="flex items-center">
          <Camera className="h-5 w-5 text-primary mr-3" />
          <div>
            <p className="font-medium">Camera</p>
            <p className="text-sm text-gray-500">Scan QR codes and take product photos</p>
          </div>
        </div>

        <div className="flex items-center">
          <Mic className="h-5 w-5 text-primary mr-3" />
          <div>
            <p className="font-medium">Microphone</p>
            <p className="text-sm text-gray-500">Voice search and customer support calls</p>
          </div>
        </div>
      </div>

      <Button onClick={handleRequestPermissions} disabled={requesting} className="w-full">
        {requesting ? "Requesting Permissions..." : "Grant Permissions"}
      </Button>

      {permissions.length > 0 && (
        <div className="mt-4 text-sm">
          <p className="font-medium mb-2">Permission Status:</p>
          <ul className="space-y-1">
            {permissions.map((permission, index) => (
              <li key={index} className="flex items-center">
                <span
                  className={`w-3 h-3 rounded-full mr-2 ${permission.status === "granted" ? "bg-green-500" : "bg-red-500"}`}
                ></span>
                <span className="capitalize">{permission.name}: </span>
                <span className="ml-1">{permission.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

