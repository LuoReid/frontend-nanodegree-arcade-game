let gameStatus = 1; //游戏状态0：停止，1进行，2暂停；
const speeds = [50, 150, 250, 350, 500, 650, 800, 850]; //添加敌人的速度等级
// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.x = 0;
  this.y = 83 * (Math.ceil(Math.random() * 3));
  this.speed = speeds[Math.floor(Math.random() * 8)];
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  if (gameStatus !== 1) return;
  this.x += dt * this.speed;
  if (this.x > 5 * 101) { //当敌人跑出区域后，重置起始位置和速度等级
    this.x = -5 * 101;
    this.y = 83 * (Math.ceil(Math.random() * 3));
    this.speed = speeds[Math.floor(Math.random() * 8)];
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//碰撞检测
Enemy.prototype.checkCollision = function(player) {
  if (player.y !== this.y) return false;
  return Math.abs(player.x - this.x) <= 101 / 2;
}

//定义玩家头像
const heads = ['boy', 'cat-girl', 'horn-girl', 'pink-girl', 'princess-girl'];
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.sprite = `images/char-${ heads[Math.floor(Math.random() * 5)]}.png`;
  this.x = 101 * 2;
  this.y = 83 * 5;
  this.medal = "";
}
Player.prototype.update = function(key) {
  if (gameStatus !== 1) return;
  //当碰撞或者到达安全地带，暂停2秒，重置玩家
  if (this.y < 83 || this.checkCollisions(allEnemies)) {
    gameStatus = 0;
    this.medal = this.y < 83 ? "大吉大利，今晚吃鸡！" : "再接再厉，下局吃鸡！";
    setTimeout(function() {
      player = new Player();
      gameStatus = 1;
    }, 2000);
  }
}
Player.prototype.checkCollisions = function(enemies) {
  return enemies.some(e => e.checkCollision(player));
}
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Player.prototype.handleInput = function(keyCode) {
  if (gameStatus !== 1) return;
  switch (keyCode) {
    case 'left':
      this.x -= 101;
      if (this.x < 0) this.x = 101 * 4;
      break;
    case 'right':
      this.x += 101;
      if (this.x > 101 * 4) this.x = 0;
      break;
    case 'up':
      this.y -= 83;
      break;
    case 'down':
      this.y += 83;
      if (this.y > 83 * 6) this.y = 83 * 4;
      break;
  }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy()];
let player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});