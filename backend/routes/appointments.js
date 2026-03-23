const express = require('express');
const router = express.Router();
const db = require('../db/database');
const auth = require('../middleware/auth');

// Saare appointments
router.get('/', auth, (req, res) => {
  try {
    const appointments = db.prepare(
      'SELECT * FROM appointments WHERE user_id = ? ORDER BY created_at DESC'
    ).all(req.user.id);
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Appointment book karo
router.post('/', auth, (req, res) => {
  const { application_id, appointment_date, appointment_time, location } = req.body;
  try {
    const result = db.prepare(
      'INSERT INTO appointments (user_id, application_id, appointment_date, appointment_time, location) VALUES (?, ?, ?, ?, ?)'
    ).run(req.user.id, application_id, appointment_date, appointment_time, location);

    const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(result.lastInsertRowid);
    res.json({ appointment, message: 'Appointment booked!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;