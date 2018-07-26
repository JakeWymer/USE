UPDATE songs
SET song_users = array_append(song_users, $2)
WHERE song_id = $1;

SELECT songs.*, array_agg(json_build_array(users.*)) AS collaborators FROM songs
JOIN users 
ON users.user_id = ANY(songs.song_users)
WHERE $2 = ANY(song_users)
GROUP BY songs.song_id;