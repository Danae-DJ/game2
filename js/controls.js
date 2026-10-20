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
// Show the game mode selection screen
function showModeSelection() {
    modeSelection.style.display = "flex";
    characterSelection.style.display = "none";
    multiplayerSelection.style.display = "none";
    menu.style.display = "flex";
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

    // Return to the game mode selection screen
    showModeSelection();
}

// Restart using the mouse
restartButton.addEventListener("click", restartGame);
// Pause using the mouse
pauseButton.addEventListener("click", togglePause);

// Select single-player mode
onePlayerButton.addEventListener("click", () => {
    modeSelection.style.display = "none";
    characterSelection.style.display = "flex";
});

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
        evt.preventDefault();
        restartGame();
    }
});
