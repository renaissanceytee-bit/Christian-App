const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, '..', 'src', 'data', 'units.json');
const orig = fs.readFileSync(src, 'utf8');
let out = '';
let inString = false;
let escaped = false;
for (let i = 0; i < orig.length; i++) {
  const ch = orig[i];
  if (escaped) {
    out += ch;
    escaped = false;
    continue;
  }
  if (ch === '\\') {
    out += ch;
    escaped = true;
    continue;
  }
  if (ch === '"') {
    out += ch;
    inString = !inString;
    continue;
  }
  if (inString && (ch === '\n' || ch === '\r')) {
    // replace stray newlines inside strings with a space
    out += ' ';
    continue;
  }
  out += ch;
}
// write a backup first
fs.writeFileSync(src + '.bak', orig, 'utf8');
fs.writeFileSync(src, out, 'utf8');
console.log('Repaired file and wrote backup to units.json.bak');
