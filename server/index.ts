import express from 'express';
import cors from 'cors';
import { initDB, getDBBackup } from './db';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import yaqutRoutes from './routes/yaqut';
import leaderboardRoutes from './routes/leaderboard';
import workshopRoutes from './routes/workshop';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BACKUP_KEY = process.env.BACKUP_KEY || 'yaghout-backup-2025';

app.disable('x-powered-by');
app.use(cors({ origin: FRONTEND_URL, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/yaqut', yaqutRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/workshop', workshopRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Backup endpoint - download database
app.get('/api/backup', (req, res) => {
  const key = req.query.key;
  if (key !== BACKUP_KEY) return res.status(403).json({ error: 'Forbidden' });
  const backup = getDBBackup();
  res.json({ data: backup, timestamp: new Date().toISOString() });
});

async function start() {
  try { await initDB(); app.listen(PORT, () => console.log(`Server on port ${PORT}`)); }
  catch (err) { console.error('Server failed:', err); process.exit(1); }
}
start();
