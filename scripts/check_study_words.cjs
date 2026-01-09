const fs = require('fs');
const raw = fs.readFileSync('src/data/units.json','utf8');
const unitRegex = /\{\s*"id"\s*:\s*(\d+)\s*,([\s\S]*?)(?=\n\s*\{\s*"id"|\n\s*\])/g;
let m;
while(m = unitRegex.exec(raw)){
  const id = Number(m[1]);
  const body = m[2];
  const studyMatch = body.match(/"study"\s*:\s*\[([\s\S]*?)\]/);
  if(id===4){
    console.log('----- UNIT 4 BODY START -----');
    console.log(body);
    console.log('----- UNIT 4 BODY END -----');
  }
  const study = (studyMatch && studyMatch[1] || '').replace(/"/g,'').replace(/,\s*/g,' ').replace(/\s+/g,' ').trim();
  const words = study ? study.split(/\s+/).filter(Boolean).length : 0;
  console.log('id',id,'words',words);
}