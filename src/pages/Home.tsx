import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PromotionalAd from '../components/PromotionalAd'
const PushSetup = React.lazy(()=>import('../components/PushSetup'))

type Unit = {
  id: number
  title: string
  purpose: string
  study: string[]
  verses: {ref:string,text:string}[]
  quiz: any[]
  premium?: boolean
}

export default function Home(){
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  const [units, setUnits] = useState<Unit[]>([])
  const [profileName, setProfileName] = useState(localStorage.getItem('profile_name') || '')
  const [hasPremium, setHasPremium] = useState(localStorage.getItem('hasPremium') === '1')

  useEffect(() => {
    fetch('/src/data/units.json')
      .then(r => r.json())
      .then(setUnits)
      .catch(err => console.error('Failed to load units:', err))
  }, [])

  function addToWaitlist(e: React.FormEvent){
    e.preventDefault()
    const key = 'waitlist_emails'
    const raw = localStorage.getItem(key)
    const arr = raw ? JSON.parse(raw) as string[] : []
    if(email && !arr.includes(email)) arr.push(email)
    localStorage.setItem(key, JSON.stringify(arr))
    setSaved(true)
    setTimeout(()=>setSaved(false),3000)
    setEmail('')
  }

  const onboarded = localStorage.getItem('onboarded') === '1'
  const streak = Number(localStorage.getItem('streak') || 0)
  const progress = JSON.parse(localStorage.getItem('progress') || '{}')
  const completedCount = Object.keys(progress).length
  const totalUnits = units.length || 6
  const completionPercent = totalUnits > 0 ? Math.round((completedCount / totalUnits) * 100) : 0

  return (
    <div>
      {!hasPremium && <PromotionalAd onUpgradeClick={() => window.location.href = '/pricing'} />}

      <section className="hero modern-hero">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:20}}>
          <div>
            <h1>
              {profileName ? `Welcome back, ${profileName}!` : 'Understand Christianity in short lessons'}
            </h1>
            <p className="small">Friendly lessons for beginners and the curious. Short readings, simple Bible verses, and quick quizzes.</p>
            <div style={{marginTop:12}}>
              {completedCount < totalUnits ? (
                <Link className="button" to={`/units/${completedCount + 1}`}>
                  {completedCount === 0 ? 'Start Unit 1' : `Continue to Unit ${completedCount + 1}`}
                </Link>
              ) : (
                <Link className="button" to="/units/1">Restart Course</Link>
              )}
              <Link style={{marginLeft:12}} className="button" to="/settings">Settings</Link>
            </div>
          </div>
          <div style={{minWidth:180}}>
            {/* Stats Card */}
            <div style={{background:'#fff',padding:'1.5rem',borderRadius:12,boxShadow:'0 6px 18px rgba(16,24,40,0.06)'}}>
              <div style={{display:'grid',gap:'1rem'}}>
                <div>
                  <div style={{fontSize:'0.85rem',color:'#6b7280',marginBottom:'0.25rem'}}>Streak</div>
                  <div style={{background:'linear-gradient(180deg,#34d399,#10b981)',color:'#fff',padding:'8px 12px',borderRadius:16,display:'inline-block',fontWeight:700,fontSize:'1.1rem'}}>🔥 {streak}</div>
                </div>
                <div>
                  <div style={{fontSize:'0.85rem',color:'#6b7280',marginBottom:'0.25rem'}}>Progress</div>
                  <div style={{fontWeight:700,fontSize:'1.2rem',color:'#333'}}>{completedCount}/{totalUnits} units</div>
                  <div style={{background:'#e0e0e0',height:'6px',borderRadius:'3px',marginTop:'0.5rem',overflow:'hidden'}}>
                    <div style={{background:'#4CAF50',height:'100%',width:`${completionPercent}%`,transition:'width 0.3s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!onboarded && (
        <div className="card" style={{backgroundColor:'#e3f2fd',borderLeft:'4px solid #2196F3'}}>
          <h3>👋 Welcome! Let's Get Started</h3>
          <p className="small">New here? Complete a quick setup to personalize your experience and enable reminders.</p>
          <Link className="button" style={{backgroundColor:'#2196F3',color:'#fff'}} to="/onboarding">Start Quick Setup</Link>
        </div>
      )}

      {/* Unit Listing */}
      {units.length > 0 && (
        <section className="card">
          <h2>All Units</h2>
          <div style={{display:'grid',gap:'1rem',marginTop:'1rem'}}>
            {units.map((unit) => {
              const isCompleted = progress[unit.id]
              return (
                <div
                  key={unit.id}
                  style={{
                    border: isCompleted ? '2px solid #4CAF50' : '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: isCompleted ? '#f9fff9' : '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <div>
                    <h4 style={{margin:'0 0 0.25rem 0'}}>{unit.id}. {unit.title}</h4>
                    <p style={{margin:'0.25rem 0 0 0',fontSize:'0.9rem',color:'#666'}}>{unit.purpose}</p>
                  </div>
                  <div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
                    {isCompleted && <span style={{color:'#4CAF50',fontWeight:'bold'}}>✓ Done</span>}
                    <Link
                      to={`/units/${unit.id}`}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: isCompleted ? '#e0e0e0' : '#4CAF50',
                        color: isCompleted ? '#666' : '#fff',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isCompleted ? 'Review' : 'Start'}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section className="card">
        <h2>How it works</h2>
        <ol>
          <li>Study a short lesson (5–10 minutes).</li>
          <li>Read 1–2 Bible verses with simple notes.</li>
          <li>Take a quick 5-question quiz.</li>
          <li>Progress saved locally — export a backup anytime.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Daily Reminder</h2>
        <p className="small">Get a simple reminder to study each day. (Reminders work while the app is open and with browser permissions.)</p>
        <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
          <input id="reminder-time" type="time" defaultValue={localStorage.getItem('reminder_time')||'09:00'} />
          <button className="button" onClick={(e)=>{e.preventDefault();
            const t = (document.getElementById('reminder-time') as HTMLInputElement).value
            localStorage.setItem('reminder_time', t)
            // request notification permission
            if (Notification && Notification.permission !== 'granted') {
              Notification.requestPermission().then(p=>{
                if(p==='granted'){
                  new Notification('Reminders enabled', {body: 'We will remind you to study at your chosen time while the app is open.'})
                }
              })
            }
            alert('Reminder time saved. You can also export a calendar reminder.')
          }}>Set Reminder</button>
          <button className="button" onClick={(e)=>{e.preventDefault();
            // download basic .ics file
            const time = localStorage.getItem('reminder_time') || '09:00'
            const [hh,mm] = time.split(':')
            const now = new Date()
            now.setHours(Number(hh), Number(mm),0,0)
            const start = now.toISOString().replace(/-|:|\.\d+/g,'')
            const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:reminder-${Date.now()}\nDTSTAMP:${start}Z\nDTSTART:${start}Z\nRRULE:FREQ=DAILY\nSUMMARY:Daily Christian Study\nDESCRIPTION:Reminder to study one short lesson in Christian Study app\nEND:VEVENT\nEND:VCALENDAR`
            const blob = new Blob([ics],{type:'text/calendar'})
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'study-reminder.ics'
            a.click()
            URL.revokeObjectURL(url)
          }}>Download Calendar Reminder</button>
        </div>
        {/* Push subscription setup */}
        <div style={{marginTop:12}}>
          <React.Suspense fallback={<div className="small">Loading...</div>}>
            <PushSetup />
          </React.Suspense>
        </div>
      </section>

      <section className="card">
        <h2>Join Our Waitlist</h2>
        <form onSubmit={addToWaitlist}>
          <div className="field">
            <input type="email" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <button className="button">Join</button>
          </div>
        </form>
        {saved && <div className="small" style={{color:'#4CAF50',marginTop:'0.5rem'}}>✓ Thanks — saved locally!</div>}
      </section>
    </div>
  )
}
