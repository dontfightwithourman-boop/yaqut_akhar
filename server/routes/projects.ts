import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { getDB, saveDB, queryAll, queryOne } from '../db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public route - anyone can view a project
router.get('/public/:id', (req: Request, res: Response) => {
  const db = getDB();
  const project = queryOne(db, 'SELECT id, name, username, description, logo, yaqut_count, created_at, updated_at FROM projects WHERE id = $id', { $id: req.params.id });
  if (!project) return res.status(404).json({ error: 'پروژه یافت نشد' });
  project.members = queryAll(db, 'SELECT name, period FROM members WHERE project_id = $pid', { $pid: req.params.id });
  project.yaqut_history = queryAll(db, 'SELECT id, amount, awarded_at, note FROM yaqut_events WHERE project_id = $pid ORDER BY awarded_at DESC', { $pid: req.params.id });
  res.json({ project });
});

// Admin routes
router.get('/', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB(); const projects = queryAll(db, 'SELECT id, name, username, description, logo, yaqut_count, created_at, updated_at FROM projects ORDER BY yaqut_count DESC');
  for (const p of projects) p.members = queryAll(db, 'SELECT name, period FROM members WHERE project_id = $pid', { $pid: p.id });
  res.json({ projects });
});

router.get('/:id', authenticateToken, (req: Request, res: Response) => {
  const db = getDB(); const targetId = (req.user!.role === 'project' && req.params.id === 'self') ? req.user!.projectId : req.params.id;
  if (req.user!.role === 'project' && req.user!.projectId !== targetId) return res.status(403).json({ error: 'دسترسی غیرمجاز' });
  const project = queryOne(db, 'SELECT id, name, username, description, logo, yaqut_count, created_at, updated_at FROM projects WHERE id = $id', { $id: targetId });
  if (!project) return res.status(404).json({ error: 'پروژه یافت نشد' });
  project.members = queryAll(db, 'SELECT name, period FROM members WHERE project_id = $pid', { $pid: targetId });
  project.yaqut_history = queryAll(db, 'SELECT id, amount, awarded_at, note FROM yaqut_events WHERE project_id = $pid ORDER BY awarded_at DESC', { $pid: targetId });
  res.json({ project });
});

router.post('/', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB(); const { name, username, password, description, logo, members } = req.body;
  if (!name || !username) return res.status(400).json({ error: 'نام و نام کاربری الزامی است' });
  if (queryOne(db, 'SELECT id FROM projects WHERE username = $u', { $u: username })) return res.status(400).json({ error: 'نام کاربری تکراری' });
  const id = uuidv4(); db.run('INSERT INTO projects (id, name, username, password, description, logo) VALUES ($id, $n, $u, $pw, $d, $l)', { $id: id, $n: name, $u: username, $pw: bcrypt.hashSync(password || 'team123', 10), $d: description || '', $l: logo || '' });
  if (members?.length) for (const m of members) db.run('INSERT INTO members (project_id, name, period) VALUES ($id, $n, $p)', { $id: id, $n: m.name, $p: m.period || null });
  saveDB(); res.json({ project: { id, name, username, password: password || 'team123', description: description || '', logo: logo || '', yaqut_count: 0, members: members || [] } });
});

router.put('/:id', authenticateToken, (req: Request, res: Response) => {
  const db = getDB(); const { id } = req.params; const { name, username, password, description, logo, members } = req.body;
  const isProjectOwner = req.user!.role === 'project' && req.user!.projectId === id;
  const isAdmin = req.user!.role === 'admin';
  if (!isAdmin && !isProjectOwner) return res.status(403).json({ error: 'دسترسی غیرمجاز' });
  if (!queryOne(db, 'SELECT id FROM projects WHERE id = $id', { $id: id })) return res.status(404).json({ error: 'پروژه یافت نشد' });
  const u: string[] = []; const p: Record<string, any> = { $id: id };
  if (isAdmin && username) {
    if (queryOne(db, 'SELECT id FROM projects WHERE username = $u AND id != $id', { $u: username, $id: id })) return res.status(400).json({ error: 'نام کاربری تکراری' });
    u.push('username = $u'); p.$u = username;
  }
  if (isAdmin && password) { u.push('password = $pw'); p.$pw = bcrypt.hashSync(password, 10); }
  if (name !== undefined) { u.push('name = $n'); p.$n = name; }
  if (description !== undefined) { u.push('description = $d'); p.$d = description; }
  if (logo !== undefined) { u.push('logo = $l'); p.$l = logo; }
  if (u.length) { u.push("updated_at = datetime('now')"); db.run(`UPDATE projects SET ${u.join(', ')} WHERE id = $id`, p); }
  if (members?.length) { db.run('DELETE FROM members WHERE project_id = $id', { $id: id }); for (const m of members) db.run('INSERT INTO members (project_id, name, period) VALUES ($id, $n, $p)', { $id: id, $n: m.name, $p: m.period || null }); }
  saveDB(); res.json({ success: true });
});

router.delete('/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB(); const { id } = req.params;
  db.run('DELETE FROM yaqut_events WHERE project_id = $id', { $id: id }); db.run('DELETE FROM members WHERE project_id = $id', { $id: id }); db.run('DELETE FROM projects WHERE id = $id', { $id: id });
  saveDB(); res.json({ success: true });
});

export default router;
