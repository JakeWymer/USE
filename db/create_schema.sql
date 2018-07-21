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