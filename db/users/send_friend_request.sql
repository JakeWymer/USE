INSERT INTO friends(to_user, from_user, status)
VALUES($1, $2, $3);

SELECT * FROM friends
JOIN users ON user_id = friends.from_user 
WHERE to_user = $2
UNION
SELECT * FROM friends
JOIN users ON user_id = friends.to_user
WHERE from_user = $2