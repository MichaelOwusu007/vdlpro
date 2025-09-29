// src/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

const app = express();
app.use(express.json());

// Serve uploads folder statically so avatars are accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS: allow your frontend origi
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
}));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
