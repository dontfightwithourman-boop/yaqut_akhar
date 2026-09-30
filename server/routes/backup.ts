import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

import { getDB, saveDB, queryAll } from '../db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// ============================================================
// Temporary download tokens
// ============================================================

type DownloadEntry = {
  filePath: string;
  fileName: string;
  expiresAt: number;
};

const downloadTokens = new Map<string, DownloadEntry>();

const DOWNLOAD_EXPIRE_MS = 5 * 60 * 1000; // 5 minutes

// Cleanup expired temporary backup files
setInterval(() => {
  const now = Date.now();

  for (const [token, entry] of downloadTokens.entries()) {
    if (entry.expiresAt <= now) {
      try {
        if (fs.existsSync(entry.filePath)) {
          fs.unlinkSync(entry.filePath);
        }
      } catch (err) {
        console.error(
          'Failed to delete expired backup:',
          err
        );
      }

      downloadTokens.delete(token);
    }
  }
}, 60 * 1000);

// ============================================================
// Build backup object
// ============================================================

function createBackup() {
  const db = getDB();

  const projects = queryAll(
    db,
    'SELECT * FROM projects'
  );

  const members = queryAll(
    db,
    'SELECT * FROM members'
  );

  const yaqutEvents = queryAll(
    db,
    'SELECT * FROM yaqut_events'
  );

  const workshopItems = queryAll(
    db,
    'SELECT * FROM workshop_items'
  );

  const workshopLoans = queryAll(
    db,
    'SELECT * FROM workshop_loans'
  );

  const news = queryAll(
    db,
    'SELECT * FROM news'
  );

  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    data: {
      projects,
      members,
      yaqut_events: yaqutEvents,
      workshop_items: workshopItems,
      workshop_loans: workshopLoans,
      news,
    },
  };
}

// ============================================================
// Create authenticated download link
// ============================================================

router.get(
  '/export-link',
  authenticateToken,
  requireAdmin,
  (req: Request, res: Response) => {
    try {
      const backup = createBackup();

      const json = JSON.stringify(backup);

      const date = new Date()
        .toISOString()
        .split('T')[0];

      const fileName =
        `yaghout-backup-${date}.json`;

      const token = crypto
        .randomBytes(32)
        .toString('hex');

      const filePath = path.join(
        os.tmpdir(),
        `yaghout-backup-${token}.json`
      );

      fs.writeFileSync(
        filePath,
        json,
        'utf8'
      );

      const fileSize = fs.statSync(filePath).size;

      const expiresAt =
        Date.now() + DOWNLOAD_EXPIRE_MS;

      downloadTokens.set(token, {
        filePath,
        fileName,
        expiresAt,
      });

      console.log(
        `Backup created: ${fileSize} bytes`
      );

      return res.json({
        success: true,
        url: `/api/backup/download/${token}`,
        fileName,
        size: fileSize,
        expiresIn: DOWNLOAD_EXPIRE_MS / 1000,
      });
    } catch (err) {
      console.error(
        'Backup export-link error:',
        err
      );

      return res.status(500).json({
        error:
          'خطا در تهیه نسخه پشتیبان',
      });
    }
  }
);

// ============================================================
// Direct backup download
// ============================================================

