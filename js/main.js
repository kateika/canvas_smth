let canvas = document.getElementById('snake-game');
let canvasU = document.createElement('canvas');
let canvasD = document.createElement('canvas');
let canvasL = document.createElement('canvas');
let canvasR = document.createElement('canvas');

let step = 60;
let size = canvas.getAttribute("width");

if (canvas.getContext && canvasU.getContext && canvasD.getContext && canvasL.getContext && canvasR.getContext) {
  var ctx = canvas.getContext('2d');
  var ctxU = canvasU.getContext('2d');
  var ctxD = canvasD.getContext('2d');
  var ctxL = canvasL.getContext('2d');
  var ctxR = canvasR.getContext('2d');
}


//adjustments for drawing image in the center of cell and for avoiding clean the border of cells
let adjustMove = 2,
    adjustDraw = 3,
    adjustCleanArea = 4;

ctx.beginPath();

//draw a field
for ( var i = 0; i <= size; i+=60 ) {
  ctx.moveTo(i, 0);
  ctx.lineTo(i, size);
  ctx.closePath();
  ctx.stroke();
}

for ( var i = 0; i <= size; i+=60 ) {
  ctx.moveTo(0, i);
  ctx.lineTo(size, i);
  ctx.closePath();
  ctx.stroke();
}


//some hardcoded circles at the field
let circle = new Path2D();
  circle.arc(330, 330, 20, 0, 2 * Math.PI); //сдвиг круга относительно координат = 30px
  ctx.fillStyle = "#8be400";
  ctx.fill(circle);

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
  x: 300,
  y: 540,
  direction: "u"
}
snakeParams.coordToMove = snakeParams.y - step;

//draw snakeHead on another canvas and set started point
let snakeHead = new Image();

snakeHead.addEventListener('load', function() {
  ctxU.drawImage(snakeHead, 0, 0);
  ctx.drawImage(canvasU, 303, 543);
  
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
let x = snakeParams.x;
let y = snakeParams.y;
let snakeMove, coefficient;



function changeDir(direction) {
//  console.log("change dir: ", dir);
  if(direction === 'l' && currentDir !== "r") {
    snakeMove = snakeParams.x - step;
    currentDir = "l";
  }
  if(direction === 'u' && currentDir !== "d") {
    snakeMove = snakeParams.y - step;
    currentDir = "u";
  }
  if(direction === 'r' && currentDir !== "l") {
    snakeMove = snakeParams.x + step;
    currentDir = "r";
  }
  if(direction === 'd' && currentDir !== "u") {
    snakeMove = snakeParams.y + step;
    currentDir = "d";
  }
}

//move snake forward by default
let moveInterval = setInterval(function() {
  if (currentDir === "d" || currentDir === "r") {
    coefficient = 1;
    move(coefficient);
  };
  if (currentDir === "u" || currentDir === "l") {
    coefficient = -1;
    move(coefficient);
  } 
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


function move(coefficient) {
//  console.log("moveTo", dir);
  
  if (snakeParams.x < 0 || snakeParams.y < 0 || snakeParams.x > (size - step) || snakeParams.y > (size - step)) {
      loseGame();
  } else {
    if (currentDir === "l" || currentDir === "r") {
      ctx.clearRect(snakeParams.x + adjustMove, snakeParams.y + adjustMove, step - adjustCleanArea, step - adjustCleanArea);
      x += step * coefficient;
      console.log(coefficient);
      if(coefficient < 0) {
        ctx.drawImage(canvasL, x + adjustDraw, y + adjustDraw);
      } else {
        ctx.drawImage(canvasR, x + adjustDraw, y + adjustDraw);
      }     
      snakeParams.x = x;
      snakeParams.y = y;
    } else {
      ctx.clearRect(snakeParams.x + adjustMove, snakeParams.y + adjustMove, step - adjustCleanArea, step - adjustCleanArea);
      y += step * coefficient;
      if(coefficient < 0) {
        ctx.drawImage(canvasU, x + adjustDraw, y + adjustDraw);
      } else {
        ctx.drawImage(canvasD, x + adjustDraw, y + adjustDraw);
      }   
      snakeParams.x = x;
      snakeParams.y = y;
    }
  }
}

function loseGame() {
  clearInterval(moveInterval);
  ctx.clearRect(0, 0, size, size);
  ctx.font = "30px Arial";
  ctx.fillText("You lose", 250, 300);
  return;
}