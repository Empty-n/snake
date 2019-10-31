var canvas = document.getElementById("canvas");
var div = document.getElementsByClassName("div");
var restart = document.getElementById("restart");
var context = canvas.getContext("2d");
var overlay = document.getElementById("overlay");
var count = 0; // game's speed(work with frameRate)
var compteurP = 0; // apple count
var isPaused = false; // boolean for pause
var score = document.getElementById("score").innerHTML;
const sound = new Audio("./oh_my_god.mp3");
const sound2 = new Audio("./qu'elle est ce fuck.mp3");
const sound3 = new Audio("./pomme.mp3");
var point = 0; // score
var vitesse = 15; // velocity of snake
var apple = {};

var snake = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  height: 14,
  width: 14,
  // snake velocity. moves one grid length every frame in either the x or y direction
  dx: 15,
  dy: 0,

  //toutes les positions du snake
  cells: [],

  taille: 10
};

function getRandomInt(min, max) {
  var test = Math.floor(Math.random() * (max - min + 1) + min);
  if (test % 15 != 0) return getRandomInt(min, max);
  else return test;
}

function initApple() {
  apple.x = getRandomInt(1, canvas.width - 15);
  apple.y = getRandomInt(1, canvas.height - 15);
  for (let i = 0; i < snake.cells.length; i++) {
    if (apple.x === snake.cells[i].x && apple.y === snake.cells[i].y) {
      apple.x = getRandomInt(1, canvas.width - 15);
      apple.y = getRandomInt(1, canvas.height - 15);
    }
  }
}

function drawApple() {
  context.fillStyle = "red";
  context.fillRect(apple.x, apple.y, 14, 14);
}

let animationFrameId; //
let frameRate = 4; // game's speed
let x = 0; // pause

// game loop
function loop() {
  animationFrameId = requestAnimationFrame(loop);
  if (isPaused) {
    x = 0;
    return;
  }
  // slow game loop to 15 fps instead of 60 (60/15 = 4)
  if (++count < frameRate) {
    return;
  }
  count = 0;
  x = 0;
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

  // move snake by it's velocity
  snake.x += snake.dx;
  snake.y += snake.dy;

  //horizontale
  if (snake.x < 0) {
    snake.x = canvas.width;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  //verticale
  if (snake.y < 0) {
    snake.y = canvas.height;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  if (!apple.x && !apple.y) initApple();
  else drawApple();

  //unshift === La méthode unshift() ajoute un ou plusieurs éléments au début d'un tableau et renvoie la nouvelle longueur du tableau.
  snake.cells.unshift({
    x: snake.x,
    y: snake.y
  });

  if (snake.cells.length > snake.taille) snake.cells.pop();

  // draw snake one cell at a time
  context.fillStyle = "rgb(254, 208, 42)";
  snake.cells.forEach(function(cell, index) {
    // eat apple
    if (cell.x == apple.x && cell.y == apple.y) {
      sound3.play();
      snake.taille += 15;
      point += 5;
      compteurP++;
      apple = {};
      document.getElementById("score").innerHTML = score + " " + point;

      if (compteurP > 3) {
        if (compteurP === 4) sound.play();
        frameRate = 2;
        point += 10;
      }
      if (compteurP >= 10) {
        if (compteurP === 10) sound2.play();
        frameRate = 1;
        point += 40;
      }
    }
    context.fillRect(cell.x, cell.y, snake.height, snake.width);
    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        isPaused = !isPaused;
        restart.style.opacity = 100;
      }
    }
  });
  moveSnake();
}

function moveSnake() {
  document.addEventListener("keydown", function(e) {
    if (e.which === 32 && x < 3) {
      overlay.style.visibility =
        overlay.style.visibility == "visible" ? "hidden" : "visible";
      isPaused = !isPaused;
      x++;
    }

    // left arrow key
    if (e.which === 37 && snake.dx === 0) {
      snake.dx = -vitesse;
      snake.dy = 0;
    }
    // up arrow key
    else if (e.which === 38 && snake.dy === 0) {
      snake.dy = -vitesse;
      snake.dx = 0;
    }
    // right arrow key
    else if (e.which === 39 && snake.dx === 0) {
      snake.dx = vitesse;
      snake.dy = 0;
    }
    // down arrow key
    else if (e.which === 40 && snake.dy === 0) {
      snake.dy = vitesse;
      snake.dx = 0;
    }
  });
}

// start the game
requestAnimationFrame(loop);
