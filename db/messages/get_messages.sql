SELECT * FROM 
(
    SELECT * FROM messages
    WHERE friend_id = $1
    ORDER BY message_id DESC
    LIMIT 10
) t1 ORDER BY t1.message_id