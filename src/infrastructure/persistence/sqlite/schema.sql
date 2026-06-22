CREATE TABLE IF NOT EXISTS sign_terms (
    id TEXT PRIMARY KEY,
    word TEXT NOT NULL,
    category TEXT,
    description TEXT,
    hand_shape TEXT,
    movement TEXT,
    image_url TEXT,
    video_url TEXT,
    source TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sign_terms_word ON sign_terms(word);

-- Full-text search virtual table (FTS5)
CREATE VIRTUAL TABLE IF NOT EXISTS sign_terms_fts USING fts5(
    word,
    description,
    category,
    content='sign_terms',
    content_rowid='rowid',
    tokenize='unicode61'
);

-- Triggers to keep FTS index in sync
CREATE TRIGGER IF NOT EXISTS sign_terms_ai AFTER INSERT ON sign_terms BEGIN
    INSERT INTO sign_terms_fts(rowid, word, description, category)
    VALUES (new.rowid, new.word, new.description, new.category);
END;

CREATE TRIGGER IF NOT EXISTS sign_terms_ad AFTER DELETE ON sign_terms BEGIN
    INSERT INTO sign_terms_fts(sign_terms_fts, rowid, word, description, category)
    VALUES ('delete', old.rowid, old.word, old.description, old.category);
END;

CREATE TRIGGER IF NOT EXISTS sign_terms_au AFTER UPDATE ON sign_terms BEGIN
    INSERT INTO sign_terms_fts(sign_terms_fts, rowid, word, description, category)
    VALUES ('delete', old.rowid, old.word, old.description, old.category);
    INSERT INTO sign_terms_fts(rowid, word, description, category)
    VALUES (new.rowid, new.word, new.description, new.category);
END;
