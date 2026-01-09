const fs = require('fs')
const path = require('path')

function countSyllables(word){
  word = word.toLowerCase()
  if(word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')
  const syllables = word.match(/[aeiouy]{1,2}/g)
  return (syllables && syllables.length) || 1
}

function fleschKincaidGrade(text){
  const sentences = text.split(/[.!?]+/).filter(s=>s.trim())
  const words = text.split(/\s+/).filter(w=>w.trim())
  const syllables = words.reduce((s,w)=>s + countSyllables(w.replace(/[^a-zA-Z]/g,'')), 0)
  const ASL = words.length / Math.max(1, sentences.length)
  const ASW = syllables / Math.max(1, words.length)
  const grade = 0.39 * ASL + 11.8 * ASW - 15.59
  return { grade: Number(grade.toFixed(2)), sentences: sentences.length, words: words.length, syllables }
}

const unitsPath = path.join(__dirname, '..', 'src', 'data', 'units.json')
const units = JSON.parse(fs.readFileSync(unitsPath,'utf8'))

const report = []
for(const u of units){
  const text = `${u.text || ''} ${u.notes || ''}`.trim()
  const q = fleschKincaidGrade(text)
  report.push({ id: u.id, title: u.title, grade: q.grade, words: q.words })
}

report.sort((a,b)=>b.grade - a.grade)
const out = report.map(r=>`Unit ${r.id} - ${r.title} — Grade ${r.grade} (words: ${r.words})`).join('\n')
fs.writeFileSync(path.join(__dirname,'..','readability-report.md'), '# Readability Report\n\n' + out)
console.log('Report written to readability-report.md')
