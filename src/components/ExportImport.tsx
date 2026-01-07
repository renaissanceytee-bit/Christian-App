import React, {useState} from 'react'

function download(filename:string, data:string){
  const blob = new Blob([data],{type:'text/plain;charset=utf-8'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function ExportImport(){
  const [message, setMessage] = useState('')

  function exportProgress(){
    const raw = localStorage.getItem('progress') || '{}'
    download('progress.json', raw)
    setMessage('Progress exported')
    setTimeout(()=>setMessage(''),2000)
  }

  function importProgress(e:React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0]
    if(!f) return
    const reader = new FileReader()
    reader.onload = ()=>{
      try{
        const txt = reader.result as string
        const obj = JSON.parse(txt)
        localStorage.setItem('progress', JSON.stringify(obj))
        setMessage('Progress imported')
        setTimeout(()=>setMessage(''),2000)
      }catch(err){
        setMessage('Invalid file')
      }
    }
    reader.readAsText(f)
  }

  function exportWaitlist(){
    const raw = localStorage.getItem('waitlist_emails') || '[]'
    const arr = JSON.parse(raw) as string[]
    const csv = 'email\n' + arr.join('\n')
    download('waitlist.csv', csv)
    setMessage('Waitlist exported')
    setTimeout(()=>setMessage(''),2000)
  }

  function clearAll(){
    if(confirm('Clear local progress and waitlist?')){
      localStorage.removeItem('progress')
      localStorage.removeItem('waitlist_emails')
      setMessage('Cleared local data')
      setTimeout(()=>setMessage(''),2000)
    }
  }

  return (
    <div>
      <h2>Export / Import</h2>
      <div className="card">
        <h3>Progress</h3>
        <p className="small">Export or import your progress as a JSON file for offline backup.</p>
        <div style={{display:'flex',gap:8}}>
          <button className="button" onClick={exportProgress}>Export Progress</button>
          <label style={{display:'inline-block'}} className="button">
            <input onChange={importProgress} style={{display:'none'}} type="file" accept="application/json" /> Import Progress
          </label>
        </div>
      </div>

      <div className="card">
        <h3>Waitlist</h3>
        <p className="small">Export the locally saved waitlist as CSV.</p>
        <div style={{display:'flex',gap:8}}>
          <button className="button" onClick={exportWaitlist}>Export Waitlist (CSV)</button>
        </div>
      </div>

      <div className="card">
        <h3>Danger Zone</h3>
        <button onClick={clearAll}>Clear Local Data</button>
      </div>

      {message && <div className="small" style={{marginTop:8}}>{message}</div>}
    </div>
  )
}
