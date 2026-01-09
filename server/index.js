const express = require('express')
const webpush = require('web-push')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Import Stripe routes
const stripeRouter = require('./stripe')
app.use('/api/stripe', stripeRouter)

// In-memory store for subscriptions (for demo purposes only)
let subscriptions = []

// For demo purposes we generate VAPID keys at startup. For production, persist keys and set via env.
const vapidKeys = webpush.generateVAPIDKeys()
console.log('VAPID Public Key:', vapidKeys.publicKey)
console.log('VAPID Private Key:', vapidKeys.privateKey)

webpush.setVapidDetails('mailto:dev@example.com', vapidKeys.publicKey, vapidKeys.privateKey)

app.get('/vapidPublicKey', (req, res) => {
  res.json({ publicKey: vapidKeys.publicKey })
})

app.post('/subscribe', (req, res) => {
  const sub = req.body
  if(!sub || !sub.endpoint) return res.status(400).json({ error: 'Invalid subscription' })
  // simple dedupe
  subscriptions = subscriptions.filter(s => s.endpoint !== sub.endpoint)
  subscriptions.push(sub)
  console.log('Subscription saved:', sub.endpoint)
  res.status(201).json({ success:true })
})

app.post('/unsubscribe', (req, res) => {
  const { endpoint } = req.body
  subscriptions = subscriptions.filter(s => s.endpoint !== endpoint)
  res.json({ success:true })
})

app.post('/sendNotification', async (req, res) => {
  const payload = req.body || { title: 'Reminder', body: 'Time to study a short lesson' }
  const results = await Promise.all(subscriptions.map(s => {
    return webpush.sendNotification(s, JSON.stringify(payload)).then(r=>({ok:true})).catch(err=>({ok:false, error: err && err.message}))
  }))
  res.json({ results })
})

// Simple backups and auth endpoints (dev/demo only)
const db = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.PUSH_SERVER_JWT || 'dev-secret'

app.post('/signup', async (req, res) => {
  const { email, password } = req.body
  if(!email || !password) return res.status(400).json({ error: 'email/password required' })
  const hash = await bcrypt.hash(password, 10)
  db.run('INSERT INTO users (email,password) VALUES (?,?)', [email, hash], function(err){
    if(err) return res.status(400).json({ error: 'could not create user' })
    const id = this.lastID
    const token = jwt.sign({ id, email }, JWT_SECRET)
    res.json({ token })
  })
})

app.post('/login', (req, res) => {
  const { email, password } = req.body
  if(!email || !password) return res.status(400).json({ error: 'email/password required' })
  db.get('SELECT id, password FROM users WHERE email = ?', [email], async (err, row) => {
    if(err || !row) return res.status(400).json({ error: 'invalid' })
    const ok = await bcrypt.compare(password, row.password)
    if(!ok) return res.status(400).json({ error: 'invalid' })
    const token = jwt.sign({ id: row.id, email }, JWT_SECRET)
    res.json({ token })
  })
})

function auth(req, res, next){
  const h = req.headers.authorization
  if(!h) return res.status(401).json({ error: 'unauthorized' })
  const m = h.match(/^Bearer (.+)$/)
  if(!m) return res.status(401).json({ error: 'unauthorized' })
  try{ req.user = jwt.verify(m[1], JWT_SECRET); next() }catch(e){ return res.status(401).json({ error: 'unauthorized' }) }
}

app.post('/backup', auth, (req, res) => {
  const userId = req.user.id
  const blob = JSON.stringify(req.body)
  const now = Date.now()
  db.run('INSERT INTO backups (user_id, created_at, blob) VALUES (?,?,?)', [userId, now, blob], function(err){
    if(err) return res.status(500).json({ error: 'failed' })
    res.json({ success:true, id: this.lastID })
  })
})

app.get('/backup', auth, (req, res) => {
  const userId = req.user.id
  db.get('SELECT * FROM backups WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', [userId], (err, row) => {
    if(err) return res.status(500).json({ error: 'failed' })
    if(!row) return res.json({ backup: null })
    res.json({ backup: JSON.parse(row.blob), created_at: row.created_at })
  })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>console.log(`Push dev server running on http://localhost:${PORT}`))
