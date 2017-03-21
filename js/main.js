let canvas = document.getElementById('snake-game');

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

let img = new Image();
img.addEventListener('load', function() {
  console.log('Image was loaded');
  ctx.drawImage(img, 300, 540);
})

img.src = 'img/snake-head.png';