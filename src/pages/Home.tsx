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
      <section className="hero">
        <h1>Understand Christianity in short lessons — study first, then quiz.</h1>
        <p className="small">Friendly lessons for beginners and the curious. Short readings, simple Bible verses, and quick quizzes.</p>
        <div style={{marginTop:12}}>
          <Link className="button" to="/units/1">Start Unit 1</Link>
          <Link style={{marginLeft:12}} className="button" to="/export">Export / Import</Link>
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
        <h2>Example Unit</h2>
        <p className="small">Unit 1: What This Course Is About — short study, verse, and a short quiz to check what you learned.</p>
        <Link to="/units/1">Open Unit 1</Link>
      </section>

    </div>
  )
}
