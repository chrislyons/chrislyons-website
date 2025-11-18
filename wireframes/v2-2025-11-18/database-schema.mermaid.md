%% Database Schema - D1 Database Structure
%% Entity Relationship Diagram for blog-db

erDiagram
    entries {
        INTEGER id PK "PRIMARY KEY AUTOINCREMENT"
        TEXT type "NOT NULL, CHECK(text|image|gif|quote)"
        TEXT content "NOT NULL, JSON blob"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
        DATETIME updated_at "DEFAULT CURRENT_TIMESTAMP"
        INTEGER published "DEFAULT 0 (boolean)"
        INTEGER position_index "Manual ordering"
        TEXT metadata "JSON for fonts, styles"
    }

    canvases {
        INTEGER id PK "PRIMARY KEY AUTOINCREMENT"
        TEXT title "Canvas title"
        TEXT background "NOT NULL, JSON background config"
        TEXT dimensions "NOT NULL, JSON canvas size"
        TEXT elements "NOT NULL, JSON array of elements"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
        DATETIME updated_at "DEFAULT CURRENT_TIMESTAMP"
        INTEGER published "DEFAULT 0 (boolean)"
        INTEGER position_index "Manual ordering"
    }

    entry_content_text {
        TEXT text "Main text content"
        TEXT font "Font family"
        TEXT fontSize "Font size"
        TEXT color "Text color"
    }

    entry_content_image {
        TEXT url "Image URL"
        TEXT alt "Alt text"
        TEXT caption "Image caption"
    }

    entry_content_gif {
        TEXT url "GIF URL"
        TEXT title "GIF title"
    }

    entry_content_quote {
        TEXT text "Quote text"
        TEXT author "Quote author"
    }

    entry_metadata {
        TEXT font "Font override"
        TEXT style "Style options"
    }

    canvas_background {
        TEXT type "solid|gradient|image"
        TEXT value "Color or URL"
    }

    canvas_dimensions {
        INTEGER width "Canvas width"
        INTEGER height "Canvas height"
    }

    canvas_element {
        TEXT id "Element ID (el-uuid)"
        TEXT type "text|image|gif|sticker"
        JSON content "Element-specific content"
        JSON position "x, y coordinates"
        JSON size "width, height"
        REAL rotation "Degrees"
        INTEGER zIndex "Layer order"
    }

    entries ||--|| entry_content_text : "type=text"
    entries ||--|| entry_content_image : "type=image"
    entries ||--|| entry_content_gif : "type=gif"
    entries ||--|| entry_content_quote : "type=quote"
    entries ||--o| entry_metadata : "metadata JSON"
    canvases ||--|| canvas_background : "background JSON"
    canvases ||--|| canvas_dimensions : "dimensions JSON"
    canvases ||--o{ canvas_element : "elements JSON array"
