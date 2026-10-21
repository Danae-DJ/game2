// Multiplayer character selection
const multiplayerSelection = document.querySelector(".multiplayer-selection");
const playerTurn = document.getElementById("player-turn");

// Multiplayer game boards
const multiplayerBoards = document.querySelector(".multiplayer-boards");

const player1Canvas = document.getElementById("canvas-player1");
const player2Canvas = document.getElementById("canvas-player2");

// Canvas contexts
const player1Ctx = player1Canvas.getContext("2d");
const player2Ctx = player2Canvas.getContext("2d");

// Player scores
const player1Score = document.getElementById("score-player1");
const player2Score = document.getElementById("score-player2");

// Multiplayer board dimensions
player1Canvas.width = 400;
player1Canvas.height = 380;

player2Canvas.width = 400;
player2Canvas.height = 380;

// Multiplayer character canvases
const multiplayerCanvases = [
    document.getElementById("snake-3"),
    document.getElementById("snake-4"),
    document.getElementById("snake-5"),
    document.getElementById("snake-6")
];

// Set the size of each character preview
multiplayerCanvases.forEach((canvas) => {
    canvas.width = 190;
    canvas.height = 80;
});

// Multiplayer snake options
const multiplayerOptions = [
    { color: "#feba39", length: 3, pathLength: 12 },
    { color: "#88fc03", length: 8, pathLength: 4 },
    { color: "#39b8fe", length: 3, pathLength: 12 },
    { color: "#c77dff", length: 8, pathLength: 4 }
];

// Multiplayer character selection
let currentPlayer = 1;

let player1Choice = null;
let player2Choice = null;

// Multiplayer snakes
let player1Snake = null;
let player2Snake = null;

// Draw multiplayer character previews
multiplayerCanvases.forEach((canvas, index) => {

    const context = canvas.getContext("2d");
    const option = multiplayerOptions[index];

    const previewSnake = new Snake(
        { x: 165, y: 40 },
        11,
        option.color,
        1.5,
        option.length === 3 ? 8 : 24,
        option.pathLength,
        context
    );

    previewSnake.initBody();
    previewSnake.drawCharacter();
});  

// Show multiplayer character selection
function showMultiplayerSelection() {
    // Reset previous selections
    currentPlayer = 1;
    player1Choice = null;
    player2Choice = null;

    // Show multiplayer menu
    modeSelection.style.display = "none";
    characterSelection.style.display = "none";
    multiplayerSelection.style.display = "flex";

    playerTurn.textContent = "PLAYER 1 - SELECT YOUR SNAKE";
}

// Select two-player mode
twoPlayersButton.addEventListener("click", showMultiplayerSelection);

// Select a snake for each player
function selectMultiplayerSnake(index) {
    const selectedSnake = multiplayerOptions[index];

    if (currentPlayer === 1) {
        // Save Player 1 selection
        player1Choice = selectedSnake;

        // Move to Player 2
        currentPlayer = 2;
        playerTurn.textContent = "PLAYER 2 - SELECT YOUR SNAKE";

    } else if (currentPlayer === 2) {

        // Prevent choosing the same snake
        if (selectedSnake === player1Choice) {
            return;
        }

        // Save Player 2 selection
        player2Choice = selectedSnake;

        // Both players have selected their characters
        currentPlayer = 0;
        playerTurn.textContent = "BOTH PLAYERS READY!";

        //Start the multiplayer screen
        showMultiplayerBoards();
    }
}

// Multiplayer character click events
multiplayerCanvases.forEach((canvas, index) => {
    canvas.addEventListener("click", () => {
        selectMultiplayerSnake(index);
    });
});

// Create multiplayer snakes
function createMultiplayerSnakes() {

    // Player 1
    player1Snake = new Snake(
        { x: 100, y: 190 },
        11,
        player1Choice.color,
        1.5,
        player1Choice.length,
        player1Choice.pathLength,
        player1Ctx
    );

    player1Snake.initBody();

    // Player 2
    player2Snake = new Snake(
        { x: 100, y: 190 },
        11,
        player2Choice.color,
        1.5,
        player2Choice.length,
        player2Choice.pathLength,
        player2Ctx
    );

    player2Snake.initBody();
} 

// Show multiplayer game boards
function showMultiplayerBoards() {
    // Hide the single-player board
    document.querySelector(".game-board").style.display = "none";

    // Hide the menu
    menu.style.display = "none";

    // Show multiplayer boards
    multiplayerBoards.style.display = "flex";

    // Reset player scores
    player1Score.textContent = "0";
    player2Score.textContent = "0";
}