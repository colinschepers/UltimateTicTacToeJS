// Allow for multi threading using webWorkers
onmessage = function (messageEvent) {
    importScripts("State.js");
    let state = new State();
    
    state.bitBoards = [Array(10), Array(10)];
    state.counts = Array(10);
    for (let i = 0; i < 10; i++) {
        state.counts[i] = messageEvent.data[0].counts[i];
        state.bitBoards[0][i] = messageEvent.data[0].bitBoards[0][i];
        state.bitBoards[1][i] = messageEvent.data[0].bitBoards[1][i];
    }
    state.roundNr = messageEvent.data[0].board;
    state.nextBoardNr = messageEvent.data[0].nextBoardNr;
    state.drawBoard = messageEvent.data[0].drawBoard;
    state.score = stmessageEvent.data[0].score;
    state.gameOver = messageEvent.data[0].gameOver;
    state.history = messageEvent.data[0].history.slice();

    let miniMaxPlayer = new MiniMaxPlayer(messageEvent.data[1]);
    let move = miniMaxPlayer.getMove(state);
    postMessage([move]);
}

class MiniMaxPlayer {
    constructor(runningTimeInMilliseconds, depthLimit) {
        this.runningTimeInMilliseconds = runningTimeInMilliseconds || 1000;
        this.depthLimit = depthLimit || 10;
    }

    async getMove(state) {
        let timeout = Date.now() + (this.runningTimeInMilliseconds);
        let move = this.__iterativeDeepening(state, this.depthLimit, timeout);
        return move;
    }

    __iterativeDeepening(state, depthLimit, timeout) {
        let bestMove = null;
        for (let d = 1; d < depthLimit; d++) {
            let move = this.__getBestMove(state, d, timeout);
            if (Date.now() < timeout) {
                bestMove = move;
            } else {
                break;
            }
        }
        return bestMove || state.getValidMoves()[0];
    }

    __getBestMove(state, depthLimit, timeout) {
        let bestScore = -Infinity;
        let bestMove = null;
        for (let move of state.getValidMoves()) {
            var nextState = state.clone();
            nextState.play(move);

            let score = this.__getScore(nextState, 1, depthLimit, state.getPlayerToMove(), -Infinity, Infinity, timeout);

            if (score > bestScore || (score == bestScore && Math.random() < 0.5)) {
                bestScore = score;
                bestMove = move;
            }

            if (Date.now() >= timeout) {
                break;
            }
        }

        return bestMove;
    }

    __getScore(state, depth, depthLimit, maxPlayerNr, alpha, beta, timeout) {

        if (state.isGameOver || depth > depthLimit || Date.now() >= timeout) {
            return maxPlayerNr == 0 ? state.score : 1 - state.score;
        }

        let bestScore = null;

        if (state.getPlayerToMove() == maxPlayerNr) {
            bestScore = -Infinity;
            for (let move of state.getValidMoves()) {
                let nextState = state.clone();
                nextState.play(move);

                let score = this.__getScore(nextState, depth + 1, depthLimit, maxPlayerNr, alpha, beta);
                bestScore = Math.max(bestScore, score);
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) {
                    break;
                }
            }
        } else {
            bestScore = Infinity;
            for (let move of state.getValidMoves()) {
                let nextState = state.clone();
                nextState.play(move);

                let score = this.__getScore(nextState, depth + 1, depthLimit, maxPlayerNr, alpha, beta);
                bestScore = Math.min(bestScore, score);
                alpha = Math.min(beta, bestScore);
                if (beta <= alpha) {
                    break;
                }
            }
        }

        return bestScore - (depth * 0.001);
    }
}