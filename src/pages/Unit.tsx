import React, {useEffect, useState} from 'react'
import { useParams, Link } from 'react-router-dom'
import Quiz from '../components/Quiz'

type Unit = {
  id: number
  title: string
  purpose: string
  study: string[]
  verses: {ref:string,text:string}[]
  quiz: any[]
}

export default function UnitPage(){
  const {id} = useParams()
  const [unit, setUnit] = useState<Unit|null>(null)
  const [completed, setCompleted] = useState(false)

  useEffect(()=>{
    fetch('/src/data/units.json').then(r=>r.json()).then((data:Unit[])=>{
      const u = data.find(d=>String(d.id)===String(id))
      setUnit(u||null)
      const progress = JSON.parse(localStorage.getItem('progress'||'{}')||'{}')
      setCompleted(Boolean(progress?.[id as string]))
    })
  },[id])

  function handleComplete(){
    const key = 'progress'
    const raw = localStorage.getItem(key)
    const obj = raw ? JSON.parse(raw) : {}
    // mark unit completed
    obj[id as string] = true
    localStorage.setItem(key, JSON.stringify(obj))
    setCompleted(true)

    // update streak & last active date
    const today = new Date().toISOString().slice(0,10)
    const lastDate = localStorage.getItem('lastActiveDate')
    const lastDoneKey = `done_${today}`
    // avoid double counting same day
    if(!localStorage.getItem(lastDoneKey)){
      const prev = lastDate ? new Date(lastDate) : null
      let streak = Number(localStorage.getItem('streak') || 0)
      if(prev){
        const diff = (new Date(today).getTime() - prev.getTime()) / (1000*60*60*24)
        if(diff <= 1){
          streak = streak + 1
        } else {
          streak = 1
        }
      } else {
        streak = 1
      }
      localStorage.setItem('streak', String(streak))
      localStorage.setItem('lastActiveDate', today)
      localStorage.setItem(lastDoneKey, '1')
    }

    // if notifications are allowed and a reminder time exists, show a quick congratulatory notification
    const reminderTime = localStorage.getItem('reminder_time')
    if(window.Notification && Notification.permission === 'granted'){
      new Notification('Great job!', { body: 'You completed a short lesson today.' })
    }
  }

  if(!unit) return <div className="card">Unit not found. <Link to="/">Back</Link></div>

  // premium gating: if unit is premium and user hasn't unlocked, show prompt
  const hasPremium = localStorage.getItem('hasPremium') === '1'

  function unlock(){
    // placeholder purchase flow - marks premium unlocked locally
    if(confirm('Unlock premium content for free demo? This simulates purchase.')){
      localStorage.setItem('hasPremium','1')
      window.location.reload()
    }
  }

  if(!unit) return <div className="card">Unit not found. <Link to="/">Back</Link></div>

  if(unit['premium'] && !hasPremium){
    return (
      <div className="card">
        <h2>{unit.title}</h2>
        <p className="small">This unit is part of the premium track. Unlock premium to continue. (In a real app this would be a paid upgrade.)</p>
        <div style={{display:'flex',gap:8}}>
          <button className="button" onClick={unlock}>Unlock Premium</button>
          <Link to="/" className="small">Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="card">
        <div className="unit-title">{unit.title}{unit['premium']? ' 🔒':''}</div>
        <div className="small">Purpose: {unit.purpose}</div>
        <div className="study">
          {unit.study.map((p,i)=> <p key={i}>{p}</p>)}
        </div>
        <div className="card">
          <h4>Key Verse{unit.verses.length>1? 's':''}</h4>
          {unit.verses.map((v,i)=>(
            <div key={i} className="small"><strong>{v.ref}:</strong> {v.text}</div>
          ))}
        </div>
      </div>

      <div className="card quiz">
        <h3>Quick Quiz</h3>
        <Quiz quiz={unit.quiz} unitId={unit.id} onAllCorrect={handleComplete} />
        {completed && <div className="small" style={{marginTop:8,color:'green'}}>Unit completed — saved locally.</div>}
      </div>

      <div style={{marginTop:12}}>
        <Link to={`/units/${Number(id)+1}`} className="button">Next Unit</Link>
      </div>
    </div>
  )
}
