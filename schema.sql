CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  share_url TEXT NOT NULL,
  source_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '其他',
  tags TEXT NOT NULL DEFAULT '',
  license_note TEXT NOT NULL,
  submitter TEXT NOT NULL DEFAULT '匿名',
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_resources_status_created ON resources(status, created_at DESC);
