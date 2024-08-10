const socket = io();
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;

function startDrawing(e) {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];

  socket.emit('draw', {
    x0: lastX,
    y0: lastY,
    x1: e.offsetX,
    y1: e.offsetY
  });
}

function stopDrawing() {
  isDrawing = false;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

socket.on('draw', (data) => {
  ctx.beginPath();
  ctx.moveTo(data.x0, data.y0);
  ctx.lineTo(data.x1, data.y1);
  ctx.stroke();
});