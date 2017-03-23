let canvas = document.getElementById('snake-game');
let step = 60;
let size = canvas.getAttribute("width");
if (canvas.getContext) {
 var ctx = canvas.getContext('2d');
}

//adjustments for drawing image in the center of cell and for avoiding clean the border of cells
let adjustMove = 2;
let adjustDraw = 3;
let adjustCleanArea = 4;

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

//draw snakeHead and set started point
let snakeHead = new Image();
snakeHead.addEventListener('load', function() {
  ctx.drawImage(snakeHead, snakeParams.x + adjustDraw, snakeParams.y + adjustDraw);
})

snakeHead.src = 'img/snake-head.png';

let snakeParams = {
  x: 300,
  y: 540,
  axis: "y",
  direction: "u"
}
snakeParams.coordToMove = snakeParams.y - step;


//defining of variables
let moveTimeout;
let currentDir = snakeParams.direction;
let direction, snakeMove, axis;

//move snake forward by default
moveForward(snakeParams.coordToMove, snakeParams.axis, snakeParams.direction);

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



function changeDir(dir) {
  if(dir === 'l' && currentDir !== "r") {
    snakeMove = snakeParams.x - step;
    direction = "l";
    axis = "x";
    moveForward(snakeMove, axis, direction);
    currentDir = "l";
  }
  if(dir === 'u' && currentDir !== "d") {
    snakeMove = snakeParams.y - step;
    direction = "u";
    axis = "y";
    moveForward(snakeMove, axis, direction);
    currentDir = "u";
  }
  if(dir === 'r' && currentDir !== "l") {
    snakeMove = snakeParams.x + step;
    direction = "r";
    axis = "x";
    moveForward(snakeMove, axis, direction);
    currentDir = "r";
  }
  if(dir === 'd' && currentDir !== "u") {
    snakeMove = snakeParams.y + step;
    direction = "d";
    axis = "y";
    moveForward(snakeMove, axis, direction);
    currentDir = "d";
  }
}


function moveForward(coordToMove, axis, direction) {
  if (axis === "x") {
    if (snakeParams.x < 0 || snakeParams.y < 0 || snakeParams.x > (size - step) || snakeParams.y > (size - step)) {
      loseGame();
    } else {
       moveTo(coordToMove, snakeParams.y, direction); 
    }
  }
  if (axis === "y") {
    if (snakeParams.x < 0 || snakeParams.y < 0 || snakeParams.x > (size - step) || snakeParams.y > (size - step)) {
      loseGame();
    } else {
       moveTo(snakeParams.x, coordToMove, direction); 
    }
  }
}

function moveTo(x, y, direction) {
  clearTimeout(moveTimeout);
  moveTimeout = setTimeout(function tick() {
    ctx.clearRect(snakeParams.x + adjustMove, snakeParams.y + adjustMove, step - adjustCleanArea, step - adjustCleanArea);
    ctx.drawImage(snakeHead, x + adjustDraw, y + adjustDraw);
    snakeParams.x = x;
    snakeParams.y = y;
    changeDir(direction);
  }, 1000);
}

function loseGame() {
  ctx.clearRect(0, 0, size, size);
  ctx.font = "30px Arial";
  ctx.fillText("You lose", 250, 300);
  return;
}