const socket = io('http://localhost:3000');
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clearButton');

clearButton.addEventListener('click', clearCanvas);

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  socket.emit('clearCanvas');
}

socket.on('clearCanvas', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let userId = null;
let currentColor = '#000000';
let currentLineWidth = 2;

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth - 20;
  canvas.height = window.innerHeight - 20;
});


function startDrawing(e) {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = currentLineWidth;
  ctx.stroke();
  
  const drawData = {
    userId: userId,
    x0: lastX,
    y0: lastY,
    x1: e.offsetX,
    y1: e.offsetY,
    color: currentColor,
    lineWidth: currentLineWidth
  };
  
  socket.emit('draw', drawData);
  
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
  isDrawing = false;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

socket.on('userId', (id) => {
  userId = id;
});

socket.on('draw', (data) => {
  ctx.beginPath();
  ctx.moveTo(data.x0, data.y0);
  ctx.lineTo(data.x1, data.y1);
  ctx.strokeStyle = data.color;
  ctx.lineWidth = data.lineWidth;
  ctx.stroke();
});

socket.on('drawHistory', (history) => {
  history.forEach(data => {
    ctx.beginPath();
    ctx.moveTo(data.x0, data.y0);
    ctx.lineTo(data.x1, data.y1);
    ctx.strokeStyle = data.userId === userId ? currentColor : '#FF0000';
    ctx.lineWidth = data.lineWidth;
    ctx.stroke();
  });
});

// Színválasztó és vonalvastagság állító funkciók hozzáadása
const colorPicker = document.getElementById('colorPicker');
const lineWidthInput = document.getElementById('lineWidth');

colorPicker.addEventListener('change', (e) => {
  currentColor = e.target.value;
});

lineWidthInput.addEventListener('change', (e) => {
  currentLineWidth = e.target.value;
});

//Üdvözlő üzenet megjelenítése
function displayWelcomeMessage() {
  const username = localStorage.getItem('username');
  if (username) {
    const welcomeDiv = document.getElementById('welcomeMessage');
    welcomeDiv.textContent = `Üdvözöljük ${username}!`;
  }
}

// Hívd meg ezt a függvényt az oldal betöltésekor
displayWelcomeMessage();

// Aktív felhasználók frissítése
const activeUsersList = document.getElementById('activeUsersList');

socket.on('connect', () => {
  const username = localStorage.getItem('username');
  socket.emit('userActive', { userId: socket.id, username, color: currentColor });
});

socket.on('updateActiveUsers', (users) => {
  activeUsersList.innerHTML = '';
  users.forEach(user => {
    const userDiv = document.createElement('div');
    userDiv.textContent = user.username;
    userDiv.style.color = user.color;
    activeUsersList.appendChild(userDiv);
  });
});

//Active userek színválasztásának eseménykezelése a használt szín alapján
colorPicker.addEventListener('change', (e) => {
  currentColor = e.target.value;
  socket.emit('userActive', { userId: socket.id, username: localStorage.getItem('username'), color: currentColor });
});