const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src', 'data', 'units.json');
const data = JSON.parse(fs.readFileSync(src, 'utf8'));

function countSyllables(word){
  word = word.toLowerCase().replace(/[^a-z]/g,'')
  if(!word) return 0
  if(word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')
  const syllables = word.match(/[aeiouy]{1,2}/g)
  return (syllables && syllables.length) || 1
}

function fleschKincaidGrade(text){
  const sentences = text.split(/[.!?]+/).filter(s=>s.trim())
  const words = text.split(/\s+/).filter(w=>w.trim())
  const syllables = words.reduce((s,w)=>s + countSyllables(w), 0)
  const ASL = words.length / Math.max(1, sentences.length)
  const ASW = syllables / Math.max(1, words.length)
  const grade = 0.39 * ASL + 11.8 * ASW - 15.59
  return { grade: Number(grade.toFixed(2)), sentences: sentences.length, words: words.length, syllables }
}

const report = []
for(const u of data){
  const studyText = (u.study || []).join(' ')
  const stats = fleschKincaidGrade(studyText)
  report.push({ id: u.id, title: u.title, grade: stats.grade, words: stats.words })
}
report.sort((a,b)=>b.grade-a.grade)
const out = report.map(r=>`Unit ${r.id} - ${r.title} — Grade ${r.grade} (words: ${r.words})`).join('\n')
fs.writeFileSync(path.join(__dirname,'..','readability-heuristic-report.md'), '# Readability (heuristic)\n\n' + out)
console.log('Heuristic report written to readability-heuristic-report.md')
