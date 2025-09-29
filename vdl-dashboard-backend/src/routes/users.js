// src/routes/users.js
const express = require('express');
const path = require('path');
const multer = require('multer');
const db = require('../db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// multer storage config (stores in backend/uploads)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// POST /api/users/avatar  (multipart/form-data) - upload avatar
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`; // served as static
    const result = await db.query('UPDATE users SET avatar_url = $1, updated_at = now() WHERE id = $2 RETURNING id, avatar_url', [url, req.userId]);
    res.json({ ok: true, avatar_url: result.rows[0].avatar_url });
  } catch (err) {
    console.error('Avatar upload error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/users/:id  (public user profile)
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT id, first_name, last_name, email, avatar_url FROM users WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Get user error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
