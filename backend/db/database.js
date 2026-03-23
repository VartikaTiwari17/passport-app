const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const db = new Database(path.join(__dirname, 'passport.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    dob TEXT,
    city TEXT,
    phone TEXT,
    onboarding_completed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    application_id TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'draft',
    current_step INTEGER DEFAULT 1,
    personal_info TEXT,
    address_info TEXT,
    family_info TEXT,
    emergency_contact TEXT,
    documents TEXT,
    last_saved DATETIME DEFAULT CURRENT_TIMESTAMP,
    submitted_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    application_id TEXT NOT NULL,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT DEFAULT 'scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Demo user seed karo
const demoUser = db.prepare('SELECT * FROM users WHERE email = ?').get('hire-me@anshumat.org');
if (!demoUser) {
  const hashedPassword = bcrypt.hashSync('HireMe@2025!', 10);
  db.prepare(
    'INSERT INTO users (name, email, password, dob, city, phone, onboarding_completed) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run('Demo User', 'hire-me@anshumat.org', hashedPassword, '1995-01-01', 'New Delhi', '9876543210', 1);
  console.log('✅ Demo user created');
}

module.exports = db;