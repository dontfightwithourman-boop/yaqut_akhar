import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB, saveDB, queryAll, queryOne } from '../db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const db = getDB();
  const news = queryAll(db, "SELECT id, title, content, media, status, created_at, updated_at FROM news WHERE status = 'published' ORDER BY created_at DESC");
  res.json({ news: news.map((n) => ({ ...n, media: typeof n.media === 'string' ? JSON.parse(n.media) : n.media })) });
});

router.get('/:id', (req: Request, res: Response) => {
  const db = getDB();
  const item = queryOne(db, 'SELECT id, title, content, media, status, created_at, updated_at FROM news WHERE id = $id', { $id: req.params.id });
  if (!item) return res.status(404).json({ error: 'خبر یافت نشد' });
  res.json({ news: { ...item, media: typeof item.media === 'string' ? JSON.parse(item.media) : item.media } });
});

router.post('/', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const { title, content, media, status } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: 'عنوان خبر الزامی است' });
  const id = uuidv4();
  const now = new Date().toISOString();
  db.run('INSERT INTO news (id, title, content, media, status, created_at, updated_at) VALUES ($id, $t, $c, $m, $s, $now, $now)', {
    $id: id, $t: title.trim(), $c: (content || '').trim(), $m: JSON.stringify(media || []), $s: status || 'draft', $now: now
  });
  saveDB();
  res.json({ news: { id, title: title.trim(), content: (content || '').trim(), media: media || [], status: status || 'draft', created_at: now, updated_at: now } });
});

router.put('/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB(); const { id } = req.params;
  const { title, content, media, status } = req.body;
  if (!queryOne(db, 'SELECT id FROM news WHERE id = $id', { $id: id })) return res.status(404).json({ error: 'خبر یافت نشد' });
  const u: string[] = []; const p: Record<string, any> = { $id: id };
  if (title !== undefined) { u.push('title = $t'); p.$t = title.trim(); }
  if (content !== undefined) { u.push('content = $c'); p.$c = (content || '').trim(); }
  if (media !== undefined) { u.push('media = $m'); p.$m = JSON.stringify(media); }
  if (status !== undefined) { u.push('status = $s'); p.$s = status; }
  u.push("updated_at = datetime('now')");
  db.run(`UPDATE news SET ${u.join(', ')} WHERE id = $id`, p);
  saveDB();
  const updated = queryOne(db, 'SELECT id, title, content, media, status, created_at, updated_at FROM news WHERE id = $id', { $id: id });
  res.json({ news: { ...updated, media: typeof updated.media === 'string' ? JSON.parse(updated.media) : updated.media } });
});

router.delete('/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB(); const { id } = req.params;
  db.run('DELETE FROM news WHERE id = $id', { $id: id });
  saveDB();
  res.json({ success: true });
});

export default router;
