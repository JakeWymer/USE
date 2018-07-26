UPDATE songs
SET song_users = array_append(song_users, $2)
WHERE song_id = $1
RETURNING *;