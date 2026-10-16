const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const menu = document.querySelector(".menu");
const score = document.querySelector(".score");
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

class Apple {
    constructor(position, radius, color, context) {
        this.position = position;
        this.radius = radius;
        this.color = color;
        this.context = context;
    }
    draw() {
        this.context.save();
        this.context.beginPath();
        this.context.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI);
        this.context.fillStyle = this.color;
        this.context.shadowColor = this.color;
        this.context.shadowBlur = 10;
        this.context.fill();
        this.context.closePath();
        this.context.restore();

    }
    collision(snake) {
        let v1 = {
            x:this.position.x - snake.position.x,
            y:this.position.y - snake.position.y
        }
        let distance = Math.sqrt(
            (v1.x*v1.x) + (v1.y*v1.y)
        );
        if (distance < snake.radius + this.radius) {
            this.position = {
                x: Math.floor(Math.random() *
            ((canvas.width-this.radius) - this.radius + 1)) + this.radius,
                y: Math.floor(Math.random() *
            ((canvas.height-this.radius) - this.radius +1)) + this.radius,
            }
            snake.createBody();
            scoreP++;
            score.textContent = scoreP;
        }
    }

}
class SnakeBody {
    constructor(radius, color, context, path) {
        this.radius = radius;
        this.color = color;
        this.context = context;
        this.path = path;
        this.transparency = 1;
    }
    drawCircle(x, y, radius, color) {
        this.context.save();
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, 2*Math.PI);
        this.context.fillStyle = color;
        this.context.globalAlpha = this.transparency;
        this.context.shadowColor = this.color;
        this.context.shadowBlur = 10;
        this.context.fill();
        this.context.closePath();
        this.context.restore();
    }
    draw() {
        this.drawCircle(this.path.slice(-1)[0].x, this.path.slice(-1)[0].y, this.radius, this.color);
    }

}
class Snake {
    constructor(position, radius, color, velocity,length, pathLength, context) {
        this.position = position;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.context = context;
        this.rotation = 0;
        this.transparency = 1;
        this.body = [];
        this.isDeath = false;
        this.distanceTraveled = 0;
        this.length = length;
        this.pathLength = pathLength;
        this.keys = {
            A: false,
            D: false,
            enable: true
        }
        this.keyboard();
    }
    initBody() {
        for (let i=0; i<this.length; i++) {
            let path = [];
            for (let k=0; k<this.pathLength; k++) {
                path.push({
                    x:this.position.x,
                    y:this.position.y
                });
            }
            this.body.push(new SnakeBody(this.radius, this.color, this.context, path));
        }
    }
    createBody() {
        let path = [];
        for (let k=0; k<this.pathLength; k++) {
            path.push({
                x:this.body.slice(-1)[0].path.slice(-1)[0].x,
                y:this.body.slice(-1)[0].path.slice(-1)[0].y
            });
        }
        this.body.push(new SnakeBody(this.radius, this.color, this.context, path));
        
        if(this.pathLength < 8){
            this.body.push(new SnakeBody(this.radius, this.color, this.context, [...path]));
            this.body.push(new SnakeBody(this.radius, this.color, this.context, [...path]));
            this.body.push(new SnakeBody(this.radius, this.color, this.context, [...path]));
        }
    }
    drawCircle(x, y, radius, color, shadowColor) {
        this.context.save();
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, 2*Math.PI); //the angle is in radians
        this.context.fillStyle = color;
        this.context.globalAlpha = this.transparency;
        this.context.shadowColor = shadowColor;
        this.context.shadowBlur = 10;
        this.context.fill();
        this.context.closePath();
        this.context.restore();
    }
    drawHead(){
        this.drawCircle(this.position.x, this.position.y, this.radius, this.color, this.color);
        // Draw the eyes
        this.drawCircle(this.position.x, this.position.y-9, this.radius-4, "white", "transparent");
        this.drawCircle(this.position.x+1, this.position.y-9, this.radius-6, "black", "transparent");
        this.drawCircle(this.position.x+3, this.position.y-8, this.radius-9, "white", "transparent");

        this.drawCircle(this.position.x, this.position.y+9, this.radius-4, "white", "transparent");
        this.drawCircle(this.position.x+1, this.position.y+9, this.radius-6, "black", "transparent");
        this.drawCircle(this.position.x+3, this.position.y+8, this.radius-9, "white", "transparent");
    }
    drawBody() {
        this.body[0].path.unshift({
            x:this.position.x,
            y:this.position.y
        });
        this.body[0].draw();

        for(let i = 1; i<this.body.length; i++) {
            this.body[i].path.unshift(this.body[i-1].path.pop());
            this.body[i].draw();
        }
        this.body[this.body.length-1].path.pop();
    }
    draw() {
        this.context.save();
        
        this.context.translate(this.position.x, this.position.y);
        this.context.rotate(this.rotation);//(angle * Math.PI / 180) Rotate the canvas by degrees (converted to radians)
        this.context.translate(-this.position.x, -this.position.y);
        this.drawHead();
        this.context.restore();
    }
    update() {
        if(this.isDeath){
            this.transparency -= 0.02;
            if(this.transparency<=0){
                play = false;
                menu.style.display = "flex";
                return
            }
        }

        this.drawBody();
        this.draw();
        if (this.keys.A && this.keys.enable) {
            this.rotation -= 0.04;
        }
        if (this.keys.D && this.keys.enable) {
            this.rotation += 0.04;
        }
        this.position.x += Math.cos(this.rotation)*this.velocity;
        this.position.y += Math.sin(this.rotation)*this.velocity;
        this.distanceTraveled += this.velocity;

        this.collision();

        if (!this.isDeath) {
            this.bodyCollision();
        }
    }
    collision() {
        if(this.position.x-this.radius <= 0 ||
            this.position.x+this.radius >= canvas.width ||
            this.position.y-this.radius <= 0 ||
            this.position.y+this.radius >= canvas.height) {
                
                this.death();
            }
    }
    bodyCollision() {
        // Distance needed to avoid detecting nearby body segments
        const safeDistance = this.radius * 2;

        for (let i = 0; i < this.body.length; i++) {

            // Calculate the estimated distance behind the head
            const distanceBehind = (i + 1) * this.pathLength * this.velocity;

            // Ignore segments that are too close to the head
            if (distanceBehind <= safeDistance) {
                continue;
            }

            // Ignore segments that haven't started moving yet
            if (this.distanceTraveled < distanceBehind) {
                continue;
            }

            // Get the position of each body segment
            const segment = this.body[i];
            const position = segment.path[segment.path.length - 1];

            // Calculate the distance between the head and the segment
            const dx = this.position.x - position.x;
            const dy = this.position.y - position.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if the head touches the body
            if (distance < this.radius + segment.radius) {
                this.death();
                break;
            }
        }
    }
    death() {
        this.velocity = 0;
        this.keys.enable = false;
        this.isDeath = true;
        this.body.forEach((b)=> {
            let lastItem = b.path[b.path.length-1];
            for(let i = 0; i < b.path.length; i++){
                b.path[i] = lastItem;
            }
            b.transparency = this.transparency;
        });
    }
    drawCharacter() {
        for(let i = 1; i <= this.length; i++){
            this.drawCircle(
                this.position.x - (this.pathLength*this.velocity*i),
                this.position.y, this.radius, this.color, this.color
            );
        }
        this.drawHead();
    }
    keyboard(){
        document.addEventListener("keydown", (evt) => { //push the key
            if (evt.key == "a" || evt.key == "A") {
                this.keys.A = true;
            }
            if (evt.key == "d" || evt.key == "D") {
                this.keys.D = true;
            }
        });
        document.addEventListener("keyup", (evt) => { //release the key
            if (evt.key == "a" || evt.key == "A") {
                this.keys.A = false;
            }
            if (evt.key == "d" || evt.key == "D") {
                this.keys.D = false;
            }
        });
    }
}
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
// Pause or resume the game
function togglePause() {
    // Only pause when a game is running
    if (!play || snake.isDeath) {
        return;
    }

    paused = !paused;

    if (paused) {
        pauseButton.textContent = "RESUME";
        pauseMessage.style.display = "block";
    } else {
        pauseButton.textContent = "PAUSE";
        pauseMessage.style.display = "none";
    }
}
// Return to the character selection menu
function restartGame() {
    // Stop the current game
    play = false;

    // Reset pause controls
    paused = false;
    pauseButton.textContent = "PAUSE";
    pauseMessage.style.display = "none";

    // Reset snake movement
    snake.keys.A = false;
    snake.keys.D = false;
    snake.keys.enable = false;

    // Reset score
    scoreP = 0;
    score.textContent = scoreP;

    // Show character selection menu
    menu.style.display = "flex";
}
// Restart using the mouse
restartButton.addEventListener("click", restartGame);
// Pause using the mouse
pauseButton.addEventListener("click", togglePause);
// Keyboard controls for Pause and Restart
document.addEventListener("keydown", (evt) => {
    if (evt.repeat) {
        return;
    }
    if (evt.key === " ") { //Space key
        evt.preventDefault();
        togglePause();
    }
    if (evt.key === "Enter") {
        restartGame();
    }
});
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
