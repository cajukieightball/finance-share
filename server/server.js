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

// 1. ENVIRONMENT AND PATH CONFIGURATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.resolve(__dirname, '../.env') });

console.log('\nEnvironment Configuration:');
console.log('- .env path:', path.resolve(__dirname, '../.env'));
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded' : 'Missing');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'Missing');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');

// 2. EXPRESS SERVER SETUP
const app = express();

// Encapsulate startup in an async function
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Log connection status
    console.log('\nMongoDB Connection State:');
    console.log('- Host:', mongoose.connection.host);
    console.log('- Port:', mongoose.connection.port);
    console.log('- Database:', mongoose.connection.name);
    console.log('- ReadyState:', mongoose.connection.readyState);

    // 3. MIDDLEWARE AND ROUTES
    app.use(express.json());
    app.use(cookieParser());
    app.use(
      cors({
         origin: process.env.FRONTEND_URL || ['http://localhost:3000','http://localhost:5173'],
        credentials: true,
        optionsSuccessStatus: 200,
      })
    );

    // Mount authentication routes
    app.use('/api/auth', authRoutes);

    
    // Mount posts CRUD routes
    app.use('/api/posts', postsRoutes);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database:
          mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        memoryUsage: process.memoryUsage(),
      });
    });

    // 4. SERVER STARTUP
    const PORT = process.env.PORT || 4000;
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`\nServer running on http://0.0.0.0:${PORT}`);
      console.log(`Local URL: http://localhost:${PORT}`);
    });

    // Handle errors
    server.on('error', (err) => {
      console.error('Server error:', err);
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('\nFatal startup error:', err.message);

    // If it’s a Mongo error, give guidance
    if (err.message.includes('Mongo')) {
      console.log('\nMongoDB connection advice:');
      console.log('1. Verify credentials in Atlas → Database Access');
      console.log('2. Check IP whitelist in Atlas → Network Access');
      console.log(`3. Test connection with: mongosh "${process.env.MONGODB_URI}"`);
    }
    process.exit(1);
  }
}

// 5. START THE SERVER
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nShutting down gracefully...');
  mongoose.connection.close();
  process.exit(0);
});
