let canvas = document.getElementById('snake-game');
let step = 60;
let size = canvas.getAttribute("width");
if (canvas.getContext) {
 var ctx = canvas.getContext('2d');
}

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
  ctx.drawImage(snakeHead, start.x + 3, start.y + 3);
})

snakeHead.src = 'img/snake-head.png';

let start = {
  x: 300,
  y: 540
}

let snakeDir = {
  x: start.x,
  y: start.y,
};

let moveTimeout;

addEventListener("keydown", function (e) {
  if(e.keyCode == '37' ) { //left
    console.log('left');
    changeDir('l');
  //    snakeHead.rotate(90);
  //    ctx.rotate(90);
  //    int = setTimeout(tick, 1000);
  }
  if(e.keyCode == '38' ) { //up
    console.log('up');
    changeDir('u');
  }
  if(e.keyCode == '39' ) { //right
    console.log('right');
    changeDir('r');
  }
  if(e.keyCode == '40' ) { //down
    console.log('down');
    changeDir('d');
  }
});

function changeDir(dir) {
  if(dir === 'l') {
    console.log('l');
    let snakeMove = snakeDir.x - 60;
    let direction = "l";
    let axis = "x";
    moveForward(snakeMove, axis, direction);
  }
  if(dir === 'u') {
    let snakeMove = snakeDir.y - 60;
    let direction = "u";
    let axis = "y";
    moveForward(snakeMove, axis, direction);
  }
  if(dir === 'r') {
    let snakeMove = snakeDir.x + 60;
    let direction = "r";
    let axis = "x";
    moveForward(snakeMove, axis, direction);
  }
  if(dir === 'd') {
    let snakeMove = snakeDir.y + 60;
    let direction = "d";
    let axis = "y";
    moveForward(snakeMove, axis, direction);
  }
}

function moveForward(coord, axis, direction) {
  if (axis === "x") {
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(function tick() {
    console.log('inside move forward');
      if (snakeDir.x < 1 || snakeDir.y < 1 || snakeDir.x > 599 || snakeDir.y > 599) {
        clearTimeout(moveTimeout);
        return;
      }
      ctx.clearRect(snakeDir.x + 2, snakeDir.y + 2, step - 4, step - 4);
      ctx.drawImage(snakeHead, coord + 3, snakeDir.y + 3);
      snakeDir.x = coord;
      changeDir(direction);
    }, 1000);
  }
  if (axis === "y") {
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(function tick() {
      if (snakeDir.x < 1 || snakeDir.y < 1 || snakeDir.x > 599 || snakeDir.y > 599) {
        clearTimeout(moveTimeout);
        return;
      }
      ctx.clearRect(snakeDir.x + 2, snakeDir.y + 2, step - 4, step - 4 );
      ctx.drawImage(snakeHead, snakeDir.x + 3, coord + 3);
      snakeDir.y = coord;
      changeDir(direction);
    }, 1000);
  }
}