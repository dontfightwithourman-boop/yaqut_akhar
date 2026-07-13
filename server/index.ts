import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initDB, getDBBackup } from './db';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import yaqutRoutes from './routes/yaqut';
import leaderboardRoutes from './routes/leaderboard';
import workshopRoutes from './routes/workshop';
import backupRoutes from './routes/backup';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BACKUP_KEY = process.env.BACKUP_KEY || 'yaghout-backup-2025';

// Security headers
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

app.disable('x-powered-by');
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001'];
    if (!origin || allowedOrigins.includes(origin)) { callback(null, true); }
    else { callback(new Error('Not allowed by CORS')); }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting (simple in-memory)
const requestCounts = new Map<string, number[]>();
app.use((req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 100;

  const timestamps = requestCounts.get(ip) || [];
  const recent = timestamps.filter(t => now - t < windowMs);
  recent.push(now);
  requestCounts.set(ip, recent);

  if (recent.length > maxRequests) {
    return res.status(429).json({ error: 'درخواست‌ها بیش از حد مجاز است' });
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/yaqut', yaqutRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/workshop', workshopRoutes);
app.use('/api/backup', backupRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Backup endpoint - download database
app.get('/api/backup-raw', (req, res) => {
  const key = req.query.key;
  if (key !== BACKUP_KEY) return res.status(403).json({ error: 'Forbidden' });
  const backup = getDBBackup();
  res.json({ data: backup, timestamp: new Date().toISOString() });
});

// Cleanup old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of requestCounts.entries()) {
    const recent = timestamps.filter(t => now - t < 60000);
    if (recent.length === 0) requestCounts.delete(ip);
    else requestCounts.set(ip, recent);
  }
}, 300000);

async function start() {
  try { await initDB(); app.listen(PORT, () => console.log(`Server on port ${PORT}`)); }
  catch (err) { console.error('Server failed:', err); process.exit(1); }
}
start();
