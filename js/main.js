function SnakeHeadSprite(callback) {
  this.canvasU = document.createElement('canvas');
  this.canvasD = document.createElement('canvas');
  this.canvasL = document.createElement('canvas');
  this.canvasR = document.createElement('canvas');

  if(this.canvasR.getContext && this.canvasU.getContext && this.canvasD.getContext && this.canvasL.getContext) {
    var ctxU = this.canvasU.getContext('2d');
    var ctxD = this.canvasD.getContext('2d');
    var ctxL = this.canvasL.getContext('2d');
    var ctxR = this.canvasR.getContext('2d');
  }

  var snakeHead = new Image();
  
  snakeHead.addEventListener('load', function() {
    ctxU.drawImage(snakeHead, 0, 0);
    
    //other heads
    ctxR.rotate(90*Math.PI/180);
    ctxR.translate(0, -54);
    ctxR.drawImage(snakeHead, 0, 0);
    
    ctxL.rotate(90*Math.PI*(-1)/180);
    ctxL.translate(-54, 0);
    ctxL.drawImage(snakeHead, 0, 0);
    
    ctxD.rotate(180*Math.PI/180);
    ctxD.translate(-54, -54);
    ctxD.drawImage(snakeHead, 0, 0);
    
    //start game
    callback();
  })

  snakeHead.src = 'img/snake-head.jpg';  
}

SnakeHeadSprite.prototype.getSpriteLeft = function() {
  return this.canvasL;
}

SnakeHeadSprite.prototype.getSpriteRight = function() {
  return this.canvasR;
}

SnakeHeadSprite.prototype.getSpriteUp = function() {
  return this.canvasU;
}

SnakeHeadSprite.prototype.getSpriteDown = function() {
  return this.canvasD;
}

function GameField() {
  this.canvas = document.getElementById('snake-game');
  if (this.canvas.getContext) {
    this.ctx = this.canvas.getContext('2d');
  }
  const field = document.getElementById('field');
  this.size = this.canvas.getAttribute('width');
  this.lastCell = null;

  //adjustments for drawing image in the center of cell and for avoiding clean the border of cells
  this.ADJUST_MOVE = 2;
  this.ADJUST_DRAW = 3;
  this.ADJUST_CLEAN_AREA = 4;
  this.FOOD_SIZE = 54;
  this.STEP = 60;  
}

GameField.prototype.drawField = function() {
  this.ctx.beginPath();

  //draw a field
  for ( var i = 0; i <= this.size; i += this.STEP ) {
    this.ctx.moveTo(i, 0);
    this.ctx.lineTo(i, this.size);
    this.ctx.stroke();
  }

  for ( var i = 0; i <= this.size; i += this.STEP ) {
    this.ctx.moveTo(0, i);
    this.ctx.lineTo(this.size, i);
    this.ctx.stroke();
  }

  this.ctx.closePath();
}

GameField.prototype.drawFood = function(food) {
  this.ctx.fillStyle = food.color;
  var x = this.coordToPx(food.x);
  var y = this.coordToPx(food.y);
  this.ctx.fillRect(x, y, this.FOOD_SIZE, this.FOOD_SIZE)
}

GameField.prototype.drawSnake = function(snake) {
  if(this.lastCell) {
    this.ctx.clearRect(this.coordToPx(this.lastCell.x), this.coordToPx(this.lastCell.y), this.STEP - this.ADJUST_CLEAN_AREA, this.STEP - this.ADJUST_CLEAN_AREA);
  }

  var head = snake.getHead();
  var body = snake.getBody();  
  this.ctx.drawImage(snake.headSprite, this.coordToPx(head.x), this.coordToPx(head.y));
  this.ctx.fillStyle = "yellowgreen";
  for(let i = 0; i < body.length; i++) {
    this.ctx.fillRect(this.coordToPx(body[i].x), this.coordToPx(body[i].y), this.FOOD_SIZE, this.FOOD_SIZE);
  }

  this.lastCell = body[body.length - 1];
}

GameField.prototype.drawLoseGameScreen = function(score) {
  this.ctx.clearRect(0, 0, this.size, this.size);
  this.ctx.font = "30px Arial";
  this.ctx.fillText("You lose", 250, 300);
  this.ctx.fillText("Your score: " + score, 225, 350);
}

GameField.prototype.coordToPx = function(coord) {
  return coord * this.STEP - this.STEP + this.ADJUST_DRAW;;
}

function Food(color) {
  this.color = color;
  this.x = 0;
  this.y = 0;
}

