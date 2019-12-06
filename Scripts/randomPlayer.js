// Allow for multi threading using webWorkers
onmessage = function (messageEvent) {
    importScripts("State.js");
    let state = new State();
    state.board = messageEvent.data[0].board;
    state.score = messageEvent.data[0].score;
    state.roundNr = messageEvent.data[0].roundNr;
    state.gameOver = messageEvent.data[0].gameOver;
    let randomPlayer = new RandomPlayer();
    let move = randomPlayer.getMove(state);
    postMessage([move]);
}

class RandomPlayer {
    getMove(state) {
        let moves = state.getValidMoves();
        let randomNr = Math.floor((Math.random() * moves.length));
        let move = moves[randomNr];
        return move;
    }
}