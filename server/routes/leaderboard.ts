import { Router } from 'express';
import { getDB, queryAll } from '../db';

const router = Router();
router.get('/', (req, res) => {
  const db = getDB();
  const rows = queryAll(db, 'SELECT id, name, username, description, logo, yaqut_count FROM projects ORDER BY yaqut_count DESC');
  const leaderboard = rows.map((r, i) => {
    const members = queryAll(db, 'SELECT name FROM members WHERE project_id = $pid', { $pid: r.id });
    return { rank: i + 1, id: r.id, name: r.name, username: r.username, description: r.description, logo: r.logo, yaqut_count: r.yaqut_count, members: members.map((m) => m.name as string) };
  });
  res.json({ leaderboard });
});
export default router;
