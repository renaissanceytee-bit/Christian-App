import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

// Register service worker for PWA and push skeleton
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      // console.log('Service worker registered', reg)
    }).catch(err => {
      // console.warn('Service worker failed', err)
    })
  })
}

// Simple in-app reminder scheduler: checks chosen reminder time and shows a notification while the app is open.
(function setupReminder(){
  function checkAndNotify(){
    const time = localStorage.getItem('reminder_time')
    const enabled = localStorage.getItem('onboarded') === '1'
    if(!time || !enabled) return
    const [hh,mm] = time.split(':').map(s=>Number(s))
    const now = new Date()
    if(now.getHours() === hh && now.getMinutes() === mm){
      const today = now.toISOString().slice(0,10)
      const key = `rem_notified_${today}`
      if(!localStorage.getItem(key)){
        if(window.Notification && Notification.permission === 'granted'){
          new Notification('Time to study', { body: 'A short lesson is ready — take 5 minutes to learn.' })
        }
        localStorage.setItem(key, '1')
      }
    }
  }

  // check every 30 seconds while the app is open
  setInterval(checkAndNotify, 30 * 1000)
})()
