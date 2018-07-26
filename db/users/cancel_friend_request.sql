DELETE from friends
WHERE friend_id = $2;

SELECT * FROM friends
JOIN users ON user_id = friends.from_user 
WHERE to_user = $1
UNION
SELECT * FROM friends
JOIN users ON user_id = friends.to_user
WHERE from_user = $1;