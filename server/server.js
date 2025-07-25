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

// 1. ENVIRONMENT & PATH
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config(); // Automatically loads from server/.env

// 2. EXPRESS SETUP
const app = express();

// 3. MIDDLEWARE (must come BEFORE routes)
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
console.log('CORS origin allowed:', process.env.FRONTEND_URL || 'http://localhost:5173');

// 4. ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);

// 5. Health check route
app.get('/health', (req, res) =>
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memoryUsage: process.memoryUsage(),
  })
);

// 6. Start the server
async function startServer() {
  try {
    await connectDB();
    console.log('\nMongoDB connected:', mongoose.connection.readyState);

    const PORT = process.env.PORT || 4000;
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server listening on http://0.0.0.0:${PORT}`);
    });

    server.on('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
}

startServer();

// 7. Graceful shutdown
process.on('SIGTERM', () => {
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});
