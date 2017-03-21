let canvas = document.getElementById('snake-game');
let step = 60;

if (canvas.getContext) {
 var ctx = canvas.getContext('2d');
}

ctx.beginPath();

for ( var i = 60; i < canvas.getAttribute("width"); i+=60 ) {
  ctx.moveTo(i, 0);
  ctx.lineTo(i, i * 10);
  ctx.closePath();
  ctx.stroke();
}

for ( var i = 60; i < canvas.getAttribute("height"); i+=60 ) {
  ctx.moveTo(0, i);
  ctx.lineTo(i * 10, i);
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
//  ctx.drawImage(snakeHead, 300, 540);
})

snakeHead.src = 'img/snake-head.png';

//addEventListener("keydown", function (e) {
//  console.warn('keydown');
//});
let start = {
  x: 300,
  y: 540
}

let int = setInterval(function() {
  if (start.y < 0) {
    clearInterval(int);
  }
  ctx.drawImage(snakeHead, start.x, start.y);
  start.y -= 60;
  ctx.clearRect( start.x, start.y + 120, step , step );
  console.log("move");
}, 1000)