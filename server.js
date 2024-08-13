const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let drawHistory = [];

io.on('connection', (socket) => {
  console.log('Egy felhasználó csatlakozott');
  
  socket.on('disconnect', () => {
    console.log('Egy felhasználó lecsatlakozott');
  });

  // Elküldi a rajzot
  socket.emit('drawHistory', drawHistory);

  // Generáljunk egy egyedi azonosítót a kliensnek
  const userId = Math.random().toString(36).substr(2, 9);
  socket.emit('userId', userId);

  socket.on('draw', (data) => {
    drawHistory.push(data);
    socket.broadcast.emit('draw', data);
  });

  // Töröli a vásznat
  socket.on('clearCanvas', () => {
    socket.broadcast.emit('clearCanvas');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () =>  console.log(`Szerver fut a ${PORT} porton`));


