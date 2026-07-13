import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB, saveDB, queryAll, queryOne } from '../db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// ==================== WORKSHOP ITEMS ====================

router.get('/items', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const items = queryAll(db, 'SELECT * FROM workshop_items ORDER BY created_at DESC');
  res.json({ items });
});

router.get('/items/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const item = queryOne(db, 'SELECT * FROM workshop_items WHERE id = $id', { $id: req.params.id });
  if (!item) return res.status(404).json({ error: 'وسیله یافت نشد' });
  res.json({ item });
});

router.post('/items', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const { name, location, quantity, description } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'نام وسیله الزامی است' });
  const qty = Math.max(1, parseInt(quantity) || 1);
  const id = uuidv4();
  db.run('INSERT INTO workshop_items (id, name, location, quantity, description) VALUES ($id, $n, $loc, $qty, $desc)', {
    $id: id, $n: name.trim(), $loc: (location || '').trim(), $qty: qty, $desc: (description || '').trim()
  });
  saveDB();
  res.json({ item: { id, name: name.trim(), location: (location || '').trim(), quantity: qty, description: (description || '').trim() } });
});

router.put('/items/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const { id } = req.params;
  const { name, location, quantity, description } = req.body;
  if (!queryOne(db, 'SELECT id FROM workshop_items WHERE id = $id', { $id: id })) {
    return res.status(404).json({ error: 'وسیله یافت نشد' });
  }
  const updates: string[] = []; const params: Record<string, any> = { $id: id };
  if (name !== undefined) { updates.push('name = $n'); params.$n = name.trim(); }
  if (location !== undefined) { updates.push('location = $loc'); params.$loc = (location || '').trim(); }
  if (quantity !== undefined) { updates.push('quantity = $qty'); params.$qty = Math.max(1, parseInt(quantity) || 1); }
  if (description !== undefined) { updates.push('description = $desc'); params.$desc = (description || '').trim(); }
  if (updates.length) { updates.push("updated_at = datetime('now')"); db.run(`UPDATE workshop_items SET ${updates.join(', ')} WHERE id = $id`, params); }
  saveDB();
  res.json({ success: true });
});

router.delete('/items/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const { id } = req.params;
  // Check if item has active loans
  const activeLoans = queryOne(db, "SELECT COUNT(*) as cnt FROM workshop_loans WHERE item_id = $id AND status != 'returned'", { $id: id });
  if (activeLoans && activeLoans.cnt > 0) {
    return res.status(400).json({ error: 'این وسیله دارای قرض فعال است و قابل حذف نیست' });
  }
  db.run('DELETE FROM workshop_items WHERE id = $id', { $id: id });
  saveDB();
  res.json({ success: true });
});

// ==================== WORKSHOP LOANS ====================

router.get('/loans', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const loans = queryAll(db, 'SELECT * FROM workshop_loans ORDER BY return_date ASC');
  res.json({ loans });
});

// Create loan — auto-reduce item quantity
router.post('/loans', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const { item_id, item_name, quantity, group_number, borrower_name, borrow_date, return_date } = req.body;
  if (!item_id || !item_name?.trim() || !borrow_date || !return_date) {
    return res.status(400).json({ error: 'تمام فیلدها الزامی است' });
  }
  const qty = Math.max(1, parseInt(quantity) || 1);

  // Check available quantity
  const item = queryOne(db, 'SELECT id, quantity FROM workshop_items WHERE id = $id', { $id: item_id });
  if (!item) return res.status(404).json({ error: 'وسیله یافت نشد' });

  // Calculate currently loaned quantity
  const loanedResult = queryOne(db, "SELECT COALESCE(SUM(quantity), 0) as loaned FROM workshop_loans WHERE item_id = $id AND status != 'returned'", { $id: item_id });
  const currentlyLoaned = loanedResult ? (loanedResult.loaned as number) : 0;
  const available = (item.quantity as number) - currentlyLoaned;

  if (qty > available) {
    return res.status(400).json({ error: `تعداد موجود کافی نیست. موجود: ${available}` });
  }

  const id = uuidv4();
  db.run('INSERT INTO workshop_loans (id, item_id, item_name, quantity, group_number, borrower_name, borrow_date, return_date, status) VALUES ($id, $iid, $in, $qty, $gn, $bn, $bd, $rd, $st)', {
    $id: id, $iid: item_id, $in: item_name.trim(), $qty: qty, $gn: (group_number || '').trim(), $bn: (borrower_name || '').trim(), $bd: borrow_date, $rd: return_date, $st: 'borrowed'
  });
  saveDB();
  res.json({ loan: { id, item_id, item_name: item_name.trim(), quantity: qty, group_number: (group_number || '').trim(), borrower_name: (borrower_name || '').trim(), borrow_date, return_date, status: 'borrowed' } });
});

// Update loan status (return item) — auto-restore quantity
router.put('/loans/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const { id } = req.params;
  const { status } = req.body;
  const loan = queryOne(db, 'SELECT * FROM workshop_loans WHERE id = $id', { $id: id });
  if (!loan) return res.status(404).json({ error: 'قرض یافت نشد' });

  if (status === 'returned' && loan.status !== 'returned') {
    // Restore quantity to item
    db.run('UPDATE workshop_items SET quantity = quantity + $qty WHERE id = $iid', { $qty: loan.quantity, $iid: loan.item_id });
  }

  db.run('UPDATE workshop_loans SET status = $st WHERE id = $id', { $st: status || 'returned', $id: id });
  saveDB();
  res.json({ success: true });
});

router.delete('/loans/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const { id } = req.params;
  const loan = queryOne(db, 'SELECT * FROM workshop_loans WHERE id = $id', { $id: id });
  if (loan && loan.status !== 'returned') {
    // Restore quantity
    db.run('UPDATE workshop_items SET quantity = quantity + $qty WHERE id = $iid', { $qty: loan.quantity, $iid: loan.item_id });
  }
  db.run('DELETE FROM workshop_loans WHERE id = $id', { $id: id });
  saveDB();
  res.json({ success: true });
});

export default router;
