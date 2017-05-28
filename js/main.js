function SnakeHeadSpite(callback) {
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

SnakeHeadSpite.prototype.getSpriteLeft = function() {
  return this.canvasL;
}

SnakeHeadSpite.prototype.getSpriteRight = function() {
  return this.canvasR;
}

SnakeHeadSpite.prototype.getSpriteUp = function() {
  return this.canvasU;
}

SnakeHeadSpite.prototype.getSpriteDown = function() {
  return this.canvasD;
}

const snakeHeadSprite = new SnakeHeadSpite(goSnake);

const canvas = document.getElementById('snake-game');
const field = document.getElementById('field');
const count = document.getElementById('counter');

const step = 60;
let size = canvas.getAttribute("width");
let counter = 0;

if (canvas.getContext) {
  var ctx = canvas.getContext('2d');
 }


//adjustments for drawing image in the center of cell and for avoiding clean the border of cells
const adjustMove = 2,
      adjustDraw = 3,
      adjustCleanArea = 4;

ctx.beginPath();

//draw a field
for ( var i = 0; i <= size; i+=60 ) {
  ctx.moveTo(i, 0);
  ctx.lineTo(i, size);
  ctx.stroke();
}

for ( var i = 0; i <= size; i+=60 ) {
  ctx.moveTo(0, i);
  ctx.lineTo(size, i);
  ctx.stroke();
}

ctx.closePath();

let snake = {
  currHead: snakeHeadSprite.getSpriteUp(),
  direction: "u",
  body: [ 
    {x: 5, y: 8},
    {x: 5, y: 9}, 
    {x: 5, y: 10},
  ],
}

let el = {
  body: [ 
    {x: getRandom(), y: getRandom()} 
  ],
  color: "#d26902"
}

let elPx = fromCellsToPx(el.body);;

ctx.fillStyle = el.color;
ctx.fillRect( elPx[0].x + adjustDraw, elPx[0].y + adjustDraw, 54, 54 );

function fromCellsToPx(body) {
  var bodyPixels = [];
  for (var i = 0; i < body.length; i++) {
    bodyPixels[i] = {
      x: body[i].x * step,
      y: body[i].y * step
    }
  }
  return bodyPixels;
}

let snakebodyPx, coefficient, circle, dotsBody;
let queue = [];

function changeDir(direction) {
  if(direction === 'l' && snake.direction !== "r") {
    snake.direction = "l";
    snake.currHead = snakeHeadSprite.getSpriteLeft();
  }
  if(direction === 'u' && snake.direction !== "d") {
    snake.direction = "u";
    snake.currHead = snakeHeadSprite.getSpriteUp();
  }
  if(direction === 'r' && snake.direction !== "l") {
    snake.direction = "r";
    snake.currHead = snakeHeadSprite.getSpriteRight();
  }
  if(direction === 'd' && snake.direction !== "u") {
    snake.direction = "d";
    snake.currHead = snakeHeadSprite.getSpriteDown();
  }
}

addEventListener("keydown", function (e) {
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
});


function move(coefficient) {
  if (snake.direction === "u" || snake.direction === "d") {
    var coefficientY = coefficient;
    var coefficientX = 0;
  } else {
    var coefficientY = 0;
    var coefficientX = coefficient;
  }

  snakebodyPx = fromCellsToPx(snake.body);
  
    
  var lastElToPx = fromCellsToPx(snake.body)[snake.body.length-1];
  
  ctx.clearRect(lastElToPx.x + adjustMove, lastElToPx.y + adjustMove, step - adjustCleanArea, step - adjustCleanArea);
  
  snake.body.unshift({x: snake.body[0].x + coefficientX, y: snake.body[0].y + coefficientY});
  
  if (el.body[0].y === snake.body[0].y && el.body[0].x === snake.body[0].x) {
    counter++;
    count.innerHTML = counter;
    drawFood();
  } else {
    snake.body.pop();
  }
  
  snakebodyPx = fromCellsToPx(snake.body);

  if (snake.body[0].x < 0 || snake.body[0].y < 0 || snake.body[0].x > 9 || snake.body[0].y > 9) {
    loseGame();
    return;
  } 
  
  ctx.drawImage(snake.currHead, snakebodyPx[0].x + adjustDraw, snakebodyPx[0].y + adjustDraw);
  
  dotsBody = snakebodyPx.slice(1);
  
  for (var coordinates of dotsBody) {
    if (snakebodyPx[0].x === coordinates.x && snakebodyPx[0].y === coordinates.y) {
      loseGame();
      return;
    }
    ctx.fillStyle = "yellowgreen"; //works only for one color for now
    ctx.fillRect( coordinates.x + adjustDraw, coordinates.y + adjustDraw, 54, 54 );
  }
}

//let occupiedCell;
function drawFood() {
  let occupiedCell = 0;

  while(occupiedCell === 0) {
    el.body[0].x = getRandom();
    el.body[0].y = getRandom();   
    occupiedCell = 1;
    for (var coordinates of snake.body) {
      if (el.body[0].x === coordinates.x && el.body[0].y === coordinates.y) {
        occupiedCell = 0;
      }
    }
  }
  
  elPx = fromCellsToPx(el.body);
  ctx.fillStyle = el.color;
  ctx.fillRect( elPx[0].x + adjustDraw, elPx[0].y + adjustDraw, 54, 54 );
}


function getRandom() {
  return Math.floor(Math.random() * 10);
}

let moveInterval;

function goSnake() {
  moveInterval = setInterval(function() {
    if(queue.length !== 0) {
      changeDir(queue[0]);
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
  ctx.clearRect(0, 0, size, size);
  ctx.font = "30px Arial";
  ctx.fillText("You lose", 250, 300);
  ctx.fillText("Your score: " + counter, 225, 350);
  return;
}

