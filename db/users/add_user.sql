INSERT INTO users(auth_id, name, pic_url)
VALUES($1, $2, $3) RETURNING *;