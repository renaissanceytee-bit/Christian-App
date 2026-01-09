import React, {useState, useEffect} from 'react'
import DiscountPopup from './DiscountPopup'
import { hasReachedDailyLimit, incrementDailyIncorrect, getRemainingAttempts } from '../utils/dailyLimitUtils'

export default function Quiz({quiz, unitId, onAllCorrect}:{quiz:any[], unitId?:number, onAllCorrect?:()=>void}){
  const [answers, setAnswers] = useState<Record<number, number | boolean | null>>({})
  const [showResult, setShowResult] = useState(false)
  const [showDiscountPopup, setShowDiscountPopup] = useState(false)
  const [dailyLimitReached, setDailyLimitReached] = useState(false)
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [remainingAttempts, setRemainingAttempts] = useState(getRemainingAttempts())

  // load autosave setting
  const autosaveEnabled = localStorage.getItem('autosave_enabled') !== 'false'

  // load saved answers for this unit
  useEffect(()=>{
    if(unitId && autosaveEnabled){
      const raw = localStorage.getItem(`answers_unit_${unitId}`)
      if(raw){
        try{ setAnswers(JSON.parse(raw)) }catch(e){}
      }
    }
  },[unitId])

  // Update remaining attempts display
  useEffect(()=>{
    setRemainingAttempts(getRemainingAttempts())
  },[])

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

  const handleUpgrade = async (priceType: 'monthly' | 'annual') => {
    setUpgradeLoading(true)
    try {
      const response = await fetch('/api/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceType }),
      })
      if (!response.ok) throw new Error('Failed to create checkout')
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Checkout error:', err)
    } finally {
      setUpgradeLoading(false)
    }
  }

  function submit(e:React.FormEvent){
    e.preventDefault()

    // Check daily limit before showing results
    if (hasReachedDailyLimit()) {
      setDailyLimitReached(true)
      setShowDiscountPopup(true)
      return
    }

    setShowResult(true)
    const allCorrect = checkAll()
    
    // Track incorrect answers for daily limit
    if (!allCorrect) {
      incrementDailyIncorrect()
      setRemainingAttempts(getRemainingAttempts())
      
      // Check if limit was just reached
      if (hasReachedDailyLimit()) {
        setDailyLimitReached(true)
        setShowDiscountPopup(true)
      }
    }
    
    if(allCorrect && onAllCorrect) onAllCorrect()
  }

  if (dailyLimitReached) {
    return (
      <div>
        <DiscountPopup
          isOpen={showDiscountPopup}
          onClose={() => setShowDiscountPopup(false)}
          onUpgrade={handleUpgrade}
          loading={upgradeLoading}
        />
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '4px',
          padding: '1rem',
          marginBottom: '1rem',
          color: '#856404',
        }}>
          <strong>Daily limit reached!</strong> You've used your 3 free incorrect attempts for today. 
          Upgrade to Premium to continue practicing unlimited.
        </div>
        <div className="question">
          {quiz.map((q:any, idx:number)=> (
            <div key={idx} style={{ opacity: 0.5 }}>
              <div><strong>{idx+1}.</strong> {q.q}</div>
              <div style={{marginTop:6, opacity: 0.5}}>
                {q.type==='tf' ? (
                  <>
                    <label style={{marginRight:12}}>
                      <input disabled checked={answers[idx]===true} type="radio" name={`q${idx}`} /> True
                    </label>
                    <label>
                      <input disabled checked={answers[idx]===false} type="radio" name={`q${idx}`} /> False
                    </label>
                  </>
                ) : null}

                {q.type==='mc' && q.options && q.options.map((opt:string,oidx:number)=> (
                  <label key={oidx} style={{display:'block'}}>
                    <input disabled checked={answers[idx]===oidx} type="radio" name={`q${idx}`} /> {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit}>
      <DiscountPopup
        isOpen={showDiscountPopup}
        onClose={() => setShowDiscountPopup(false)}
        onUpgrade={handleUpgrade}
        loading={upgradeLoading}
      />

      {remainingAttempts !== Infinity && (
        <div style={{
          backgroundColor: '#e3f2fd',
          border: '1px solid #2196F3',
          borderRadius: '4px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.9rem',
          color: '#1976D2',
        }}>
          📊 <strong>Remaining attempts today:</strong> {remainingAttempts} of 3
        </div>
      )}

      {showResult && (
        <div style={{
          backgroundColor: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '1rem',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{fontSize:'0.9rem',color:'#666'}}>Score</div>
            <div style={{fontSize:'1.5rem',fontWeight:'bold',color:'#333'}}>
              {quiz.filter((q:any,i:number)=>answers[i]===q.correct).length}/{quiz.length}
            </div>
          </div>
          <div style={{fontSize:'2rem'}}>
            {quiz.filter((q:any,i:number)=>answers[i]===q.correct).length === quiz.length ? '✅' : '📚'}
          </div>
        </div>
      )}

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
