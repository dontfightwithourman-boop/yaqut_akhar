import express from 'express';
import cors from 'cors';
import { initDB } from './db';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import yaqutRoutes from './routes/yaqut';
import leaderboardRoutes from './routes/leaderboard';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.disable('x-powered-by');
app.use(cors({ origin: FRONTEND_URL, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '1mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/yaqut', yaqutRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

async function start() {
  try { await initDB(); app.listen(PORT, () => console.log(`Server on port ${PORT}`)); }
  catch (err) { console.error('Server failed:', err); process.exit(1); }
}
start();
