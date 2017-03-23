let canvas = document.getElementById('snake-game');
let step = 60;
let size = canvas.getAttribute("width");
if (canvas.getContext) {
 var ctx = canvas.getContext('2d');
}

let adjustMove = 2;
let adjustDraw = 3;
let adjustCleanArea = 4;

ctx.beginPath();

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

let snakeHead = new Image();
snakeHead.addEventListener('load', function() {
  ctx.drawImage(snakeHead, start.x + adjustDraw, start.y + adjustDraw);
})

snakeHead.src = 'img/snake-head.png';

let start = {
  x: 300,
  y: 540,
  axis: "y",
  direction: "u"
}

start.coordToMove = start.y - step;

let snakeDir = {
  x: start.x,
  y: start.y,
};

let moveTimeout;

moveForward(start.coordToMove, start.axis, start.direction);

addEventListener("keydown", function (e) {
  if(e.keyCode == '37' ) { //left
//    console.log('left');
    changeDir('l');
  //    snakeHead.rotate(90);
  }
  if(e.keyCode == '38' ) { //up
//    console.log('up');
    changeDir('u');
  }
  if(e.keyCode == '39' ) { //right
//    console.log('right');
    changeDir('r');
  }
  if(e.keyCode == '40' ) { //down
//    console.log('down');
    changeDir('d');
  }
});

let currentDir = start.direction;
let direction, snakeMove, axis;

function changeDir(dir) {
  if(dir === 'l' && currentDir !== "r") {
    snakeMove = snakeDir.x - step;
    direction = "l";
    axis = "x";
    moveForward(snakeMove, axis, direction);
    currentDir = "l";
  }
  if(dir === 'u' && currentDir !== "d") {
    snakeMove = snakeDir.y - step;
    direction = "u";
    axis = "y";
    moveForward(snakeMove, axis, direction);
    currentDir = "u";
  }
  if(dir === 'r' && currentDir !== "l") {
    snakeMove = snakeDir.x + step;
    direction = "r";
    axis = "x";
    moveForward(snakeMove, axis, direction);
    currentDir = "r";
  }
  if(dir === 'd' && currentDir !== "u") {
    snakeMove = snakeDir.y + step;
    direction = "d";
    axis = "y";
    moveForward(snakeMove, axis, direction);
    currentDir = "d";
  }
}


function moveForward(coordToMove, axis, direction) {
  if (axis === "x") {
    if (snakeDir.x < 0 || snakeDir.y < 0 || snakeDir.x > 540 || snakeDir.y > 540) {
      return;
    }
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(function tick() {
      ctx.clearRect(snakeDir.x + adjustMove, snakeDir.y + adjustMove, step - adjustCleanArea, step - adjustCleanArea);
      ctx.drawImage(snakeHead, coordToMove + adjustDraw, snakeDir.y + adjustDraw);
      snakeDir.x = coordToMove;
      changeDir(direction);
    }, 1000);
  }
  if (axis === "y") {
    if (snakeDir.x < 0 || snakeDir.y < 0 || snakeDir.x > 540 || snakeDir.y > 540) {
      return;
    }
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(function tick() {
      ctx.clearRect(snakeDir.x + adjustMove, snakeDir.y + adjustMove, step - adjustCleanArea, step - adjustCleanArea );
      ctx.drawImage(snakeHead, snakeDir.x + adjustDraw, coordToMove + adjustDraw);
      snakeDir.y = coordToMove;
      changeDir(direction);
    }, 1000);
  }
}