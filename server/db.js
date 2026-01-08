const sqlite3 = require('sqlite3')
const path = require('path')
const dbPath = path.join(__dirname, 'data.sqlite')
const db = new sqlite3.Database(dbPath)

db.serialize(()=>{
  db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT)`)
  db.run(`CREATE TABLE IF NOT EXISTS backups (id INTEGER PRIMARY KEY, user_id INTEGER, created_at INTEGER, blob TEXT, FOREIGN KEY(user_id) REFERENCES users(id))`)
})

module.exports = db
