import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState({
    name: localStorage.getItem('profile_name') || '',
    goal: localStorage.getItem('profile_goal') || 'Learn the basics',
    background: localStorage.getItem('user_background') || '',
    study_time: localStorage.getItem('user_study_time') || '',
    reminder: !!localStorage.getItem('reminder_time'),
    reminder_time: localStorage.getItem('reminder_time') || '09:00',
  })
  const [autosave, setAutosave] = useState(localStorage.getItem('autosave_enabled') !== 'false')
  const [notifications, setNotifications] = useState(Notification?.permission === 'granted')
  const [saved, setSaved] = useState(false)
  const [hasPremium, setHasPremium] = useState(localStorage.getItem('hasPremium') === '1')

  const handleSave = () => {
    localStorage.setItem('profile_name', profile.name)
    localStorage.setItem('profile_goal', profile.goal)
    localStorage.setItem('user_background', profile.background)
    localStorage.setItem('user_study_time', profile.study_time)
    if (profile.reminder) {
      localStorage.setItem('reminder_time', profile.reminder_time)
    } else {
      localStorage.removeItem('reminder_time')
    }
    localStorage.setItem('autosave_enabled', String(autosave))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleNotificationToggle = async () => {
    if (!Notification) {
      alert('Notifications not supported in your browser')
      return
    }
    if (Notification.permission === 'granted') {
      setNotifications(false)
    } else if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setNotifications(true)
        new Notification('Notifications enabled!', {
          body: 'You will now receive study reminders.',
        })
      }
    }
  }

  const handleReset = () => {
    if (confirm('This will clear all your progress and data. Continue?')) {
      localStorage.clear()
      setSaved(false)
      window.location.href = '/onboarding'
    }
  }

  const handlePremiumDemo = () => {
    localStorage.setItem('hasPremium', '1')
    setHasPremium(true)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Settings & Profile</h1>

      {/* Premium Status */}
      <div
        style={{
          backgroundColor: hasPremium ? '#f0f9f0' : '#f5f5f5',
          border: hasPremium ? '2px solid #4CAF50' : '1px solid #ddd',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ margin: '0 0 0.5rem 0' }}>Premium Status</h2>
        <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
          {hasPremium ? (
            <strong style={{ color: '#4CAF50' }}>✓ Premium Active</strong>
          ) : (
            <>
              Free user • 3 incorrect answers/day limit
              <br />
              <a href="/pricing" style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                Upgrade to Premium →
              </a>
            </>
          )}
        </p>
        {!hasPremium && (
          <button
            onClick={handlePremiumDemo}
            title="Development only: Demo premium features"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#e0e0e0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            [Demo] Unlock Premium
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3>Profile Information</h3>

        <div style={{ marginBottom: '1rem' }}>
          <label className="small" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Your name"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
              fontSize: '1rem',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label className="small" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Your Background
          </label>
          <select
            value={profile.background}
            onChange={(e) => setProfile({ ...profile, background: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
              fontSize: '1rem',
            }}
          >
            <option value="">Select...</option>
            <option value="I have no experience">No experience</option>
            <option value="Curious but new">Curious but new</option>
            <option value="Growing up in it">Growing up in it</option>
            <option value="Already practicing">Already practicing</option>
            <option value="Returning after time away">Returning after time away</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label className="small" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Primary Goal
          </label>
          <select
            value={profile.goal}
            onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
              fontSize: '1rem',
            }}
          >
            <option value="Learn the basics">Learn the basics</option>
            <option value="Deepen my faith">Deepen my faith</option>
            <option value="Answer personal questions">Answer personal questions</option>
            <option value="Build a daily practice">Build a daily practice</option>
            <option value="Just exploring">Just exploring</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label className="small" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Weekly Time Commitment
          </label>
          <select
            value={profile.study_time}
            onChange={(e) => setProfile({ ...profile, study_time: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
              fontSize: '1rem',
            }}
          >
            <option value="">Select...</option>
            <option value="Less than 1 hour">Less than 1 hour</option>
            <option value="1-3 hours">1-3 hours</option>
            <option value="3-5 hours">3-5 hours</option>
            <option value="More than 5 hours">More than 5 hours</option>
          </select>
        </div>
      </div>

      {/* Reminders & Notifications */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3>Reminders & Notifications</h3>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={profile.reminder}
              onChange={(e) => setProfile({ ...profile, reminder: e.target.checked })}
            />
            <span className="small">Send me daily study reminders</span>
          </label>
        </div>

        {profile.reminder && (
          <div style={{ marginBottom: '1rem', paddingLeft: '1.75rem' }}>
            <label className="small" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Reminder Time
            </label>
            <input
              type="time"
              value={profile.reminder_time}
              onChange={(e) => setProfile({ ...profile, reminder_time: e.target.value })}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={notifications}
              onChange={handleNotificationToggle}
              disabled={!Notification}
            />
            <span className="small">Push notifications (requires permission)</span>
          </label>
        </div>
      </div>

      {/* Settings */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3>Settings</h3>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autosave}
              onChange={(e) => setAutosave(e.target.checked)}
            />
            <span className="small">Auto-save quiz answers (saves as you go)</span>
          </label>
        </div>
      </div>

      {/* Data Management */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          backgroundColor: '#fff5f5',
          borderLeft: '4px solid #e53935',
        }}
      >
        <h3 style={{ color: '#e53935' }}>Data & Privacy</h3>
        <p className="small">
          All your data is stored locally on this device. You can export your progress or reset everything below.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            onClick={() => navigate('/export')}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#2196F3',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Export Data
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#e53935',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Reset All Data
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            padding: '0.75rem 1.5rem',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            flex: 1,
            padding: '0.75rem 1.5rem',
            backgroundColor: '#e0e0e0',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
