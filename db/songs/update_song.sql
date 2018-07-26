UPDATE songs
SET title = $2, music_key = $3, bpm = $4
WHERE song_id = $1
RETURNING *;