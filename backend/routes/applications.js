const express = require('express');
const router = express.Router();
const db = require('../db/database');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

function generateAppId() {
  return 'PSP' + Date.now().toString().slice(-8).toUpperCase();
}

// Saari applications
router.get('/', auth, (req, res) => {
  try {
    const applications = db.prepare(
      'SELECT * FROM applications WHERE user_id = ? ORDER BY last_saved DESC'
    ).all(req.user.id);
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Nayi application banao
router.post('/new', auth, (req, res) => {
  try {
    const appId = generateAppId();
    const result = db.prepare(
      'INSERT INTO applications (user_id, application_id, status, current_step) VALUES (?, ?, ?, ?)'
    ).run(req.user.id, appId, 'draft', 1);

    const app = db.prepare('SELECT * FROM applications WHERE id = ?').get(result.lastInsertRowid);
    res.json({ application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ek application get karo
router.get('/:appId', auth, (req, res) => {
  try {
    const app = db.prepare(
      'SELECT * FROM applications WHERE application_id = ? AND user_id = ?'
    ).get(req.params.appId, req.user.id);

    if (!app) return res.status(404).json({ message: 'Application not found' });

    const parsed = {
      ...app,
      personal_info: app.personal_info ? JSON.parse(app.personal_info) : {},
      address_info: app.address_info ? JSON.parse(app.address_info) : {},
      family_info: app.family_info ? JSON.parse(app.family_info) : {},
      emergency_contact: app.emergency_contact ? JSON.parse(app.emergency_contact) : {},
      documents: app.documents ? JSON.parse(app.documents) : {},
    };
    res.json({ application: parsed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Step save karo (autosave)
router.put('/:appId', auth, (req, res) => {
  const { step, data } = req.body;
  const stepFields = { 1: 'personal_info', 2: 'address_info', 3: 'family_info', 4: 'emergency_contact' };

  try {
    const app = db.prepare(
      'SELECT * FROM applications WHERE application_id = ? AND user_id = ?'
    ).get(req.params.appId, req.user.id);

    if (!app) return res.status(404).json({ message: 'Application not found' });

    if (step && stepFields[step]) {
      const newStep = Math.max(app.current_step, step);
      db.prepare(
        `UPDATE applications SET ${stepFields[step]} = ?, current_step = ?, last_saved = CURRENT_TIMESTAMP WHERE application_id = ?`
      ).run(JSON.stringify(data), newStep, req.params.appId);
    }

    res.json({ message: 'Saved', savedAt: new Date().toLocaleTimeString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Documents upload
router.post('/:appId/documents', auth,
  upload.fields([
    { name: 'aadhar', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'address_proof', maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const app = db.prepare(
        'SELECT documents FROM applications WHERE application_id = ? AND user_id = ?'
      ).get(req.params.appId, req.user.id);

      if (!app) return res.status(404).json({ message: 'Application not found' });

      const existingDocs = app.documents ? JSON.parse(app.documents) : {};
      const newDocs = { ...existingDocs };

      if (req.files.aadhar) newDocs.aadhar = req.files.aadhar[0].filename;
      if (req.files.photo) newDocs.photo = req.files.photo[0].filename;
      if (req.files.address_proof) newDocs.address_proof = req.files.address_proof[0].filename;

      db.prepare(
        'UPDATE applications SET documents = ?, last_saved = CURRENT_TIMESTAMP WHERE application_id = ? AND user_id = ?'
      ).run(JSON.stringify(newDocs), req.params.appId, req.user.id);

      res.json({ message: 'Documents uploaded successfully', documents: newDocs });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Application submit karo
router.post('/:appId/submit', auth, (req, res) => {
  try {
    db.prepare(
      "UPDATE applications SET status = 'submitted', submitted_at = CURRENT_TIMESTAMP WHERE application_id = ? AND user_id = ?"
    ).run(req.params.appId, req.user.id);
    res.json({ message: 'Application submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;