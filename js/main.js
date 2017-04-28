const canvas = document.getElementById('snake-game');
const canvasU = document.createElement('canvas');
const canvasD = document.createElement('canvas');
const canvasL = document.createElement('canvas');
const canvasR = document.createElement('canvas');
const field = document.getElementById('field');
const count = document.getElementById('counter');

const step = 60;
let size = canvas.getAttribute("width");

if (canvas.getContext && canvasU.getContext && canvasD.getContext && canvasL.getContext && canvasR.getContext) {
  var ctx = canvas.getContext('2d');
  var ctxU = canvasU.getContext('2d');
  var ctxD = canvasD.getContext('2d');
  var ctxL = canvasL.getContext('2d');
  var ctxR = canvasR.getContext('2d');
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

//some hardcoded circles at the field
//let circle1 = new Path2D();
//  circle1.arc(330, 330, 20, 0, 2 * Math.PI); //сдвиг круга относительно координат = 30px
//  ctx.fillStyle = "#8be400";
//  ctx.fill(circle1);
//
//let circle2 = new Path2D();
//  circle2.arc(30, 30, 20, 0, 2 * Math.PI);
//  ctx.fillStyle = "#fff404";
//  ctx.fill(circle2);
//
//let circle3 = new Path2D();
//  circle3.arc(270, 150, 20, 0, 2 * Math.PI);
//  ctx.fillStyle = "#ff2c10";
//  ctx.fill(circle3);


/*@TODO random coordinates  Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64)); */
//@TODO random colors of circles

let snake = {
  currHead: canvasU,
  direction: "u",
  body: [ 
    {x: 7, y: 6},
    {x: 7, y: 7}, 
    {x: 7, y: 8},
    {x: 6, y: 8},
    {x: 5, y: 8}, 
    {x: 4, y: 8},
    {x: 3, y: 8}, 
    {x: 2, y: 8},
    {x: 1, y: 8},
    {x: 1, y: 7},
    {x: 0, y: 7}, 
    {x: 0, y: 6}, 
    {x: 0, y: 5},
    {x: 0, y: 4}, 
    {x: 0, y: 3},
    {x: 0, y: 2},
    {x: 0, y: 1}, 
    {x: 1, y: 1},
    {x: 2, y: 1}, 
    {x: 3, y: 1},
    {x: 4, y: 1}, 
    {x: 5, y: 1},
    {x: 6, y: 1}, 
    {x: 7, y: 1}, 
    {x: 8, y: 1},
    {x: 8, y: 2}, 
    {x: 7, y: 2}, 
    {x: 6, y: 2},
    {x: 5, y: 2}, 
    {x: 4, y: 2}
  ],
}

let el = {
  body: [ 
    {x: 5, y: 5} 
  ],
  color: "#d26902"
}

let counter = 0;

ctx.fillStyle = el.color;
ctx.fillRect( 300 + adjustDraw, 300 + adjustDraw, 54, 54 );

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


//draw snakeHead on another canvas and set started point
let snakeHead = new Image();
let moveInterval;

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
  
  //move snake forward by default
  moveInterval = setInterval(function() {
    if(queue.length !== 0) {
      changeDir(queue[0]);
      queue.shift();
    }

    if (snake.direction === "u" || snake.direction === "l") {
      coefficient = -1;
      move(snake.body, coefficient);
    } 
    if (snake.direction === "d" || snake.direction === "r") {
      coefficient = 1;
      move(snake.body, coefficient);
    };
  }, 300);
})

snakeHead.src = 'img/snake-head.jpg';


let snakebodyPx, coefficient, circle, dotsBody;
let queue = [];

function changeDir(direction) {
  if(direction === 'l' && snake.direction !== "r") {
    snake.direction = "l";
    snake.currHead = canvasL;
  }
  if(direction === 'u' && snake.direction !== "d") {
    snake.direction = "u";
    snake.currHead = canvasU;
  }
  if(direction === 'r' && snake.direction !== "l") {
    snake.direction = "r";
    snake.currHead = canvasR;
  }
  if(direction === 'd' && snake.direction !== "u") {
    snake.direction = "d";
    snake.currHead = canvasD;
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
      break;
  }
});


function move(snakebody, coefficient) {
  if (snake.direction === "u" || snake.direction === "d") {
    var coefficientY = coefficient;
    var coefficientX = 0;
  } else {
    var coefficientY = 0;
    var coefficientX = coefficient;
  }
  
  //@TODO snakebody.x(y) is always the same as snake.body.x(y)

  snakebodyPx = fromCellsToPx(snakebody);
  
    
  var lastElToPx = fromCellsToPx(snakebody)[snakebody.length-1];
  
  ctx.clearRect(lastElToPx.x + adjustMove, lastElToPx.y + adjustMove, step - adjustCleanArea, step - adjustCleanArea);
  
  snakebody.unshift({x: snakebody[0].x + coefficientX, y: snakebody[0].y + coefficientY});
  
  if (el.body[0].y === snakebody[0].y && el.body[0].x === snakebody[0].x) {
    counter++;
    count.innerHTML = counter;
    drawFood();
  } else {
    snakebody.pop();
  }
  
  snakebodyPx = fromCellsToPx(snakebody);

  if (snakebody[0].x < 0 || snakebody[0].y < 0 || snakebody[0].x > 9 || snakebody[0].y > 9) {
    loseGame();
    return;
  } 
  
  ctx.drawImage(snake.currHead, snakebodyPx[0].x + adjustDraw, snakebodyPx[0].y + adjustDraw);
  
  dotsBody = snakebodyPx.slice(1);
  
  for (var coordinates of dotsBody) {
    ctx.fillStyle = "yellowgreen"; //works only for one color for now
    ctx.fillRect( coordinates.x + adjustDraw, coordinates.y + adjustDraw, 54, 54 );
  }
}

let a = 0;

function drawFood() {
  el.body[0].x = getRandom();
  el.body[0].y = getRandom();
  
  checkPosition();
  
  let elPx = fromCellsToPx(el.body);
  ctx.fillStyle = el.color;
  ctx.fillRect( elPx[0].x + adjustDraw, elPx[0].y + adjustDraw, 54, 54 );
}

function checkPosition() {
  for (var coordinates of snake.body) {
    if  (el.body[0].x === coordinates.x && el.body[0].y === coordinates.y) {
      a = 1;
      while(a === 1) {
        el.body[0].x = getRandom();
        el.body[0].y = getRandom();
        checkPosition()
      }
      console.log("check 1", a);
    } else {
      a = 0;
      console.log("check 0", a);
    }
  }
}

function getRandom() {
  return Math.floor(Math.random() * 10);
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