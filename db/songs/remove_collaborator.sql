DELETE FROM collaborators
WHERE songs_id = $1 AND users_id = $2;