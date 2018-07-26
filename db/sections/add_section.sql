INSERT INTO sections(song_id, title, progression)
VALUES($1, $2, $3);

SELECT * FROM sections
WHERE song_id = $1;