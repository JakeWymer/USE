UPDATE friends
set status = 'active'
WHERE friends_id = $1;