function Snake(direction, body) {
  this.setDirection(direction);
  this.body = body;
}

Snake.prototype.getHead = function() {
  return this.body[0];
}

Snake.prototype.getBody = function() {
  return this.body.slice(1);
}

Snake.prototype.move = function(coefficient, food) {
  let coefficientX, coefficientY;

  if (this.direction === "u" || this.direction === "d") {
    coefficientY = coefficient;
    coefficientX = 0;
  } else {
    coefficientY = 0;
    coefficientX = coefficient;
  }
  
  let oldHead = this.getHead();
  let head = { x: oldHead.x + coefficientX, y: oldHead.y + coefficientY };
  this.body.unshift(head);

  if(!this.hasEaten(food)) {
    this.body.pop();
  }
}

Snake.prototype.setDirection = function(direction) {
  if(direction === "l" && this.direction !== "r") {
    this.direction = "l";
    this.headSprite = snakeHeadSprite.getSpriteLeft();
  }
  if(direction === "u" && this.direction !== "d") {
    this.direction = "u";
    this.headSprite = snakeHeadSprite.getSpriteUp();
  }
  if(direction === "r" && this.direction !== "l") {
    this.direction = "r";
    this.headSprite = snakeHeadSprite.getSpriteRight();
  }
  if(direction === "d" && this.direction !== "u") {
    this.direction = "d";
    this.headSprite = snakeHeadSprite.getSpriteDown();
  }
}

Snake.prototype.hasEaten = function(food) {
  let head = this.getHead();
  return food.y === head.y && food.x === head.x;
}

const snakeHeadSprite = new SnakeHeadSprite(goSnake);
const food = new Food('#d26902');
let snake = new Snake("u", [
  {x: 6, y: 9},
  {x: 6, y: 10}, 
  {x: 6, y: 11},   
]);


const gameField = new GameField();
gameField.drawField();
drawFood();

const count = document.getElementById('counter');
let counter = 0;
let coefficient;
let queue = [];

function keyDownHandler(e) {
  switch(e.keyCode) {
    case 37:
      if(queue[0] !== 'l') {
        queue.push('l');
      }
      break;
    case 38:
      if(queue[0] !== 'u') {
        queue.push('u');
      }
      break;
    case 39:
      if(queue[0] !== 'r') {
        queue.push('r');
      }
      break;
    case 40:
      if(queue[0] !== 'd') {
        queue.push('d');
      }
      break;
    default:
      pause();
      break;
  }
};

addEventListener("keydown", keyDownHandler);

function move(coefficient) {
  snake.move(coefficient, food);
  let head = snake.getHead();
  let body = snake.getBody();  
  
  // check if not outside the field
  if (head.x < 1 || head.y < 1 || head.x > 10 || head.y > 10) {
    loseGame();
    return;
  }

  // check if not running into itself
  for (let part of body) {
    if (head.x === part.x && head.y === part.y) {
      loseGame();
      return;
    }
  }

  if (snake.hasEaten(food)) {
    counter++;
    count.innerHTML = counter;
    drawFood();
  }

  gameField.drawSnake(snake);
}

function drawFood() {
  let occupiedCell = 0;

  while(occupiedCell === 0) {
    food.x = getRandom();
    food.y = getRandom();   
    occupiedCell = 1;
    for (var coordinates of snake.body) {
      if (food.x === coordinates.x && food.y === coordinates.y) {
        occupiedCell = 0;
      }
    }
  }
  
  gameField.drawFood(food);
}

function getRandom() {
  return Math.ceil(Math.random() * 10);
}

let moveInterval;

function goSnake() {
  moveInterval = setInterval(function() {
    if(queue.length !== 0) {
      snake.setDirection(queue[0]);
      queue.shift();
    }

    if (snake.direction === "u" || snake.direction === "l") {
      coefficient = -1;
      move(coefficient);
    } 
    if (snake.direction === "d" || snake.direction === "r") {
      coefficient = 1;
      move(coefficient);
    };
  }, 300);
}


let paused = 0;
let pauseText = document.createElement('span');
pauseText.classList.add("pause");
pauseText.innerHTML = "Pause";

function pause() {
  if(paused === 0) {
    field.insertBefore(pauseText, count);
    clearInterval(moveInterval);
    paused = 1;
  } else {
    field.removeChild(pauseText);
    goSnake();
    paused = 0;
  }
}

function loseGame() {
  field.removeChild(count);
  clearInterval(moveInterval);
  removeEventListener("keydown", keyDownHandler);
  gameField.drawLoseGameScreen(counter);
  return;
}
