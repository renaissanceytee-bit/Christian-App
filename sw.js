self.addEventListener('install', event => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  clients.claim()
})

// Push handler - receives payloads from a server-side push sender
self.addEventListener('push', event => {
  let data = {}
  try { data = event.data.json() } catch(e) {}
  const title = data.title || 'Reminder'
  const body = data.body || 'Time to study a short lesson.'
  event.waitUntil(self.registration.showNotification(title, { body }))
})

// When a notification is clicked, focus or open the app
self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow('/')
    })
  )
})
