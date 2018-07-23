SELECT collaborators.*, users.* FROM collaborators
JOIN users
ON users.users_id = collaborators.users_id
WHERE collaborators.songs_id = $1;