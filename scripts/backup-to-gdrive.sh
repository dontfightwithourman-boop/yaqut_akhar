#!/bin/bash

PROJECT_DIR="/home/deploy/yaqut_akhar"
DB_FILE="$PROJECT_DIR/server/yaghout.db"
BACKUP_DIR="/tmp/yaghout-backups"
LOG_FILE="/var/log/yaghout-backup.log"

mkdir -p "$BACKUP_DIR"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting Yaghout backup..."

if [ ! -f "$DB_FILE" ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: Database not found: $DB_FILE"
    exit 1
fi

BACKUP_FILE="$BACKUP_DIR/yaghout-backup-$(date '+%Y-%m-%d_%H-%M-%S').db"

cp "$DB_FILE" "$BACKUP_FILE"

if [ $? -ne 0 ] || [ ! -s "$BACKUP_FILE" ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: Backup creation failed"
    rm -f "$BACKUP_FILE"
    exit 1
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup created:"
ls -lh "$BACKUP_FILE"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Uploading to Google Drive..."

rclone copy "$BACKUP_FILE" "gdrive:Yaghout Backups"

if [ $? -ne 0 ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: Upload failed"
    exit 1
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Upload completed successfully."

rm -f "$BACKUP_FILE"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Temporary file removed."
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup finished successfully."

exit 0

