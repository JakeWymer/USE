CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    auth_id TEXT,
    name VARCHAR(60),
    pic_url TEXT
);