DELETE FROM sections
WHERE section_id = $1;

SELECT * FROM sections
WHERE song_id = $2;