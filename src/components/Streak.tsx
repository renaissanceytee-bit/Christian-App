import React from 'react'

export default function Streak(){
  const streak = Number(localStorage.getItem('streak') || 0)
  const last = localStorage.getItem('lastActiveDate') || ''

  return (
    <div style={{display:'flex',alignItems:'center',gap:12}}>
      <div style={{background:'linear-gradient(180deg,#34d399,#10b981)',color:'#fff',padding:'6px 10px',borderRadius:18,fontWeight:700}}>
        🔥 {streak} day{streak===1? '':'s'}
      </div>
      <div className="small">Last studied: {last || 'never'}</div>
    </div>
  )
}