router.get(
  '/download/:token',
  (req: Request, res: Response) => {
    const { token } = req.params;

    const entry = downloadTokens.get(token);

    if (!entry) {
      return res.status(404).json({
        error:
          'لینک دانلود نامعتبر یا منقضی شده است',
      });
    }

    if (entry.expiresAt <= Date.now()) {
      try {
        if (fs.existsSync(entry.filePath)) {
          fs.unlinkSync(entry.filePath);
        }
      } catch (err) {
        console.error(
          'Failed to delete expired backup:',
          err
        );
      }

      downloadTokens.delete(token);

      return res.status(410).json({
        error:
          'لینک دانلود منقضی شده است',
      });
    }

    if (!fs.existsSync(entry.filePath)) {
      downloadTokens.delete(token);

      return res.status(404).json({
        error:
          'فایل پشتیبان یافت نشد',
      });
    }

    res.setHeader(
      'Content-Type',
      'application/json; charset=utf-8'
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${entry.fileName}"`
    );

    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate'
    );

    res.setHeader(
      'Pragma',
      'no-cache'
    );

    const fileSize =
      fs.statSync(entry.filePath).size;

    res.setHeader(
      'Content-Length',
      fileSize
    );

    const cleanup = () => {
      try {
        if (fs.existsSync(entry.filePath)) {
          fs.unlinkSync(entry.filePath);
        }
      } catch (err) {
        console.error(
          'Failed to cleanup backup:',
          err
        );
      }

      downloadTokens.delete(token);
    };

    res.on('finish', cleanup);
    res.on('close', cleanup);
    res.on('error', cleanup);

    return res.sendFile(
      entry.filePath,
      (err) => {
        if (err) {
          console.error(
            'Backup download error:',
            err
          );

          cleanup();

          if (!res.headersSent) {
            res.status(500).json({
              error:
                'خطا در دانلود فایل پشتیبان',
            });
          }
        }
      }
    );
  }
);

// ============================================================
// Old export endpoint
// Kept for compatibility
// ============================================================

