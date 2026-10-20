const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const menu = document.querySelector(".menu");
const score = document.querySelector(".score");
// Game mode selection
const modeSelection = document.querySelector(".mode-selection");
const characterSelection = document.querySelector(".character-selection");

const onePlayerButton = document.getElementById("one-player");
const twoPlayersButton = document.getElementById("two-players");

const canvas2 = document.getElementById("snake-1");
const canvas3 = document.getElementById("snake-2");

const ctx2 = canvas2.getContext("2d");
const ctx3 = canvas3.getContext("2d");

canvas2.width = 190;
canvas2.height = 80;
canvas3.width = 190;
canvas3.height = 80;
canvas.width = 650;
canvas.height = 380;

let play = false;
let scoreP = 0;
//Pause controls
let paused = false;

const pauseButton = document.getElementById("pause-button");
const pauseMessage = document.getElementById("pause-message");
const restartButton = document.getElementById("restart-button");

const snake = new Snake({x:200, y:200}, 11, "#feba39",1.5, 3, 12, ctx);
snake.initBody();
const snakeP1 = new Snake({x:165, y:40}, 11, "#feba39",1.5, 8, 12, ctx2);
snakeP1.initBody();
snakeP1.drawCharacter();
const snakeP2 = new Snake({x:165, y:40}, 11, "#88fc03",1.5, 24, 4, ctx3);
snakeP2.initBody();
snakeP2.drawCharacter();
const apple = new Apple({x:300, y:300}, 8, "red", ctx);

canvas2.addEventListener("click", ()=> {
    init(3,12,"#feba39");
});
canvas3.addEventListener("click", ()=> {
    init(8,4,"#88fc03");
});
function init(length, pathLength, color) {
    snake.body.length = 0;
    snake.color = color;
    snake.length = length;
    snake.pathLength = pathLength;
    snake.position = {x:200, y:200};
    snake.rotation = 0;
    snake.isDeath = false;
    snake.velocity = 1.5;
    snake.transparency = 1; 
    snake.initBody();
    snake.keys.enable = true;
    paused = false;
    pauseButton.textContent = "PAUSE";
    pauseMessage.style.display = "none";
    play = true;
    menu.style.display = "none";
    scoreP = 0;
    score.textContent = scoreP;
    snake.distanceTraveled = 0;
}
function background() {
    ctx.fillStyle = "#1b1c30";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    for (let i = 0; i < canvas.height; i += 80) {
        for (let j = 0; j < canvas.width; j += 80) {
            ctx.fillStyle = "#23253c";
            ctx.fillRect(j+10, i+10, 70, 70);
        }
    }
}

function update() {
    // Only redraw the game when it is not paused
    if (!paused) {
        background();

        if (play) {
            snake.update();
            apple.draw();

            // Prevent collecting apples after death
            if (!snake.isDeath) {
                apple.collision(snake);
            }
        }
    }

    requestAnimationFrame(update);
}
update();
