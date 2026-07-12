import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB, saveDB, queryOne, queryAll } from '../db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/award', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB(); const { projectIds, amount, note } = req.body;
  if (!projectIds?.length) return res.status(400).json({ error: 'حداقل یک پروژه انتخاب کنید' });
  if (!amount || amount < 1 || !Number.isInteger(amount)) return res.status(400).json({ error: 'تعداد یاقوت نامعتبر' });
  const awarded: { projectId: string; projectName: string; amount: number }[] = [];
  for (const pid of projectIds) {
    const p = queryOne(db, 'SELECT id, name FROM projects WHERE id = $id', { $id: pid }); if (!p) continue;
    db.run('UPDATE projects SET yaqut_count = yaqut_count + $a, updated_at = datetime(\'now\') WHERE id = $id', { $a: amount, $id: pid });
    db.run('INSERT INTO yaqut_events (id, project_id, amount, note) VALUES ($id, $pid, $a, $nt)', { $id: uuidv4(), $pid: pid, $a: amount, $nt: note || null });
    awarded.push({ projectId: pid, projectName: p.name as string, amount });
  }
  saveDB(); res.json({ success: true, awarded, totalAwarded: awarded.length * amount });
});

router.get('/:projectId', authenticateToken, (req: Request, res: Response) => {
  const db = getDB(); const { projectId } = req.params;
  if (req.user!.role === 'project' && req.user!.projectId !== projectId) return res.status(403).json({ error: 'دسترسی غیرمجاز' });
  res.json({ events: queryAll(db, 'SELECT id, amount, awarded_at, note FROM yaqut_events WHERE project_id = $pid ORDER BY awarded_at DESC', { $pid: projectId }) });
});

export default router;
