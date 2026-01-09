import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

export default function Onboarding(){
  const [name,setName] = useState(localStorage.getItem('profile_name')||'')
  const [goal,setGoal] = useState(localStorage.getItem('profile_goal')||'Learn the basics')
  const [time,setTime] = useState(localStorage.getItem('reminder_time')||'09:00')
  const navigate = useNavigate()

  function submit(e:React.FormEvent){
    e.preventDefault()
    localStorage.setItem('profile_name', name)
    localStorage.setItem('profile_goal', goal)
    localStorage.setItem('reminder_time', time)
    localStorage.setItem('onboarded','1')

    // request notification permission if they agreed to be reminded
    if(Notification && Notification.permission !== 'granted'){
      Notification.requestPermission().then(p=>{
        if(p==='granted'){
          new Notification('Reminders enabled', {body: 'We will remind you to study while the app is open.'})
        }
      })
    }

    navigate('/')
  }

  return (
    <div className="card">
      <h2>Welcome — Quick Setup</h2>
      <p className="small">This takes a minute. You can change your choices later in Settings.</p>
      <form onSubmit={submit}>
        <div style={{marginBottom:8}}>
          <label className="small">Your name (optional)</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Like: Alex" />
        </div>

        <div style={{marginBottom:8}}>
          <label className="small">What brings you here?</label>
          <select value={goal} onChange={e=>setGoal(e.target.value)}>
            <option>Learn the basics</option>
            <option>Explore doubts and questions</option>
            <option>Build a daily practice</option>
          </select>
        </div>

        <div style={{marginBottom:8}}>
          <label className="small">Pick a daily reminder time</label>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)} />
        </div>

        <div style={{display:'flex',gap:8}}>
          <button className="button" type="submit">Finish Setup</button>
        </div>
      </form>
    </div>
  )
}
