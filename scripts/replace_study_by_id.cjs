const fs = require('fs');
const path = require('path');
const unitsPath = path.join(__dirname, '..', 'src', 'data', 'units.json');
let s = fs.readFileSync(unitsPath,'utf8');
const id = 4;
const idTok = `"id":${id}`;
const p = s.indexOf(idTok);
if(p === -1) { console.error('id not found'); process.exit(1) }
// find study array start
const studyIdx = s.indexOf('"study"', p);
if(studyIdx === -1) { console.error('study not found'); process.exit(1) }
const arrStart = s.indexOf('[', studyIdx);
if(arrStart === -1) { console.error('array start not found'); process.exit(1) }
// find closing ']', but need to find the matching bracket (not the first one)
let depth = 0; let i = arrStart;
for(; i < s.length; i++){
  if(s[i] === '[') depth++;
  else if(s[i] === ']'){
    depth--;
    if(depth === 0) break;
  }
}
if(i >= s.length) { console.error('array end not found'); process.exit(1) }
const arrEnd = i;
const before = s.slice(0, arrStart+1);
const after = s.slice(arrEnd);
const newArr = [
  "The Bible is many books that include stories, letters, and songs.",
  "Read a short passage slowly and ask what it says and what it might mean today.",
  "Use a simple translation and short notes to help with hard words."
];
const newArrText = '\n    ' + newArr.map(v => JSON.stringify(v)).join(',\n    ') + '\n  ';
s = before + newArrText + after;
fs.writeFileSync(unitsPath, s, 'utf8');
console.log('Replaced study array for id', id);
