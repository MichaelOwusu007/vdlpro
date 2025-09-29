// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const authenticateToken = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();
const SALT_ROUNDS = 10;

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    // check if user exis
    const exists = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (exists.rowCount > 0) return res.status(409).json({ error: 'Email already in use' });

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await db.query(
      `INSERT INTO users (first_name, last_name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, first_name, last_name, email, avatar_url, role, created_at`,
      [firstName || null, lastName || null, email.toLowerCase(), password_hash]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const result = await db.query('SELECT id, password_hash, first_name, last_name, email, avatar_url, role FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rowCount === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // remove password_hash from returned user
    delete user.password_hash;
    res.json({ token, user: {
      id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, avatar_url: user.avatar_url, role: user.role
    }});
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT id, first_name, last_name, email, avatar_url, role, is_active, created_at FROM users WHERE id = $1', [req.userId]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Me error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