router.get(
  '/export',
  authenticateToken,
  requireAdmin,
  (req: Request, res: Response) => {
    try {
      const backup = createBackup();

      const json = JSON.stringify(backup);

      const fileName =
        `yaghout-backup-${
          new Date()
            .toISOString()
            .split('T')[0]
        }.json`;

      res.setHeader(
        'Content-Type',
        'application/json; charset=utf-8'
      );

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`
      );

      res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate'
      );

      return res.send(json);
    } catch (err) {
      console.error(
        'Backup export error:',
        err
      );

      return res.status(500).json({
        error:
          'خطا در تهیه نسخه پشتیبان',
      });
    }
  }
);

// ============================================================
// Import backup
// ============================================================

router.post(
  '/import',
  authenticateToken,
  requireAdmin,
  (req: Request, res: Response) => {
    try {
      const { data } = req.body;

      if (!data) {
        return res.status(400).json({
          error:
            'داده‌های پشتیبان یافت نشد',
        });
      }

      const db = getDB();

      // Clear existing data
      db.run(
        'DELETE FROM workshop_loans'
      );

      db.run(
        'DELETE FROM workshop_items'
      );

      db.run(
        'DELETE FROM yaqut_events'
      );

      db.run(
        'DELETE FROM members'
      );

      db.run(
        'DELETE FROM projects'
      );

      db.run(
        'DELETE FROM news'
      );

      // ========================================================
      // Projects
      // ========================================================

      if (
        data.projects &&
        Array.isArray(data.projects)
      ) {
        for (const p of data.projects) {
          db.run(
            `
            INSERT INTO projects
            (
              id,
              name,
              username,
              password,
              description,
              logo,
              yaqut_count,
              created_at,
              updated_at
            )
            VALUES
            (
              $id,
              $n,
              $u,
              $pw,
              $d,
              $l,
              $yq,
              $ca,
              $ua
            )
            `,
            {
              $id: p.id,
              $n: p.name,
              $u: p.username,
              $pw: p.password,
              $d: p.description || '',
              $l: p.logo || '',
              $yq: p.yaqut_count || 0,
              $ca:
                p.created_at ||
                new Date().toISOString(),
              $ua:
                p.updated_at ||
                new Date().toISOString(),
            }
          );
        }
      }

      // ========================================================
      // Members
      // ========================================================

      if (
        data.members &&
        Array.isArray(data.members)
      ) {
        for (const m of data.members) {
          db.run(
            `
            INSERT INTO members
            (
              id,
              project_id,
              name,
              period
            )
            VALUES
            (
              $id,
              $pid,
              $n,
              $p
            )
            `,
            {
              $id: m.id,
              $pid: m.project_id,
              $n: m.name,
              $p: m.period || null,
            }
          );
        }
      }

      // ========================================================
      // Yaqut events
      // ========================================================

      if (
        data.yaqut_events &&
        Array.isArray(
          data.yaqut_events
        )
      ) {
        for (const e of data.yaqut_events) {
          db.run(
            `
            INSERT INTO yaqut_events
            (
              id,
              project_id,
              amount,
              awarded_at,
              note
            )
            VALUES
            (
              $id,
              $pid,
              $a,
              $aa,
              $n
            )
            `,
            {
              $id: e.id,
              $pid: e.project_id,
              $a: e.amount,
              $aa:
                e.awarded_at ||
                new Date().toISOString(),
              $n: e.note || null,
            }
          );
        }
      }

      // ========================================================
      // Workshop items
      // ========================================================

      if (
        data.workshop_items &&
        Array.isArray(
          data.workshop_items
        )
      ) {
        for (const item of data.workshop_items) {
          db.run(
            `
            INSERT INTO workshop_items
            (
              id,
              name,
              location,
              quantity,
              description,
              created_at,
              updated_at
            )
            VALUES
            (
              $id,
              $n,
              $loc,
              $qty,
              $d,
              $ca,
              $ua
            )
            `,
            {
              $id: item.id,
              $n: item.name,
              $loc:
                item.location || '',
              $qty:
                item.quantity || 1,
              $d:
                item.description || '',
              $ca:
                item.created_at ||
                new Date().toISOString(),
              $ua:
                item.updated_at ||
                new Date().toISOString(),
            }
          );
        }
      }

      // ========================================================
      // Workshop loans
      // ========================================================

      if (
        data.workshop_loans &&
        Array.isArray(
          data.workshop_loans
        )
      ) {
        for (
          const loan of data.workshop_loans
        ) {
          db.run(
            `
            INSERT INTO workshop_loans
            (
              id,
              item_id,
              item_name,
              quantity,
              group_number,
              borrower_name,
              borrow_date,
              return_date,
              status,
              created_at
            )
            VALUES
            (
              $id,
              $iid,
              $in,
              $qty,
              $gn,
              $bn,
              $bd,
              $rd,
              $st,
              $ca
            )
            `,
            {
              $id: loan.id,
              $iid: loan.item_id,
              $in: loan.item_name,
              $qty:
                loan.quantity || 1,
              $gn:
                loan.group_number || '',
              $bn:
                loan.borrower_name || '',
              $bd: loan.borrow_date,
              $rd: loan.return_date,
              $st:
                loan.status ||
                'borrowed',
              $ca:
                loan.created_at ||
                new Date().toISOString(),
            }
          );
        }
      }

      // ========================================================
      // News
      // ========================================================

      if (
        data.news &&
        Array.isArray(data.news)
      ) {
        for (const n of data.news) {
          db.run(
            `
            INSERT INTO news
            (
              id,
              title,
              content,
              media,
              status,
              created_at,
              updated_at
            )
            VALUES
            (
              $id,
              $t,
              $c,
              $m,
              $s,
              $ca,
              $ua
            )
            `,
            {
              $id: n.id,
              $t: n.title,
              $c: n.content || '',
              $m:
                typeof n.media === 'string'
                  ? n.media
                  : JSON.stringify(
                      n.media || []
                    ),
              $s:
                n.status || 'draft',
              $ca:
                n.created_at ||
                new Date().toISOString(),
              $ua:
                n.updated_at ||
                new Date().toISOString(),
            }
          );
        }
      }

      saveDB();

      return res.json({
        success: true,
        message:
          'داده‌ها با موفقیت بازیابی شدند',
      });
    } catch (err) {
      console.error(
        'Backup import error:',
        err
      );

      return res.status(500).json({
        error:
          'خطا در بازیابی داده‌ها',
      });
    }
  }
);

export default router;
