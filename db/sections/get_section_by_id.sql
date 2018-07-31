SELECT sections.*, songs.song_users FROM sections
JOIN songs ON songs.song_id = sections.song_id
WHERE section_id = $1;