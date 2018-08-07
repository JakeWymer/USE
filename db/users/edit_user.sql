UPDATE users
SET name = $1, bio = $2
WHERE user_id = $3;