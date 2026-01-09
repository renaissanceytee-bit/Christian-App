const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'src', 'data', 'units.json');
let s = fs.readFileSync(p, 'utf8');
// Remove unicode LINE SEPARATOR (2028) and PARAGRAPH SEPARATOR (2029)
s = s.replace(/\u2028/g, ' ').replace(/\u2029/g, ' ');
let out = '';
let inString = false;
let escaped = false;
for(let i=0;i<s.length;i++){
  const ch = s[i];
  if(escaped){ out += ch; escaped=false; continue }
  if(ch === '\\'){ out += ch; escaped = true; continue }
  if(ch === '"'){ out += ch; inString = !inString; continue }
  const code = ch.charCodeAt(0);
  if(inString && code <= 31){ // control chars (including CR=13 LF=10)
    out += ' ';
    continue;
  }
  out += ch;
}
fs.writeFileSync(p + '.bak2', fs.readFileSync(p,'utf8'), 'utf8');
fs.writeFileSync(p, out, 'utf8');
console.log('Sanitized file and wrote backup to units.json.bak2')
