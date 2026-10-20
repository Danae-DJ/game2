// Multiplayer character selection
const multiplayerSelection = document.querySelector(".multiplayer-selection");
const playerTurn = document.getElementById("player-turn");

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
    }
}

// Multiplayer character click events
multiplayerCanvases.forEach((canvas, index) => {
    canvas.addEventListener("click", () => {
        selectMultiplayerSnake(index);
    });
});