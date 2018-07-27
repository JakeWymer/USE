INSERT INTO users(auth_id, name, pic_url, bio)
VALUES($1, $2, $3, $4)
RETURNING *;