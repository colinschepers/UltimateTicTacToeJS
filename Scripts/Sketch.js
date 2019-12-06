const size = 600;
const barRadius = size / 100;
const gridSize = size / 9;
const gridSizeXL = size / 3;
const moveTimeInMilliseconds = 250;

var players = [new HumanPlayer(), new HumanPlayer()];
var state = null;
var awaitingMove = false;
var menuEnabled = true;

function setup() {
    createCanvas(size, size);
    //frameRate(25);

    newGame();
}

function draw() {
    noStroke();
    background(0);
    checkState();
    drawStars();
    drawFrame();
    drawSymbols();
    drawMenu();
    //orbitControl();
}

function newGame() {
    state = new State();
    awaitingMove = false;
    rotation = 0;
    menuEnabled = false;
}

function checkState() {
    if (state && !state.isGameOver) {
        if (!awaitingMove) {
            getMove();
        }
    } else {
        gameOver();
    }
}

function getMove() {
    awaitingMove = true;

    let player = players[state.getPlayerToMove()];
    if (player && player.constructor.name != 'HumanPlayer') {
        let startTime = Date.now();
        try {
            const worker = new Worker(`Scripts/${player.constructor.name}.js`);
            worker.onmessage = function (messageEvent) {
                applyMove(messageEvent.data[0], startTime);
            }
            worker.onerror = function (error) {
                console.error(error);
                applyMove(player.getMove(state), startTime);
            };
            worker.postMessage([state, moveTimeInMilliseconds]);
        } catch (error) {
            console.error(error);
            applyMove(player.getMove(state), startTime);
        }
    }
}

function applyMove(move, startTime) {
    let timeLeft = moveTimeInMilliseconds - (Date.now() - startTime);
    setTimeout(function () {
        state.play(move);
        awaitingMove = false;
    }, max(0, timeLeft));
}

function gameOver() {
    if (false) {
        // do some winning animation
    } else if (!menuEnabled) {
        menuEnabled = true;
    }
}

function mouseReleased() {
    if (state && !state.isGameOver) {
        var player = players[state.getPlayerToMove()];
        if (player.constructor.name === 'HumanPlayer') {
            let x = Math.floor(mouseX / (width / 9));
            let y = Math.floor(mouseY / (height / 9));
            let move = y * 9 + x;
            if (x >= 0 && x < 9 && y >= 0 && y < 9 && state.isValid(move)) {
                state.play(move);
                awaitingMove = false;
            }
        }
    } else if (menuEnabled) {
        let x = Math.floor(mouseX / (width / 3));
        let y = Math.floor(mouseY / (height / 3));
        if (x >= 0 && x < 3 && y >= 0 && y < 3) {
            if (x == 0) {
                players[0] = new HumanPlayer();
            } else if (x == 1) {
                players[0] = new RandomPlayer();
            } else if (x == 2) {
                players[0] = new MCTSPlayer(moveTimeInMilliseconds);
            }
            if (y == 0) {
                players[1] = new HumanPlayer();
            } else if (y == 1) {
                players[1] = new RandomPlayer();
            } else if (y == 2) {
                players[1] = new MCTSPlayer(moveTimeInMilliseconds);
            }
            newGame();
        }
    }
}