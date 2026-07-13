import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB, saveDB, queryAll, queryOne } from '../db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// ==================== WORKSHOP ITEMS ====================

// Get all items
router.get('/items', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const items = queryAll(db, 'SELECT * FROM workshop_items ORDER BY created_at DESC');
  res.json({ items });
});

// Get single item
router.get('/items/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const item = queryOne(db, 'SELECT * FROM workshop_items WHERE id = $id', { $id: req.params.id });
  if (!item) return res.status(404).json({ error: 'وسیله یافت نشد' });
  res.json({ item });
});

// Create item
router.post('/items', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const { name, location, quantity, description } = req.body;
  if (!name) return res.status(400).json({ error: 'نام وسیله الزامی است' });
  const id = uuidv4();
  db.run('INSERT INTO workshop_items (id, name, location, quantity, description) VALUES ($id, $n, $loc, $qty, $desc)', {
    $id: id, $n: name, $loc: location || '', $qty: quantity || 1, $desc: description || ''
  });
  saveDB();
  res.json({ item: { id, name, location: location || '', quantity: quantity || 1, description: description || '' } });
});

// Update item
router.put('/items/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const { id } = req.params;
  const { name, location, quantity, description } = req.body;
  if (!queryOne(db, 'SELECT id FROM workshop_items WHERE id = $id', { $id: id })) {
    return res.status(404).json({ error: 'وسیله یافت نشد' });
  }
  const updates: string[] = []; const params: Record<string, any> = { $id: id };
  if (name !== undefined) { updates.push('name = $n'); params.$n = name; }
  if (location !== undefined) { updates.push('location = $loc'); params.$loc = location; }
  if (quantity !== undefined) { updates.push('quantity = $qty'); params.$qty = quantity; }
  if (description !== undefined) { updates.push('description = $desc'); params.$desc = description; }
  if (updates.length) { updates.push("updated_at = datetime('now')"); db.run(`UPDATE workshop_items SET ${updates.join(', ')} WHERE id = $id`, params); }
  saveDB();
  res.json({ success: true });
});

// Delete item
router.delete('/items/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const { id } = req.params;
  db.run('DELETE FROM workshop_items WHERE id = $id', { $id: id });
  saveDB();
  res.json({ success: true });
});

// ==================== WORKSHOP LOANS ====================

// Get all loans (sorted by return_date ascending - closest deadline first)
router.get('/loans', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const loans = queryAll(db, 'SELECT * FROM workshop_loans ORDER BY return_date ASC');
  res.json({ loans });
});

// Create loan
router.post('/loans', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const { item_id, item_name, quantity, group_name, borrower_name, borrow_date, return_date } = req.body;
  if (!item_id || !item_name || !borrow_date || !return_date) {
    return res.status(400).json({ error: 'تمام فیلدها الزامی است' });
  }
  const id = uuidv4();
  db.run('INSERT INTO workshop_loans (id, item_id, item_name, quantity, group_name, borrower_name, borrow_date, return_date, status) VALUES ($id, $iid, $in, $qty, $gn, $bn, $bd, $rd, $st)', {
    $id: id, $iid: item_id, $in: item_name, $qty: quantity || 1, $gn: group_name || '', $bn: borrower_name || '', $bd: borrow_date, $rd: return_date, $st: 'borrowed'
  });
  saveDB();
  res.json({ loan: { id, item_id, item_name, quantity: quantity || 1, group_name: group_name || '', borrower_name: borrower_name || '', borrow_date, return_date, status: 'borrowed' } });
});

// Update loan status (return item)
router.put('/loans/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const { id } = req.params;
  const { status } = req.body;
  if (!queryOne(db, 'SELECT id FROM workshop_loans WHERE id = $id', { $id: id })) {
    return res.status(404).json({ error: 'قرض یافت نشد' });
  }
  db.run('UPDATE workshop_loans SET status = $st WHERE id = $id', { $st: status || 'returned', $id: id });
  saveDB();
  res.json({ success: true });
});

// Delete loan
router.delete('/loans/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const { id } = req.params;
  db.run('DELETE FROM workshop_loans WHERE id = $id', { $id: id });
  saveDB();
  res.json({ success: true });
});

export default router;
