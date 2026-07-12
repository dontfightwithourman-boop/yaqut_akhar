import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
const JWT_SECRET = process.env.JWT_SECRET || 'yaghout-seminar-secret-key-2024';

export interface AuthPayload { role: 'admin' | 'project'; username: string; projectId?: string; }
declare global { namespace Express { interface Request { user?: AuthPayload; } } }

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'توکن یافت نشد' });
  try { req.user = jwt.verify(token, JWT_SECRET) as AuthPayload; next(); }
  catch { return res.status(403).json({ error: 'توکن نامعتبر' }); }
}
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'دسترسی غیرمجاز' });
  next();
}
export function generateToken(payload: AuthPayload): string { return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }); }
