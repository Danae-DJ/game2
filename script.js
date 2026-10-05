const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// Set canvas dimensions
canvas.width = 650;
canvas.height = 380;

class Snake {
    constructor(position, radius, color, velocity, context) {
        this.position = position;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.context = context;
        this.rotation = 0;
        this.keys = {
            A: false,
            D: false,
        }
        this.keyboard();
    }
    drawCircle(x, y, radius, color) {
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, 2*Math.PI); //the angle is in radians
        this.context.fillStyle = color;
        this.context.fill();
        this.context.closePath();
    }
    drawHead(){
        this.drawCircle(this.position.x, this.position.y, this.radius, this.color);
        // Draw the eyes
        this.drawCircle(this.position.x, this.position.y-9, this.radius-4, "white");
        this.drawCircle(this.position.x+1, this.position.y-9, this.radius-6, "black");
        this.drawCircle(this.position.x+3, this.position.y-8, this.radius-9, "white");

        this.drawCircle(this.position.x, this.position.y+9, this.radius-4, "white");
        this.drawCircle(this.position.x+1, this.position.y+9, this.radius-6, "black");
        this.drawCircle(this.position.x+3, this.position.y+8, this.radius-9, "white");
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
        this.draw();
        if (this.keys.A) {
            this.rotation -= 0.04;
        }
        if (this.keys.D) {
            this.rotation += 0.04;
        }
        this.position.x += Math.cos(this.rotation)*this.velocity;
        this.position.y += Math.sin(this.rotation)*this.velocity;
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
const snake = new Snake({x:200, y:200}, 11, "#feba39",1.5, ctx);

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
// rotation loop to smoothly rotate the snake head when pressing A or D keys
function update() {
    background();
    snake.update();

    requestAnimationFrame(update);
}
update();
