import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getDB, queryOne } from '../db';
import { generateToken, authenticateToken } from '../middleware/auth';

const router = Router();
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'shafa';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hishafa';

router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'نام کاربری و رمز عبور الزامی است' });
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ token: generateToken({ role: 'admin', username }), user: { role: 'admin', username } });
  }
  try {
    const db = getDB(); const row = queryOne(db, 'SELECT id, password FROM projects WHERE username = $u', { $u: username });
    if (!row) return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });
    if (!bcrypt.compareSync(password, row.password as string)) return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });
    const token = generateToken({ role: 'project', username, projectId: row.id as string });
    res.json({ token, user: { role: 'project', username, projectId: row.id as string } });
  } catch { return res.status(500).json({ error: 'خطای سرور' }); }
});

router.get('/verify', authenticateToken, (req: Request, res: Response) => { res.json({ user: req.user }); });

export default router;
