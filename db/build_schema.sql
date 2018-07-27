CREATE TABLE IF NOT EXISTS users(
    user_id SERIAL PRIMARY KEY,
    auth_id VARCHAR(100),
    name VARCHAR(80),
    pic_url TEXT,
    bio TEXT
);

CREATE TABLE IF NOT EXISTS friends(
    friend_id SERIAL PRIMARY KEY,
    to_user INTEGER REFERENCES users(user_id),
    from_user INTEGER REFERENCES users(user_id),
    status VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS songs(
    song_id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    music_key VARCHAR(10),
    bpm VARCHAR(5),
    song_users INTEGER ARRAY
);

CREATE TABLE IF NOT EXISTS sections(
    section_id SERIAL PRIMARY KEY,
    song_id INTEGER REFERENCES songs(song_id) ON DELETE CASCADE,
    title VARCHAR(50),
    progression VARCHAR(30),
    lyrics JSON DEFAULT '[]'::JSON,
    uploads JSON NOT NULL DEFAULT '[]'::JSON
);