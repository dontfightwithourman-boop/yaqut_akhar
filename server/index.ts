import express from 'express';
import cors from 'cors';
import { initDB, getDBBackup } from './db';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import yaqutRoutes from './routes/yaqut';
import leaderboardRoutes from './routes/leaderboard';
import workshopRoutes from './routes/workshop';
import backupRoutes from './routes/backup';
import newsRoutes from './routes/news';
import homeRoutes from './routes/home';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.disable('x-powered-by');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('فرمت تصویر نامعتبر است'));
  }
});

app.use('/uploads', express.static(uploadsDir));
app.use(express.urlencoded({ extended: true }));

// CORS - restricted to frontend only
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'https://yaghout-frontend.onrender.com',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}));

app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/yaqut', yaqutRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/workshop', workshopRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/home', homeRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

export { upload };

async function start() {
  try { await initDB(); app.listen(PORT, () => console.log(`Server on port ${PORT}`)); }
  catch (err) { console.error('Server failed:', err); process.exit(1); }
}
start();
