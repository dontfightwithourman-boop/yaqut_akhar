import sqlite3, json
conn = sqlite3.connect(r'C:\Users\SATM\.local\share\mimocode\mimocode.db')
c = conn.cursor()

# Search user messages for rule-like statements in yaghout project
c.execute("""
    SELECT m.id, m.session_id, m.time_created,
           json_extract(p.data, '$.type') as part_type,
           json_extract(p.data, '$.text') as text
    FROM message m 
    JOIN part p ON p.message_id = m.id
    WHERE m.session_id IN (
        SELECT id FROM session 
        WHERE project_id = 'acb62931-3d4f-4d00-b140-4eb7f8bfbe19' 
        AND title NOT LIKE 'checkpoint-writer%'
        AND title NOT LIKE 'Auto Dream%'
    )
    AND json_extract(m.data, '$.role') = 'user'
    AND json_extract(p.data, '$.type') = 'text'
    ORDER BY m.time_created DESC
""")
print("=== ALL USER TEXT MESSAGES ===")
for r in c.fetchall():
    tc = str(r[2])[:19] if r[2] else 'none'
    text = str(r[4]) if r[4] else ''
    # Filter for rule-like statements
    lower = text.lower()
    keywords = ['always', 'never', 'remember', 'rule', 'must', 'must not', 'do not', 
                'dont', "don't", 'should', 'should not', 'keep', 'remove', 'change',
                'replace', 'rename', 'delete', 'add', 'update', 'fix']
    # Also check for Persian equivalents
    persian_keywords = ['همیشه', 'هرگز', 'یاد', 'تغییر', 'حذف', 'اضافه', 'جایگزین']
    found = any(k in lower for k in keywords) or any(k in text for k in persian_keywords)
    if found and len(text) > 10:
        print(f"\n  [{tc}] {text[:300]}")

conn.close()
