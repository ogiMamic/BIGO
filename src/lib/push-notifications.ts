export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications")
    return "denied"
  }

  if (Notification.permission === "granted") {
    return "granted"
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    return permission
  }

  return Notification.permission
}

export async function sendBrowserNotification(title: string, options?: NotificationOptions) {
  const permission = await requestNotificationPermission()

  if (permission === "granted") {
    try {
      new Notification(title, {
        icon: "/icon-light-32x32.png",
        badge: "/icon-light-32x32.png",
        ...options,
      })
    } catch (error) {
      console.error("Failed to send notification:", error)
    }
  }
}

export function checkNotificationSupport(): boolean {
  return "Notification" in window
}
