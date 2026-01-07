self.addEventListener('install', event => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  clients.claim()
})

// Placeholder push handler - needs server to send push events.
self.addEventListener('push', event => {
  let data = {}
  try { data = event.data.json() } catch(e) {}
  const title = data.title || 'Reminder'
  const body = data.body || 'Time to study a short lesson.'
  event.waitUntil(self.registration.showNotification(title, { body }))
})
