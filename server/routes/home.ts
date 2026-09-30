import { Router } from 'express';
import { getDB, queryAll, queryOne } from '../db';

const router = Router();

router.get('/stats', (req, res) => {
  const db = getDB();
  const projects = queryAll(db, 'SELECT id FROM projects');
  const totalProjects = projects.length;
  const totalYaqut = projects.reduce((sum, p) => {
  const row = queryOne(
    db,
    'SELECT COALESCE(yaqut_count, 0) as total FROM projects WHERE id = $id',
    { $id: p.id }
  );
  return sum + (row ? Number(row.total) : 0);
}, 0);
  const members = queryAll(db, 'SELECT COUNT(*) as cnt FROM members');
  const totalMembers = members.length > 0 ? (members[0].cnt as number) : 0;
  res.json({ stats: { projects: totalProjects, yaqut: totalYaqut, members: totalMembers } });
});

export default router;
