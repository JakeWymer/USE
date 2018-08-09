SELECT * FROM sections
WHERE song_id = $1
ORDER BY section_id;