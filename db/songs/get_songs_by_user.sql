SELECT songs.*, array_agg(json_build_array(users.*)) AS collaborators FROM songs
JOIN users 
ON users.user_id = ANY(songs.song_users)
WHERE $1 = ANY(song_users)
GROUP BY songs.song_id;