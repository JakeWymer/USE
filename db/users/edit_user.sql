UPDATE users
SET name = $1, bio = $2, pic_url = $3
WHERE user_id = $4;