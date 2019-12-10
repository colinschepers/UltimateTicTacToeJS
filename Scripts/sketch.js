var players = [undefined, undefined];
var state = null;
var awaitingMove = false;
var menuEnabled = true;
var startTime = Date.now();
var moveDelay = 100;

function setup() {
    createCanvas(size, size);
    //newGame();
}

function draw() {
    noStroke();
    background(0);
    checkState();
    drawFrame();
    drawSymbols();
    drawMenu();
}

function newGame() {
    state = new State();
    awaitingMove = false;
}

function checkState() {
    if (state && !state.isGameOver && !awaitingMove) {
        startTime = Date.now();
        awaitingMove = true;
        let player = players[state.getPlayerToMove()];
        if (player && player.constructor.name !== 'HumanPlayer') { 
            player.getMove(state, applyMove);
        }
    }
}

function applyMove(move) {
    let timeLeft = moveDelay - (Date.now() - startTime);
    setTimeout(function () {
        try { 
            state.play(move);
        } catch (error) { 
            console.error("Invalid move: " + move); 
        }
        awaitingMove = false;
    }, max(0, timeLeft));
}

function checkHumanPlayersClicked() {
    if (state && !state.isGameOver) {
        const player = players[state.getPlayerToMove()];
        if (player && player.constructor.name === 'HumanPlayer') { 
            player.getMove(state, applyMove);
        }
    }
}

function mouseClicked() {
    checkHumanPlayersClicked();
    checkMenuItemsClicked();
}

