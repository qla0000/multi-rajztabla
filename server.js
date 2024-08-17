const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let drawHistory = [];
let activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('Egy felhasználó csatlakozott');
  
  
  socket.on('disconnect', () => {
    console.log('Egy felhasználó lecsatlakozott');
  });

  // Elküldi a rajzot az új kliensnek
  socket.emit('drawHistory', drawHistory);

  // Generáljunk egy egyedi azonosítót a kliensnek
  const userId = Math.random().toString(36).substr(2, 9);
  socket.emit('userId', userId);

  // Rajzolási esemény kezelése
  socket.on('draw', (data) => {
    drawHistory.push(data);
    socket.broadcast.emit('draw', data);
  });

  // Töröli a vásznat
  socket.on('clearCanvas', () => {
    socket.broadcast.emit('clearCanvas');
  });

  // Aktív felhasználók frissítése
  socket.on('userActive', (data) => {
    activeUsers.set(data.userId, { username: data.username, color: data.color });
    io.emit('updateActiveUsers', Array.from(activeUsers.values()));
  });

  socket.on('disconnect', () => {
    activeUsers.delete(socket.id);
    io.emit('updateActiveUsers', Array.from(activeUsers.values()));
  });
});

// Szerver indítása
const PORT = process.env.PORT || 3000;
http.listen(PORT, () =>  console.log(`Szerver fut a ${PORT} porton`));

// Felhasználói regisztráció kezelése
const User = require('../multi_rajztabla/models/user'); ///itt lehet hibás 
const bcrypt = require('bcrypt');

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Ellenőrizzük, hogy a felhasználónév vagy email már létezik-e
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'A felhasználónév vagy email már foglalt' });
    }

    // Jelszó titkosítása
    const hashedPassword = await bcrypt.hash(password, 10);

    // Új felhasználó létrehozása
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // Felhasználó mentése az adatbázisba
    await newUser.save();

    res.status(201).json({ message: 'Sikeres regisztráció' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba történt' });
  }
});

// MongoDB kapcsolat beállítása
const mongoose = require('mongoose');
let connectionString = 'mongodb://localhost:27017/users';
mongoose.connect(connectionString).then(() => console.log('Sikeresen csatlakozva a MongoDB-hez'))
.catch(err => console.error('MongoDB kapcsolódási hiba:', err));

//body parser middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Felhasználói bejelentkezés kezelése
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Felhasználó keresése az adatbázisban
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(400).json({ message: 'Hibás felhasználónév vagy jelszó' });
    }
    
    // Jelszó ellenőrzése
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Hibás felhasználónév vagy jelszó' });
    }
    
    // Sikeres bejelentkezés
    res.json({ message: 'Sikeres bejelentkezés', userId: user._id, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba történt' });
  }
});