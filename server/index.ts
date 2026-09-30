import dotenv from 'dotenv';
dotenv.config({ path: '/home/deploy/yaqut_akhar/server/.env' });

import express from 'express';
import cors from 'cors';
import { initDB } from './db';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import yaqutRoutes from './routes/yaqut';
import leaderboardRoutes from './routes/leaderboard';
import workshopRoutes from './routes/workshop';
import backupRoutes from './routes/backup';
import newsRoutes from './routes/news';
import homeRoutes from './routes/home';
import { uploadsDir } from './middleware/upload';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL =
  process.env.FRONTEND_URL || 'http://localhost:3000';

app.disable('x-powered-by');

// Static uploads
app.use('/uploads', express.static(uploadsDir));

// Body parsers
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============================================================
// CORS
// ============================================================

const allowedOrigins = [
  FRONTEND_URL,

  // Local
  'http://localhost:3000',
  'http://localhost:3001',

  // Server IP
  'http://87.107.109.154',
  'https://87.107.109.154',

  // Domain
  'http://seminar40.ir',
  'https://seminar40.ir',
  'http://www.seminar40.ir',
  'https://www.seminar40.ir',

  // Render
  'https://yaghout-frontend.onrender.com',
]
  .filter(Boolean)
  .map((origin) => origin.replace(/\/+$/, ''));

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without Origin header
      // (curl, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/+$/, '');

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      console.error(`BLOCKED CORS ORIGIN: ${origin}`);

      return callback(new Error('Not allowed by CORS'));
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],

    maxAge: 86400,
  })
);

// Explicit OPTIONS handling
app.options('*', cors());

// JSON body
app.use(express.json({ limit: '50mb' }));
// ============================================================
// Routes
// ============================================================

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/yaqut', yaqutRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/workshop', workshopRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/home', homeRoutes);

// ============================================================
// Database
// ============================================================

initDB();

// ============================================================
// Server
// ============================================================

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
  console.log('Admin environment loaded:', {
    username: process.env.ADMIN_USERNAME,
    passwordLoaded: Boolean(process.env.ADMIN_PASSWORD),
  });
  console.log('Allowed CORS origins:', allowedOrigins);
});
