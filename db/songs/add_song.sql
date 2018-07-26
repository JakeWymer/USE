INSERT INTO songs(title, music_key, bpm)
VALUES($1, $2, $3) RETURNING song_id;