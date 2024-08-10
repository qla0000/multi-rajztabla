const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Egy felhasználó csatlakozott');
  
  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Szerver fut a ${PORT} porton`));