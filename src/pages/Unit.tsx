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
    obj[id as string] = true
    localStorage.setItem(key, JSON.stringify(obj))
    setCompleted(true)
  }

  if(!unit) return <div className="card">Unit not found. <Link to="/">Back</Link></div>

  return (
    <div>
      <div className="card">
        <div className="unit-title">{unit.title}</div>
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
        <Quiz quiz={unit.quiz} onAllCorrect={handleComplete} />
        {completed && <div className="small" style={{marginTop:8,color:'green'}}>Unit completed — saved locally.</div>}
      </div>

      <div style={{marginTop:12}}>
        <Link to={`/units/${Number(id)+1}`} className="button">Next Unit</Link>
      </div>
    </div>
  )
}
