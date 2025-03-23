// Function to request app permissions
export async function requestAppPermissions() {
  const permissions = []

  // Request notification permission
  if ("Notification" in window) {
    try {
      const status = await Notification.requestPermission()
      permissions.push({ name: "notifications", status })
    } catch (error) {
      permissions.push({ name: "notifications", status: "denied", error })
    }
  }

  // Request geolocation permission
  if ("geolocation" in navigator) {
    try {
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 600000,
        })
      })
      permissions.push({ name: "geolocation", status: "granted" })
    } catch (error) {
      permissions.push({ name: "geolocation", status: "denied", error })
    }
  }

  // Request camera permission
  if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((track) => track.stop())
      permissions.push({ name: "camera", status: "granted" })
    } catch (error) {
      permissions.push({ name: "camera", status: "denied", error })
    }
  }

  // Request microphone permission
  if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
      permissions.push({ name: "microphone", status: "granted" })
    } catch (error) {
      permissions.push({ name: "microphone", status: "denied", error })
    }
  }

  return permissions
}

// Function to check if all required permissions are granted
export async function checkAppPermissions() {
  const requiredPermissions = ["notifications", "geolocation"]
  const permissions = await requestAppPermissions()

  const missingPermissions = requiredPermissions.filter((required) => {
    const permission = permissions.find((p) => p.name === required)
    return !permission || permission.status !== "granted"
  })

  return {
    allGranted: missingPermissions.length === 0,
    missingPermissions,
  }
}

