const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gameStatusOverlay = document.getElementById('game-status');
const statusText = document.getElementById('status-text');
const restartText = document.getElementById('restart-text');

let animationFrameId;
let isGameOver = false;

// Game settings
const playerSize = 20;
const enemySize = 25;
const playerSpeed = 3;
const enemySpeed = 1.5;

// Player state
const player = {
  x: 100,
  y: 100,
  width: playerSize,
  height: playerSize,
  color: '#6ec3ff',
};

// Enemy state
const enemy = {
  x: 600,
  y: 400,
  width: enemySize,
  height: enemySize,
  color: '#4a90e2',
};

// Keyboard input state
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

function resizeCanvas() {
  const container = document.querySelector('.game-container');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}

function drawRect(entity) {
  ctx.fillStyle = entity.color;
  ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
}

function updatePlayerPosition() {
  if (keys.ArrowUp) player.y -= playerSpeed;
  if (keys.ArrowDown) player.y += playerSpeed;
  if (keys.ArrowLeft) player.x -= playerSpeed;
  if (keys.ArrowRight) player.x += playerSpeed;

  // Keep player within canvas bounds
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

function updateEnemyPosition() {
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 0) {
    enemy.x += (dx / distance) * enemySpeed;
    enemy.y += (dy / distance) * enemySpeed;
  }
}

function checkCollision() {
  // Simple AABB collision detection
  return (
    player.x < enemy.x + enemy.width &&
    player.x + player.width > enemy.x &&
    player.y < enemy.y + enemy.height &&
    player.y + player.height > enemy.y
  );
}

function gameOver() {
  isGameOver = true;
  cancelAnimationFrame(animationFrameId);
  statusText.textContent = '捕まった';
  restartText.textContent = 'Rキーでリスタート';
  gameStatusOverlay.classList.add('visible');
}

function restartGame() {
  isGameOver = false;
  player.x = 100;
  player.y = 100;
  enemy.x = 600;
  enemy.y = 400;
  gameStatusOverlay.classList.remove('visible');
  gameLoop();
}

function gameLoop() {
  if (isGameOver) {
    return;
  }

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw player
  updatePlayerPosition();
  drawRect(player);

  // Update and draw enemy
  updateEnemyPosition();
  drawRect(enemy);

  // Check for collision
  if (checkCollision()) {
    gameOver();
    return;
  }

  animationFrameId = requestAnimationFrame(gameLoop);
}

function handleKeyDown(e) {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }
  if (isGameOver && e.key.toLowerCase() === 'r') {
    restartGame();
  }
}

function handleKeyUp(e) {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
}

function init() {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);

  gameLoop();
}

init();
