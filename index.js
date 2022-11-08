const WIDTH = 10;
const RIGHT = 1;
const LEFT = -1;
const UP = -WIDTH;
const DOWN = +WIDTH;
const BASICSNAKE = [2, 1, 0];

let gameBoard = document.querySelector(".game-board") 
let snakeTimeUpdate = 0
let pastDirection = 0;
let direction = RIGHT;
let currentSnake = BASICSNAKE;
let interval = 1000;
let speed = 0.9;
let mainTheme = document.getElementById("myAudio");

createBoard();
dropSnake();
randomApple();

function createBoard(){
  for(let i = 0; i < 100; i++){
    let div = document.createElement("div");
    div.setAttribute("id", "square-" + i);
    gameBoard.appendChild(div);
  }
}

function dropSnake(){
  let squares = document.querySelectorAll(".game-board div");
  currentSnake.forEach(index => squares[index].classList.add("snake"));
}

function startSnake(){
  launchSnake();
  playGameTheme();
}

function launchSnake(){
  checkDirection();
  moveSnake();
  snakeTimeUpdate = setTimeout("launchSnake()", interval);
}

function pauseSnake(){
  clearTimeout(snakeTimeUpdate);
  stopGameTheme();
}

function stopGameTheme(){
  mainTheme.loop = false;
  mainTheme.load();
}

function dropLevel(){
  const snake = document.querySelectorAll(".snake");

  pauseSnake();
  snake.forEach(snakePart => {
    snakePart.classList.remove('snake');
  });
  currentSnake = [2, 1, 0];
  direction = RIGHT;
  interval = 1000;
  dropSnake();
}

function randomApple(){
  let clearSquares = [];
  let squares = document.querySelectorAll(".game-board div");

  squares.forEach(square =>{
    if(!square.classList.contains("snake")){
      clearSquares.push(square);
    }
  });
  
  apppleId = Math.floor(Math.random() * clearSquares.length);

  clearSquares[apppleId].classList.add("apple");
}

function moveSnake(){
  let squares = document.querySelectorAll(".game-board div");
  let tail = currentSnake.pop();

  squares[tail].classList.remove("snake");
  currentSnake.unshift(currentSnake[0] + direction);

  // from RIGHT to LEFT
  if((currentSnake[0] % WIDTH === 0) && (direction === RIGHT)){
    currentSnake[0] = currentSnake[0] - WIDTH;
  }

  // from LEFT to RIGHT
  if(((currentSnake[0] % WIDTH === (WIDTH - 1)) || (currentSnake[0] % (WIDTH ) === -1)) && (currentSnake[1] % WIDTH === 0) && (direction === LEFT)){
    currentSnake[0] = currentSnake[0] + WIDTH;
  }

  // from UP to DOWN
  if((currentSnake[0] < 0) && (direction === UP)){
    currentSnake[0] = currentSnake[0] + (WIDTH * 9) + WIDTH;
  }

  // from DOWN to UP
  if((currentSnake[0] >= 100) && (direction === DOWN)){
    currentSnake[0] = currentSnake[0] - 100;
  }

  eatApple(squares, tail);
  checkForHits(squares);
}

function checkForHits(squares) {
  if(!squares[currentSnake[0]].classList.contains("snake")){
    squares[currentSnake[0]].classList.add("snake");
  } else {
    playLoseSound();
    stopGameTheme();
    setTimeout(function(){alert("you ate yourself!!!")}, 0111);
    setTimeout(function(){dropLevel()}, 0111);
    pauseSnake();
  }
}

function eatApple(squares, tail){
  if(squares[currentSnake[0]].classList.contains("apple")){
    playEatAppleSound();
    document.querySelector(".apple").classList.remove("apple");
    squares[tail].classList.add("snake");
    currentSnake.push(tail);
    interval = interval * speed;
    randomApple();
  }
}

function playMoveSounds() {
  var audio = new Audio('src/sounds/move.wav');
  audio.play();
}

function playLoseSound(){
  var audio = new Audio('src/sounds/lose.wav');
  audio.play();
}

function playGameTheme() {
  mainTheme.loop = true;
  mainTheme.load();
  mainTheme.play();
}

function playEatAppleSound() {
  var audio = new Audio('src/sounds/eat-apple.wav');
  audio.play();
}

function checkDirection(){
  document.onkeydown = (e) => {
    e = e || window.event;
    if (e.key === 'ArrowUp') {
      if(direction !== DOWN){
        pastDirection = direction;
        direction = UP;
      }
    } else if (e.key === 'ArrowDown') {
      if(direction !== UP){
        pastDirection = direction;
        direction = DOWN;
      }
    } else if (e.key === 'ArrowLeft') {
      if(direction !== RIGHT){
        pastDirection = direction;
        direction = LEFT;
      }
    } else if (e.key === 'ArrowRight') {
      if(direction !== LEFT){
        pastDirection = direction;
        direction = RIGHT;
      }
    }
  }
}
