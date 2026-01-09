import React, { useEffect, useState } from 'react'

const SERVER_URL = (import.meta as any).env?.VITE_PUSH_SERVER_URL || 'http://localhost:4000'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function PushSetup(){
  const [supported, setSupported] = useState(false)
  const [permission, setPermission] = useState(Notification.permission)
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setSupported('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window)
    if('serviceWorker' in navigator){
      navigator.serviceWorker.ready.then(async reg => {
        const s = await reg.pushManager.getSubscription()
        setSubscribed(!!s)
      }).catch(()=>{})
    }
  }, [])

  async function subscribe(){
    setLoading(true)
    try{
      const p = await Notification.requestPermission()
      setPermission(p)
      if(p !== 'granted'){
        setLoading(false)
        return alert('Permission denied for notifications.')
      }

      const res = await fetch(`${SERVER_URL}/vapidPublicKey`)
      if(!res.ok) throw new Error('Failed to fetch VAPID key')
      const { publicKey } = await res.json()
      const applicationServerKey = urlBase64ToUint8Array(publicKey)
      const reg = await navigator.serviceWorker.ready
      const subscription = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })

      await fetch(`${SERVER_URL}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      })

      setSubscribed(true)
      alert('Subscribed to background notifications. Use the server to send test pushes.')
    }catch(e){
      console.error(e)
      alert('Subscription failed — check console for details.')
    }
    setLoading(false)
  }

  async function unsubscribe(){
    setLoading(true)
    try{
      const reg = await navigator.serviceWorker.ready
      const s = await reg.pushManager.getSubscription()
      if(s){
        await fetch(`${SERVER_URL}/unsubscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: s.endpoint })
        })
        await s.unsubscribe()
      }
      setSubscribed(false)
    }catch(e){
      console.error(e)
    }
    setLoading(false)
  }

  async function sendTest(){
    setLoading(true)
    try{
      const res = await fetch(`${SERVER_URL}/sendNotification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Test reminder', body: 'This is a test push notification from your push-server.' })
      })
      if(res.ok) alert('Server accepted send request. Check your device for the push (if subscribed).')
      else alert('Server failed to send test push')
    }catch(e){
      console.error(e)
      alert('Failed to send test push — check server logs.')
    }
    setLoading(false)
  }

  if(!supported) return <div className="small">Background notifications are not supported in this browser.</div>

  return (
    <div style={{marginTop:12}}>
      <div className="small">Background notifications (optional)</div>
      <div style={{display:'flex',gap:8,marginTop:8}}>
        {!subscribed ? (
          <button className="button" onClick={subscribe} disabled={loading}>Enable Background Notifications</button>
        ) : (
          <button className="button" onClick={unsubscribe} disabled={loading}>Disable Background Notifications</button>
        )}
        <button className="button" onClick={sendTest} disabled={loading || !subscribed}>Send Test Push</button>
      </div>
      <div className="small" style={{marginTop:8}}>Permission: {permission}</div>
      <div className="small" style={{marginTop:6}}>Server: {SERVER_URL}</div>
    </div>
  )
}
