UPDATE songs 
SET song_users = array_remove(song_users, $2)
WHERE song_id = $1 RETURNING *;