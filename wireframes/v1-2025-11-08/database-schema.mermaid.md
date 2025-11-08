%% Database Schema - Chris Lyons Website
%% Generated: 2025-11-08
%% Cloudflare D1 (SQLite) database structure for blog entries and canvases

erDiagram
    entries ||--o{ entry_types : "has type"
    entries {
        INTEGER id PK "PRIMARY KEY AUTOINCREMENT"
        TEXT type "CHECK(type IN ('text', 'image', 'gif', 'quote'))"
        TEXT content "JSON blob - entry content"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
        DATETIME updated_at "DEFAULT CURRENT_TIMESTAMP"
        INTEGER published "0 or 1 (SQLite boolean)"
        INTEGER position_index "Manual ordering"
        TEXT metadata "JSON blob - fonts, styles"
    }

    entry_types {
        TEXT type "Entry type identifier"
        TEXT description "Type description"
    }

    canvases {
        INTEGER id PK "PRIMARY KEY AUTOINCREMENT"
        TEXT title "Canvas title (optional)"
        TEXT background "JSON - background config"
        TEXT dimensions "JSON - canvas size"
        TEXT elements "JSON array - positioned elements"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
        DATETIME updated_at "DEFAULT CURRENT_TIMESTAMP"
        INTEGER published "0 or 1 (SQLite boolean)"
        INTEGER position_index "Manual ordering"
    }
