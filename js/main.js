const canvas = document.getElementById('snake-game');
const canvasU = document.createElement('canvas');
const canvasD = document.createElement('canvas');
const canvasL = document.createElement('canvas');
const canvasR = document.createElement('canvas');

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
let circle1 = new Path2D();
  circle1.arc(330, 330, 20, 0, 2 * Math.PI); //сдвиг круга относительно координат = 30px
  ctx.fillStyle = "#8be400";
  ctx.fill(circle1);

let circle2 = new Path2D();
  circle2.arc(30, 30, 20, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff404";
  ctx.fill(circle2);

let circle3 = new Path2D();
  circle3.arc(270, 150, 20, 0, 2 * Math.PI);
  ctx.fillStyle = "#ff2c10";
  ctx.fill(circle3);

/*@TODO random coordinates  Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64)); */
//@TODO random colors of circles

let snakeParams = {
  direction: "u",
  cellx: 300/step,
  celly: 480/step
}

let snakebody = [ 
  {x: snakeParams.cellx, y: snakeParams.celly}, 
  {x: snakeParams.cellx, y: snakeParams.celly + 1}, 
  {x: snakeParams.cellx, y: snakeParams.celly + 2}
]

function fromCellsToPx(body) {
  let snakebodyPixels = [];
  for (var i = 0; i < body.length; i++) {
    snakebodyPixels[i] = {
      x: body[i].x * step,
      y: body[i].y * step
    }
  }
  return snakebodyPixels;
}


//draw snakeHead on another canvas and set started point
let snakeHead = new Image();

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
})

snakeHead.src = 'img/snake-head.png';

let currentDir = snakeParams.direction;
let currentCanvas = canvasU;
let snakebodyPx, coefficient, coefficientY, coefficientX, circle, dotsBody;


function changeDir(direction) {
  if(direction === 'l' && currentDir !== "r") {
    currentDir = "l";
    currentCanvas = canvasL;
  }
  if(direction === 'u' && currentDir !== "d") {
    currentDir = "u";
    currentCanvas = canvasU;
  }
  if(direction === 'r' && currentDir !== "l") {
    currentDir = "r";
    currentCanvas = canvasR;
  }
  if(direction === 'd' && currentDir !== "u") {
    currentCanvas = canvasD;
    currentDir = "d";
  }
}

//move snake forward by default
let moveInterval = setInterval(function() {
  if (currentDir === "u" || currentDir === "l") {
    coefficient = -1;
    move(snakebody, coefficient);
  } 
  if (currentDir === "d" || currentDir === "r") {
    coefficient = 1;
    move(snakebody, coefficient);
  };
}, 1000);


addEventListener("keydown", function (e) {
  switch(e.keyCode) {
    case 37:
      changeDir('l');
      break;
    case 38:
      changeDir('u');
      break;
    case 39:
      changeDir('r');
      break;
    case 40:
      changeDir('d');
      break;
    default:
      break;
  }
});

function move(snakebody, coefficient) {
  if (currentDir === "u" || currentDir === "d") {
    coefficientY = coefficient;
    coefficientX = 0;
  } else {
    coefficientY = 0;
    coefficientX = coefficient;
  }
  
  snakebodyPx = fromCellsToPx(snakebody);

  for (var coordinates of snakebodyPx) {
    ctx.clearRect(coordinates.x + adjustMove, coordinates.y + adjustMove, step - adjustCleanArea, step - adjustCleanArea);
  }

  snakebody.unshift({x: snakebody[0].x + coefficientX, y: snakebody[0].y + coefficientY});
  snakebody.pop();

  snakebodyPx = fromCellsToPx(snakebody);

  if (snakebody[0].x < 0 || snakebody[0].y < 0 || snakebody[0].x > 9 || snakebody[0].y > 9) {
    loseGame();
    return;
  } 
  
  ctx.drawImage(currentCanvas, snakebodyPx[0].x + adjustDraw, snakebodyPx[0].y + adjustDraw);
  
  dotsBody = snakebodyPx.slice(1);
  
  for (var coordinates of dotsBody) {
    circle = new Path2D();
    circle.arc(coordinates.x + 30, coordinates.y + 30, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "#8be400";
    ctx.fill(circle);  
  }      
}


function loseGame() {
  clearInterval(moveInterval);
//  ctx.clearRect(0, 0, size, size);
//  ctx.font = "30px Arial";
//  ctx.fillText("You lose", 250, 300);
  return;
}