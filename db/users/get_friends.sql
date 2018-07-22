SELECT users.*, friends.friends_id,friends.status, friends.user_two_id FROM friends 
JOIN users ON users.users_id = friends.user_one_id
WHERE user_two_id = $1
UNION
SELECT users.*, friends.friends_id, friends.status, friends.user_two_id FROM friends 
JOIN users ON users.users_id = friends.user_two_id
WHERE user_one_id = $1