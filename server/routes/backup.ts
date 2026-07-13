import { Router, Request, Response } from 'express';
import { getDB, saveDB, queryAll } from '../db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Export full database as JSON
router.get('/export', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  try {
    const db = getDB();
    const projects = queryAll(db, 'SELECT * FROM projects');
    const members = queryAll(db, 'SELECT * FROM members');
    const yaqutEvents = queryAll(db, 'SELECT * FROM yaqut_events');
    const workshopItems = queryAll(db, 'SELECT * FROM workshop_items');
    const workshopLoans = queryAll(db, 'SELECT * FROM workshop_loans');

    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {
        projects,
        members,
        yaqut_events: yaqutEvents,
        workshop_items: workshopItems,
        workshop_loans: workshopLoans,
      }
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="yaghout-backup-${new Date().toISOString().split('T')[0]}.json"`);
    res.json(backup);
  } catch (err) {
    res.status(500).json({ error: 'خطا در تهیه نسخه پشتیبان' });
  }
});

// Import from JSON backup
router.post('/import', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    if (!data) return res.status(400).json({ error: 'داده‌های پشتیبان یافت نشد' });

    const db = getDB();

    // Clear existing data
    db.run('DELETE FROM workshop_loans');
    db.run('DELETE FROM workshop_items');
    db.run('DELETE FROM yaqut_events');
    db.run('DELETE FROM members');
    db.run('DELETE FROM projects');

    // Import projects
    if (data.projects && Array.isArray(data.projects)) {
      for (const p of data.projects) {
        db.run('INSERT INTO projects (id, name, username, password, description, logo, yaqut_count, created_at, updated_at) VALUES ($id, $n, $u, $pw, $d, $l, $yq, $ca, $ua)', {
          $id: p.id, $n: p.name, $u: p.username, $pw: p.password, $d: p.description || '', $l: p.logo || '', $yq: p.yaqut_count || 0, $ca: p.created_at || new Date().toISOString(), $ua: p.updated_at || new Date().toISOString()
        });
      }
    }

    // Import members
    if (data.members && Array.isArray(data.members)) {
      for (const m of data.members) {
        db.run('INSERT INTO members (id, project_id, name, period) VALUES ($id, $pid, $n, $p)', {
          $id: m.id, $pid: m.project_id, $n: m.name, $p: m.period || null
        });
      }
    }

    // Import yaqut events
    if (data.yaqut_events && Array.isArray(data.yaqut_events)) {
      for (const e of data.yaqut_events) {
        db.run('INSERT INTO yaqut_events (id, project_id, amount, awarded_at, note) VALUES ($id, $pid, $a, $aa, $n)', {
          $id: e.id, $pid: e.project_id, $a: e.amount, $aa: e.awarded_at || new Date().toISOString(), $n: e.note || null
        });
      }
    }

    // Import workshop items
    if (data.workshop_items && Array.isArray(data.workshop_items)) {
      for (const item of data.workshop_items) {
        db.run('INSERT INTO workshop_items (id, name, location, quantity, description, created_at, updated_at) VALUES ($id, $n, $loc, $qty, $d, $ca, $ua)', {
          $id: item.id, $n: item.name, $loc: item.location || '', $qty: item.quantity || 1, $d: item.description || '', $ca: item.created_at || new Date().toISOString(), $ua: item.updated_at || new Date().toISOString()
        });
      }
    }

    // Import workshop loans
    if (data.workshop_loans && Array.isArray(data.workshop_loans)) {
      for (const loan of data.workshop_loans) {
        db.run('INSERT INTO workshop_loans (id, item_id, item_name, quantity, group_number, borrower_name, borrow_date, return_date, status, created_at) VALUES ($id, $iid, $in, $qty, $gn, $bn, $bd, $rd, $st, $ca)', {
          $id: loan.id, $iid: loan.item_id, $in: loan.item_name, $qty: loan.quantity || 1, $gn: loan.group_number || '', $bn: loan.borrower_name || '', $bd: loan.borrow_date, $rd: loan.return_date, $st: loan.status || 'borrowed', $ca: loan.created_at || new Date().toISOString()
        });
      }
    }

    saveDB();
    res.json({ success: true, message: 'داده‌ها با موفقیت بازیابی شدند' });
  } catch (err) {
    res.status(500).json({ error: 'خطا در بازیابی داده‌ها' });
  }
});

export default router;
