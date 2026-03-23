const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const auth = require('../middleware/auth');

// Register
router.post('/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)'
    ).run(name, email, hashedPassword, phone);

    const token = jwt.sign({ id: result.lastInsertRowid, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: result.lastInsertRowid, name, email, onboarding_completed: 0 } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, onboarding_completed: user.onboarding_completed }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Onboarding complete karo
router.post('/onboarding', auth, (req, res) => {
  const { name, dob, city, phone } = req.body;
  try {
    db.prepare(
      'UPDATE users SET name = ?, dob = ?, city = ?, phone = ?, onboarding_completed = 1 WHERE id = ?'
    ).run(name, dob, city, phone, req.user.id);

    const user = db.prepare(
      'SELECT id, name, email, dob, city, phone, onboarding_completed FROM users WHERE id = ?'
    ).get(req.user.id);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Current user
router.get('/me', auth, (req, res) => {
  const user = db.prepare(
    'SELECT id, name, email, dob, city, phone, onboarding_completed FROM users WHERE id = ?'
  ).get(req.user.id);
  res.json({ user });
});

module.exports = router;