module.exports = (app, http) => {
  const io = require('socket.io')(http);

  io.on('connection', function(socket){
    socket.on('join', room => {
      console.log(`JOINED ROOM ${room}`);
      socket.join(room);
    });

    socket.on('message', data => {
      socket.broadcast.to(data.chatId).emit('message-received', data);

      app.get('db').messages.add_message([data.body, data.chatId, data.user_id])
        .then(()=> console.log('created message'))
        .catch(err => console.log(err));
    });
  });

  app.get('/api/messages/:chat_id', (req, res) => {
    app.get('db').messages.get_messages(req.params.chat_id)
      .then(messages => res.send(messages))
      .catch(err => res.send(err));
  });
}