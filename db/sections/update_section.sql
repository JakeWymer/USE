UPDATE sections
SET title = $1, progression = $2, lyrics = $3, uploads = $4
WHERE section_id = $5
RETURNING *;