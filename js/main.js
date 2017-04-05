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
  y: 420,
  direction: "u",
  cellx: 300/step,
  celly: 540/step
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


//snakeParams.coordToMove = fromCellsToPx(snakeParams.cellx, snakeParams.celly);

snakeParams.coordToMove = snakeParams.y - step;
/*Coord to move snakeParams.y - step;*/



//draw snakeHead on another canvas and set started point
let snakeHead = new Image();

snakeHead.addEventListener('load', function() {
  ctxU.drawImage(snakeHead, 0, 0);
  ctx.drawImage(canvasU, snakeParams.x + adjustDraw, snakeParams.y + adjustDraw);
  
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
    move(snakebody,coefficient);
  };
  if (currentDir === "u" || currentDir === "l") {
    coefficient = -1;
    move(snakebody,coefficient);
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

let snakebodyPx;

function move(snakebody, coefficient) {
  debugger
  if (snakebody[0].x < 1 || snakebody[0].y < 0 || snakebody[0].x > 11 || snakebody[0].x > 11) {
//    console.log(snakebody[0].x,snakebody[0].y, snakebody);
    loseGame();
  } else {
//    console.log('else');
    if (currentDir === "l" || currentDir === "r") {
      snakebodyPx = fromCellsToPx(snakebody);
//        console.log("snakebodyPx LEFT\RIGHT", snakebodyPx);

      for (var coordinates of snakebody) {
        ctx.clearRect(coordinates.x + adjustMove, coordinates.y + adjustMove, step - adjustCleanArea, step - adjustCleanArea);
      }

      if(coefficient < 0) {
        for (var coordinates of snakebodyPx) {
          ctx.drawImage(canvasL, (coordinates.x + coefficient* step) + adjustDraw, coordinates.y + adjustDraw);
        }
      } else {
        for (var coordinates of snakebodyPx) {
          ctx.drawImage(canvasL, (coordinates.x + coefficient* step) + adjustDraw, coordinates.y + adjustDraw);
        }
      }     
      
      snakebody.unshift({x: snakebody[0].x + coefficient, y: snakebody[0].y})
      
    } else {
      snakebodyPx = fromCellsToPx(snakebody);
//      console.log("snakebodyPx UP/DOWN", snakebodyPx);

      for (var coordinates of snakebody) {
        ctx.clearRect(coordinates.x + adjustMove, coordinates.y + adjustMove, step - adjustCleanArea, step - adjustCleanArea);
      }

      if(coefficient < 0) {
        for (var coordinates of snakebodyPx) {
          ctx.drawImage(canvasL, coordinates.x + adjustDraw, (coordinates.y + coefficient* step) + adjustDraw);
        }
      } else {
        for (var coordinates of snakebodyPx) {
          ctx.drawImage(canvasL, coordinates.x + adjustDraw, (coordinates.y + coefficient* step) + adjustDraw);
        }
      }     
      
      snakebody.unshift({x: snakebody[0].x, y: snakebody[0].y + coefficient })
      
    }
  }
}


function loseGame() {
/*  clearInterval(moveInterval);
  ctx.clearRect(0, 0, size, size);
  ctx.font = "30px Arial";
  ctx.fillText("You lose", 250, 300);*/
  return;
}