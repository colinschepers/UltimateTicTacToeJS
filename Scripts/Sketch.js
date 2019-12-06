var players = [new HumanPlayer(), new HumanPlayer()];
var state = null;
var awaitingMove = false;
var menuEnabled = true;

function setup() {
    createCanvas(size, size);
    frameRate(50);
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
}

function newGame() {
    state = new State();
    awaitingMove = false;

    console.log(players[0]);
    console.log(players[1]);
}

function checkState() {
    if (!state.isGameOver && !awaitingMove) {
        getMove();
    }
}

function getMove() {
    awaitingMove = true;

    const player = players[state.getPlayerToMove()];
    if (state && player && player.constructor.name != 'HumanPlayer') {
        let startTime = Date.now();
        try {
            const scriptName = player.constructor.name[0].toUpperCase() +  player.constructor.name.slice(1);
            const worker = new Worker(`Scripts/${scriptName}.js`);
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

function mousePressed() {
    if (state && !state.isGameOver) {
        const player = players[state.getPlayerToMove()];
        if (player && player.constructor.name === 'HumanPlayer') {
            let x = Math.floor(mouseX / (width / 9));
            let y = Math.floor(mouseY / (height / 9));
            let move = y * 9 + x;
            if (x >= 0 && x < 9 && y >= 0 && y < 9) {
                if(!state.isValid(move)) {
                    console.log('Invalid Move!');
                    return;
                }
                state.play(move);
                awaitingMove = false;
            }
        }
    }

    checkMenuItemsClicked();
}