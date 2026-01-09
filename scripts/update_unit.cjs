const fs = require('fs')
const path = require('path')
const unitsPath = path.join(__dirname, '..', 'src', 'data', 'units.json')
const units = JSON.parse(fs.readFileSync(unitsPath,'utf8'))
const idToUpdate = 6
const u = units.find(x=>x.id === idToUpdate)
if(!u) { console.error('Unit not found'); process.exit(1) }
console.log('Before study:', u.study)
u.study = [
  'Grace is getting kindness you do not deserve.',
  'Forgiveness means letting go of blame and trying to repair harm.',
  'Grace and forgiveness help people start fresh and try to do better; they do not always remove consequences.',
  'Practical steps often include saying sorry, making amends, and changing hurtful habits.'
]
fs.writeFileSync(unitsPath, JSON.stringify(units, null, 2) + '\n')
console.log('Updated Unit', idToUpdate)
