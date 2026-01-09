import React, {useEffect, useState} from 'react'
import { useParams, Link } from 'react-router-dom'
import Quiz from '../components/Quiz'
import PromotionalAd from '../components/PromotionalAd'
import LoadingSpinner from '../components/LoadingSpinner'

type Unit = {
  id: number
  title: string
  purpose: string
  study: string[]
  verses: {ref:string,text:string}[]
  quiz: any[]
  premium?: boolean
}

export default function UnitPage(){
  const {id} = useParams()
  const [unit, setUnit] = useState<Unit|null>(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    setLoading(true)
    fetch('/src/data/units.json').then(r=>r.json()).then((data:Unit[])=>{
      const u = data.find(d=>String(d.id)===String(id))
      setUnit(u||null)
      const progress = JSON.parse(localStorage.getItem('progress') || '{}')
      setCompleted(Boolean(progress?.[id as string]))
      setLoading(false)
    }).catch(err => {
      console.error('Failed to load unit:', err)
      setLoading(false)
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
      new Notification('Great job!', { body: 'You completed a short lesson today. Keep up your streak!' })
    }
  }

  const handleUpgradeClick = () => {
    window.location.href = '/pricing'
  }

  if(loading) return <LoadingSpinner message="Loading unit..." />

  if(!unit) return (
    <div className="card">
      Unit not found. 
      <div style={{marginTop:'1rem'}}>
        <Link to="/" className="button">Back to Home</Link>
      </div>
    </div>
  )

  // premium gating: if unit is premium and user hasn't unlocked, show prompt
  const hasPremium = localStorage.getItem('hasPremium') === '1'

  function unlock(){
    // placeholder purchase flow - marks premium unlocked locally
    if(confirm('Unlock premium content for free demo? This simulates purchase.')){
      localStorage.setItem('hasPremium','1')
      window.location.reload()
    }
  }

  if(unit.premium && !hasPremium){
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
      {!hasPremium && <PromotionalAd onUpgradeClick={handleUpgradeClick} />}
      
      <div className="card">
        <div className="unit-title">{unit.title}{unit.premium? ' 🔒':''}</div>
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

      {completed && !loading && (
        <div
          style={{
            backgroundColor: '#f0f9f0',
            border: '2px solid #4CAF50',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
          <h3 style={{ margin: '0.5rem 0', color: '#4CAF50' }}>Excellent!</h3>
          <p style={{ margin: '0.5rem 0', color: '#666' }}>
            You've mastered this unit. You can review it anytime or move on to the next one.
          </p>
        </div>
      )}

      <div className="card quiz">
        <h3>Quick Quiz</h3>
        {completed && (
          <p style={{fontSize:'0.9rem',color:'#666',marginBottom:'1rem'}}>
            You already completed this unit. Feel free to practice again below.
          </p>
        )}
        <Quiz quiz={unit.quiz} unitId={unit.id} onAllCorrect={handleComplete} />
      </div>

      <div style={{marginTop:12,display:'flex',gap:8,justifyContent:'space-between'}}>
        {Number(id) > 1 && (
          <Link to={`/units/${Number(id)-1}`} className="button" style={{backgroundColor:'#e0e0e0',color:'#333'}}>← Previous Unit</Link>
        )}
        <Link to={`/units/${Number(id)+1}`} className="button">Next Unit →</Link>
      </div>
    </div>
  )
}
