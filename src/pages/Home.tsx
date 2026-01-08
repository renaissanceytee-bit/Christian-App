import React, {useState} from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)

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

  return (
    <div>
      <section className="hero modern-hero">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:20}}>
          <div>
            <h1>Understand Christianity in short lessons — study first, then quiz.</h1>
            <p className="small">Friendly lessons for beginners and the curious. Short readings, simple Bible verses, and quick quizzes.</p>
            <div style={{marginTop:12}}>
              <Link className="button" to="/units/1">Start Unit 1</Link>
              <Link style={{marginLeft:12}} className="button" to="/export">Export / Import</Link>
            </div>
          </div>
          <div style={{minWidth:160}}>
            <div style={{background:'#fff',padding:12,borderRadius:12,boxShadow:'0 6px 18px rgba(16,24,40,0.06)'}}>
              <div style={{fontSize:12,color:'#6b7280'}}>Your streak</div>
              <div style={{marginTop:8}}>
                {/* Streak badge will be client-side rendered */}
                <div style={{background:'linear-gradient(180deg,#34d399,#10b981)',color:'#fff',padding:'8px 12px',borderRadius:16,display:'inline-block',fontWeight:700}}>🔥 {Number(localStorage.getItem('streak')||0)} day{Number(localStorage.getItem('streak')||0)===1? '':'s'}</div>
              </div>
              <div className="small" style={{marginTop:8}}>Set a daily reminder below to keep your streak.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>How it works</h2>
        <ol>
          <li>Study a short lesson (5–10 minutes).</li>
          <li>Read 1–2 Bible verses with simple notes.</li>
          <li>Take a quick 5-question quiz.</li>
          <li>Progress saved locally — export a backup anytime.</li>
        </ol>
        <div style={{marginTop:12}}>
          <div className="small">Course progress</div>
          <div className="progress-bar" style={{marginTop:8}}>
            <i style={{width: `${(Number(localStorage.getItem('progress') ? Object.keys(JSON.parse(localStorage.getItem('progress')||'{}')).length : 0) / 30) * 100}%`}}></i>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Who this is for</h2>
        <ul>
          <li>People new to Christianity</li>
          <li>Curious skeptics</li>
          <li>Anyone who wants clear, low-pressure learning</li>
        </ul>
      </section>

      <section className="card">
        <h2>Join the waitlist</h2>
        <form onSubmit={addToWaitlist}>
          <div className="field">
            <input type="email" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <button className="button">Join</button>
          </div>
        </form>
        {saved && <div className="small">Thanks — saved locally. You can export waitlist as CSV on the Export page.</div>}
      </section>

      <section className="card">
        <h2>Daily Reminder</h2>
        <p className="small">Get a simple reminder to study each day. (Reminders work while the app is open and with browser permissions; you can also download a calendar reminder.)</p>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
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
      </section>

      <section className="card">
        <h2>Example Unit</h2>
        <p className="small">Unit 1: What This Course Is About — short study, verse, and a short quiz to check what you learned.</p>
        <Link to="/units/1">Open Unit 1</Link>
      </section>

    </div>
  )
}
