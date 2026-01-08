import React, {useState} from 'react'

export default function Quiz({quiz, unitId, onAllCorrect}:{quiz:any[], unitId?:number, onAllCorrect?:()=>void}){
  const [answers, setAnswers] = useState<Record<number, number | boolean | null>>({})
  const [showResult, setShowResult] = useState(false)

  // load autosave setting
  const autosaveEnabled = localStorage.getItem('autosave_enabled') !== 'false'

  // load saved answers for this unit
  React.useEffect(()=>{
    if(unitId && autosaveEnabled){
      const raw = localStorage.getItem(`answers_unit_${unitId}`)
      if(raw){
        try{ setAnswers(JSON.parse(raw)) }catch(e){}
      }
    }
  },[unitId])

  const saveAnswers = (newAnswers:Record<number, number | boolean | null>)=>{
    setAnswers(newAnswers)
    if(unitId && autosaveEnabled){
      localStorage.setItem(`answers_unit_${unitId}`, JSON.stringify(newAnswers))
    }
  }

  const checkAll = () => {
    if(!quiz) return
    let allCorrect = true
    for(let i=0;i<quiz.length;i++){
      const q = quiz[i]
      const a = answers[i]
      if(q.type==='tf'){
        if(typeof a !== 'boolean' || a !== q.correct) allCorrect=false
      }else{
        if(a !== q.correct) allCorrect=false
      }
    }
    return allCorrect
  }

  function submit(e:React.FormEvent){
    e.preventDefault()
    setShowResult(true)
    if(checkAll() && onAllCorrect) onAllCorrect()
  }

  return (
    <form onSubmit={submit}>
      {quiz.map((q:any, idx:number)=> (
        <div key={idx} className="question">
          <div><strong>{idx+1}.</strong> {q.q}</div>
          <div style={{marginTop:6}}>
            {q.type==='tf' ? (
              <label style={{marginRight:12}}>
                <input checked={answers[idx]===true} type="radio" name={`q${idx}`} onChange={()=>saveAnswers({...answers,[idx]:true})} /> True
              </label>
            ) : null}
            {q.type==='tf' ? (
              <label>
                <input checked={answers[idx]===false} type="radio" name={`q${idx}`} onChange={()=>saveAnswers({...answers,[idx]:false})} /> False
              </label>
            ) : null}

            {q.type==='mc' && q.options && q.options.map((opt:string,oidx:number)=> (
              <label key={oidx} style={{display:'block'}}>
                <input checked={answers[idx]===oidx} type="radio" name={`q${idx}`} onChange={()=>saveAnswers({...answers,[idx]:oidx})} /> {opt}
              </label>
            ))}
          </div>

          {showResult && (
            <div className="small" style={{marginTop:6,color: (q.type==='tf' ? (answers[idx]===q.correct ? 'green':'red') : (answers[idx]===q.correct ? 'green':'red'))}}>
              {answers[idx]===q.correct ? 'Correct. ' : 'Not quite. '}
              {q.explanation}
            </div>
          )}
        </div>
      ))}

      <div style={{marginTop:8}}>
        <button className="button" type="submit">Check Answers</button>
      </div>
    </form>
  )
}
