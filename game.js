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

// Game State
const gameState = {
  hasKey: false,
  alliesRescued: 0,
};

// Key Item
const keyItem = {
  x: 700,
  y: 500,
  width: 15,
  height: 15,
  color: '#ffd700', // Gold
  visible: true,
};

// Exit Door
const exitDoor = {
  x: canvas.width - 10, // Adjusted to be part of the wall
  y: canvas.height / 2 - 25,
  width: 10,
  height: 50,
  color: '#228b22', // ForestGreen
};

// Allies
const allies = [
  { x: 50, y: 500, width: 20, height: 20, color: '#ff69b4', visible: true }, // HotPink
  { x: 750, y: 50, width: 20, height: 20, color: '#ff69b4', visible: true },
];

// Obstacles (Walls)
const walls = [
  // Outer walls
  { x: 0, y: 0, width: canvas.width, height: 10 },
  { x: 0, y: canvas.height - 10, width: canvas.width, height: 10 },
  { x: 0, y: 0, width: 10, height: canvas.height },
  { x: canvas.width - 10, y: 0, width: 10, height: canvas.height },
  // Inner walls
  { x: 150, y: 100, width: 20, height: 200 },
  { x: 300, y: canvas.height - 250, width: 20, height: 200 },
  { x: 450, y: 100, width: 20, height: 200 },
  { x: 250, y: 200, width: 150, height: 20 },
];

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
  w: false,
  a: false,
  s: false,
  d: false,
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
  if (keys.ArrowUp || keys.w) player.y -= playerSpeed;
  if (keys.ArrowDown || keys.s) player.y += playerSpeed;
  if (keys.ArrowLeft || keys.a) player.x -= playerSpeed;
  if (keys.ArrowRight || keys.d) player.x += playerSpeed;

  // Keep player within canvas bounds
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

  // Check for wall collisions
  walls.forEach(wall => {
    if (checkCollision(player, wall)) {
      // On collision, move player back to previous position
      player.x = prevX;
      player.y = prevY;
    }
  });
}

function updateEnemyPosition() {
  const prevX = enemy.x;
  const prevY = enemy.y;

  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 0) {
    enemy.x += (dx / distance) * enemySpeed;
    enemy.y += (dy / distance) * enemySpeed;
  }

  // Check for wall collisions
  walls.forEach(wall => {
    if (checkCollision(enemy, wall)) {
      enemy.x = prevX;
      enemy.y = prevY;
    }
  });
}

function checkCollision(rect1, rect2) {
  // Simple AABB collision detection
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function showStatus(mainText, subText) {
  isGameOver = true;
  cancelAnimationFrame(animationFrameId);
  statusText.textContent = mainText;
  restartText.textContent = subText;
  gameStatusOverlay.classList.add('visible');
}

function getEnding() {
  if (gameState.alliesRescued === allies.length) {
    return {
      title: 'トゥルーエンド',
      subtitle: '全員で脱出！',
    };
  }
  return {
    title: 'ノーマルエンド',
    subtitle: '一人だけの生還...',
  };
}

function gameWin() {
  const ending = getEnding();
  showStatus(ending.title, `${ending.subtitle} (Rキーでリスタート)`);
}

function gameOver() {
  showStatus('捕まった', 'Rキーでリスタート');
}

function restartGame() {
  isGameOver = false;
  gameState.hasKey = false;
  gameState.alliesRescued = 0;
  keyItem.visible = true;
  allies.forEach(ally => (ally.visible = true));

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

  // Draw walls
  walls.forEach(wall => {
    drawRect({ ...wall, color: '#8b4513' }); // SaddleBrown
  });

  // Draw allies
  allies.forEach(ally => {
    if (ally.visible) {
      drawRect(ally);
      if (checkCollision(player, ally)) {
        ally.visible = false;
        gameState.alliesRescued++;
      }
    }
  });

  // Draw key
  if (keyItem.visible) {
    drawRect(keyItem);
    // Check for key collection
    if (checkCollision(player, keyItem)) {
      keyItem.visible = false;
      gameState.hasKey = true;
    }
  }

  // Draw exit door
  // Change color if player has the key
  exitDoor.color = gameState.hasKey ? '#7cfc00' : '#228b22';
  drawRect(exitDoor);

  // Check for collision
  if (checkCollision(player, enemy)) {
    gameOver();
    return;
  }

  // Check for win condition
  if (gameState.hasKey && checkCollision(player, exitDoor)) {
    gameWin();
    return;
  }

  animationFrameId = requestAnimationFrame(gameLoop);
}

function handleKeyDown(e) {
  const key = e.key.toLowerCase();
  if (keys.hasOwnProperty(key)) {
    keys[key] = true;
  }
  if (isGameOver && key === 'r') {
    restartGame();
  }
}

function handleKeyUp(e) {
  const key = e.key.toLowerCase();
  if (keys.hasOwnProperty(key)) {
    keys[key] = false;
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
