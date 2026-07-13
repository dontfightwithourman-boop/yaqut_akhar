import initSqlJs, { Database } from 'sql.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'yaghout.db');
let db: Database;

export function queryAll(db: Database, sql: string, params: Record<string, any> = {}): Record<string, any>[] {
  const stmt = db.prepare(sql); stmt.bind(params); const rows: Record<string, any>[] = [];
  while (stmt.step()) rows.push(stmt.getAsObject()); stmt.free(); return rows;
}
export function queryOne(db: Database, sql: string, params: Record<string, any> = {}): Record<string, any> | null {
  const r = queryAll(db, sql, params); return r.length > 0 ? r[0] : null;
}

export async function initDB(): Promise<Database> {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) { db = new SQL.Database(fs.readFileSync(DB_PATH)); }
  else { db = new SQL.Database(); }

  db.run('CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, name TEXT NOT NULL, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, description TEXT DEFAULT \'\', logo TEXT DEFAULT \'\', yaqut_count INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime(\'now\')), updated_at TEXT DEFAULT (datetime(\'now\')))');
  db.run('CREATE TABLE IF NOT EXISTS members (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id TEXT NOT NULL, name TEXT NOT NULL, period TEXT, FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE)');
  db.run('CREATE TABLE IF NOT EXISTS yaqut_events (id TEXT PRIMARY KEY, project_id TEXT NOT NULL, amount INTEGER NOT NULL, awarded_at TEXT DEFAULT (datetime(\'now\')), note TEXT, FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE)');
  db.run('CREATE TABLE IF NOT EXISTS workshop_items (id TEXT PRIMARY KEY, name TEXT NOT NULL, location TEXT DEFAULT \'\', quantity INTEGER DEFAULT 1, description TEXT DEFAULT \'\', created_at TEXT DEFAULT (datetime(\'now\')), updated_at TEXT DEFAULT (datetime(\'now\')))');
  db.run('CREATE TABLE IF NOT EXISTS workshop_loans (id TEXT PRIMARY KEY, loan_number INTEGER, item_id TEXT NOT NULL, item_name TEXT NOT NULL, quantity INTEGER DEFAULT 1, group_number TEXT DEFAULT \'\', borrower_name TEXT DEFAULT \'\', borrow_date TEXT NOT NULL, return_date TEXT NOT NULL, status TEXT DEFAULT \'borrowed\', created_at TEXT DEFAULT (datetime(\'now\')), FOREIGN KEY (item_id) REFERENCES workshop_items(id) ON DELETE CASCADE)');

  // Migrations
  try { db.run('ALTER TABLE workshop_loans RENAME COLUMN group_name TO group_number'); } catch { /* */ }
  try { db.run('ALTER TABLE projects ADD COLUMN description TEXT DEFAULT \'\''); } catch { /* */ }
  try { db.run('ALTER TABLE projects ADD COLUMN logo TEXT DEFAULT \'\''); } catch { /* */ }
  try { db.run('ALTER TABLE workshop_loans ADD COLUMN loan_number INTEGER'); } catch { /* */ }
  try { db.run('ALTER TABLE workshop_loans ADD COLUMN phone_number TEXT DEFAULT \'\''); } catch { /* */ }

  const count = queryOne(db, 'SELECT COUNT(*) as cnt FROM projects');
  if (count && count.cnt === 0) seedData();
  saveDB(); return db;
}

function seedData() {
  const hash = bcrypt.hashSync('team123', 10);
  const projects = [
    { name: 'سیستم مدیریت هوشمند مدرسه', desc: 'سیستم مدیریت هوشمند برای بهبود فرآیندهای آموزشی', username: 'team-alpha', members: [{ name: 'علی محمدی', period: 'هفتم' }, { name: 'سارا احمدی', period: 'هفتم' }], yq: 45 },
    { name: 'اپلیکیشن یادگیری زبان', desc: 'اپلیکیشن تعاملی برای یادگیری زبان انگلیسی', username: 'team-beta', members: [{ name: 'زهرا کریمی', period: 'هشتم' }], yq: 32 },
    { name: 'ربات هوشمند مشاوره', desc: 'ربات هوشمند برای مشاوره تحصیلی', username: 'team-gamma', members: [{ name: 'نیلوفر صادقی', period: 'هفتم' }, { name: 'امید فرهمند', period: 'هفتم' }], yq: 28 },
    { name: 'سیستم نظارت بر کیفیت هوا', desc: 'سیستم هوشمند نظارت بر کیفیت هوای مدرسه', username: 'team-delta', members: [{ name: 'حسین مهدوی', period: 'هشتم' }], yq: 18 },
    { name: 'پلتفرم مدیریت پروژه', desc: 'پلتفرم مدیریت و ردیابی پروژه‌های مدرسه', username: 'team-epsilon', members: [{ name: 'عرفان شریفی', period: 'هفتم' }], yq: 12 },
    { name: 'بازی آموزشی ریاضی', desc: 'بازی تعاملی برای یادگیری مفاهیم ریاضی', username: 'team-zeta', members: [{ name: 'پریسا بهرامی', period: 'هشتم' }], yq: 7 },
  ];
  for (const p of projects) {
    const id = uuidv4();
    db.run('INSERT INTO projects (id, name, username, password, description, yaqut_count) VALUES ($id, $n, $u, $pw, $desc, $yq)', { $id: id, $n: p.name, $u: p.username, $pw: hash, $desc: p.desc, $yq: p.yq });
    for (const m of p.members) db.run('INSERT INTO members (project_id, name, period) VALUES ($id, $n, $p)', { $id: id, $n: m.name, $p: m.period });
    if (p.yq > 0) { const ec = Math.min(Math.floor(p.yq / 5), 6); let rem = p.yq; const notes = ['ارائه', 'پوستر', 'گزارش', 'مشارکت', 'کیفیت', 'ابتکار']; for (let i = 0; i < ec; i++) { const amt = i === ec - 1 ? rem : Math.floor(rem / (ec - i)); rem -= amt; db.run('INSERT INTO yaqut_events (id, project_id, amount, note) VALUES ($id, $pid, $a, $nt)', { $id: uuidv4(), $pid: id, $a: amt, $nt: notes[i % notes.length] }); } }
  }
}

export function getDB(): Database { if (!db) throw new Error('DB not initialized'); return db; }
export function saveDB() { if (!db) return; try { fs.writeFileSync(DB_PATH, Buffer.from(db.export())); } catch { /* */ } }
setInterval(() => { try { saveDB(); } catch { /* */ } }, 30000);
export function getDBBackup(): string { if (!db) return ''; return Buffer.from(db.export()).toString('base64'); }
