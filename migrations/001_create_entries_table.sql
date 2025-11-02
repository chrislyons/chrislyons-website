-- Migration: Create entries table for infinite canvas blog
-- Created: 2025-11-02

CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK(type IN ('text', 'image', 'gif', 'quote')),
  content TEXT NOT NULL, -- JSON blob
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published INTEGER DEFAULT 0, -- SQLite uses 0/1 for boolean
  position_index INTEGER,
  metadata TEXT -- JSON for fonts, styles
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_created_at ON entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_published ON entries(published);
CREATE INDEX IF NOT EXISTS idx_position ON entries(position_index);

-- Insert a sample entry for testing
INSERT INTO entries (type, content, published, metadata) VALUES (
  'text',
  '{"text": "Welcome to the infinite canvas! This is your first entry.", "font": "Inter", "fontSize": "20px", "color": "#333333"}',
  1,
  '{"font": "Inter"}'
);
