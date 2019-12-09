// Allow for multi threading using webWorkers
onmessage = function (messageEvent) {
    importScripts("state.js");
    let state = new State();

    state.bitBoards = [Array(10), Array(10)];
    state.counts = Array(10);
    for (let i = 0; i < 10; i++) {
        state.counts[i] = messageEvent.data[0].counts[i];
        state.bitBoards[0][i] = messageEvent.data[0].bitBoards[0][i];
        state.bitBoards[1][i] = messageEvent.data[0].bitBoards[1][i];
    }
    state.roundNr = messageEvent.data[0].roundNr;
    state.nextBoardNr = messageEvent.data[0].nextBoardNr;
    state.drawBitBoard = messageEvent.data[0].drawBitBoard;
    state.score = messageEvent.data[0].score;
    state.isGameOver = messageEvent.data[0].isGameOver;
    state.history = messageEvent.data[0].history.slice();

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