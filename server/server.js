
// server/server.js
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';
import commentsRoutes from './routes/comments.js';
import userRoutes from './routes/users.js';

// 1. Load env
config();

// 2. Path helpers (if you need them)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3. Express init
const app = express();

// 4. CORS — only your front‑end and localhost for dev
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// 5. Body + cookie parsing
app.use(express.json());
app.use(cookieParser());

//temporary debug
app.get('/api/debug/users', async (req, res) => {
  try {
    const users = await mongoose.connection.db.collection('users').find().toArray();
    // Hide passwords in response
    const sanitizedUsers = users.map(user => {
      const { password, ...rest } = user;
      return rest;
    });
    res.json(sanitizedUsers);
  } catch (err) {
    console.error('Debug route error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});



// 6. Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/users', userRoutes);
app.use(cookieParser());

// 7. Health check
app.get('/health', (_req, res) =>
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
);

// 8. Start server (unless testing)
if (process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => {
      const PORT = process.env.PORT || 4000;
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server listening on http://0.0.0.0:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Startup error:', err);
      process.exit(1);
    });
}

// 9. Graceful shutdown
process.on('SIGTERM', () => {
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

export default app;
