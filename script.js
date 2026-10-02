const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// Set canvas dimensions
canvas.width = 650;
canvas.height = 380;

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
background();