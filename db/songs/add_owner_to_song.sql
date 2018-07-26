UPDATE songs
SET song_users = array_append(song_users, $2)
WHERE song_id = $1;

SELECT * FROM songs
WHERE $2 = ANY(song_users);