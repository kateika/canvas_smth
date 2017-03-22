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
  console.log('Image was loaded');
  ctx.drawImage(snakeHead, start.x, start.y);
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

//let int = setTimeout(function tick() {
//  if (start.y < 0 || start.x < 0 || start.x > 600 || start.y > 600) {
//    clearTimeout(int);
//    return;
//  }
//  ctx.drawImage(snakeHead, start.x, start.y);
//  start.y -= 60;
//  ctx.clearRect( start.x + 1, start.y + 121, step - 2, step - 2); //1px and 2px is for not removing the border of cells
//  snakeDir.x = start.x;
//  snakeDir.y = start.y;
////  console.log("snakeDirVar", snakeDir);
//
//  setTimeout(tick, 1000);
//  console.log("move");
//}, 1000);


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
//    let shift = -60;
    let direction = "l";
    let axis = "x";
    moveForward(snakeMove, axis, direction);
  }
  if(dir === 'u') {
    let snakeMove = snakeDir.y - 60;
//    let shift = -60;
    let direction = "u";
    let axis = "y";
    moveForward(snakeMove, axis, direction);
  }
  if(dir === 'r') {
    let snakeMove = snakeDir.x + 60;
//    let shift = 60;
    let direction = "r";
    let axis = "x";
    moveForward(snakeMove, axis, direction);
  }
  if(dir === 'd') {
    let snakeMove = snakeDir.y + 60;
//    let shift = 60;
    let direction = "d";
    let axis = "y";
    moveForward(snakeMove, axis, direction);
  }
}

function moveForward(coord, axis, direction) {
  if (axis === "x") {
    let int = setTimeout(function tick() {
    console.log('inside move forward');
      if (snakeDir.x < 1 || snakeDir.y < 1 || snakeDir.x > 599 || snakeDir.y > 599) {
        clearTimeout(int);
        return;
      }
      ctx.drawImage(snakeHead, coord, snakeDir.y);
      ctx.clearRect(snakeDir.x, snakeDir.y, step, step); //Как вычислить snakeDir.y и погрешности в 1-2 пикселя в зависимости от направления?
      ctx.drawImage(snakeHead, coord, snakeDir.y);
      snakeDir.x = coord;
      changeDir(direction);
    }, 1000);
  }
  if (axis === "y") {
    let int = setTimeout(function tick() {
      if (snakeDir.x < 1 || snakeDir.y < 1 || snakeDir.x > 599 || snakeDir.y > 599) {
        clearTimeout(int);
        return;
      }
      ctx.drawImage(snakeHead, snakeDir.x, coord);
      ctx.clearRect( snakeDir.x, snakeDir.y, step, step );
      ctx.drawImage(snakeHead, snakeDir.x, coord);
      snakeDir.y = coord;
      changeDir(direction);
    }, 1000);
  }
}