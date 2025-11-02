-- Canvas Blog Schema
-- Supports Instagram Stories-style visual canvas entries with positioned elements

CREATE TABLE IF NOT EXISTS canvases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  background TEXT NOT NULL DEFAULT '{"type":"solid","value":"#ffffff"}', -- JSON: background config
  dimensions TEXT NOT NULL DEFAULT '{"width":1080,"height":1920}', -- JSON: canvas size (default: Stories)
  elements TEXT NOT NULL DEFAULT '[]', -- JSON array of positioned elements
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published INTEGER DEFAULT 0,
  position_index INTEGER -- For manual ordering
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_canvases_published ON canvases(published);
CREATE INDEX IF NOT EXISTS idx_canvases_created ON canvases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_canvases_position ON canvases(position_index);

-- Element structure (stored in elements JSON array):
-- {
--   id: 'el-{uuid}',
--   type: 'text' | 'image' | 'gif' | 'sticker',
--   content: {
--     text?: string,
--     font?: string,
--     fontSize?: number,
--     color?: string,
--     url?: string,
--     emoji?: string
--   },
--   position: { x: number, y: number },
--   size: { width: number, height: number | 'auto' },
--   rotation: number, -- degrees
--   zIndex: number
-- }

-- Background types:
-- { type: 'solid', value: '#ffffff' }
-- { type: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
-- { type: 'image', value: '/images/bg-123.jpg' }

-- Canvas dimension presets:
-- { width: 1080, height: 1920 }  -- Stories (9:16 portrait)
-- { width: 1080, height: 1080 }  -- Square (1:1)
-- { width: 1440, height: 810 }   -- Desktop (16:9 widescreen)
