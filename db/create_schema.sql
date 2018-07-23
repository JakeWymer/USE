CREATE TABLE IF NOT EXISTS users(
    users_id SERIAL PRIMARY KEY,
    auth_id TEXT,
    name VARCHAR(60),
    pic_url TEXT
);

CREATE TABLE IF NOT EXISTS friends(
    friends_id SERIAL PRIMARY KEY,
    user_one_id INTEGER REFERENCES users(users_id),
    user_two_id INTEGER REFERENCES users(users_id),
    status VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS songs(
    songs_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(users_id),
    title VARCHAR(50),
    music_key VARCHAR(5),
    bpm INTEGER
);

CREATE TABLE IF NOT EXISTS collaborators(
    collaborators_id SERIAL PRIMARY KEY,
    songs_id INTEGER REFERENCES songs(songs_id),
    users_id INTEGER REFERENCES users(users_id)
);

CREATE TABLE IF NOT EXISTS sections(
    sections_id SERIAL PRIMARY KEY,
    songs_id INTEGER REFERENCES songs(songs_id),
    section_name VARCHAR(50),
    progression VARCHAR(50)
);