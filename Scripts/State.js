class State {
    constructor() {
        this.bitBoards = [0, 0];
        this.roundNr = 0;
        this.score = 0.5;
        this.isGameOver = false;
        this.history = [];
        this.board = [
            [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1]
        ]
    }

    play(move) {
        if (typeof move === 'undefined' || !this.isValid(move)) {
            console.error("Invalid move: " + move);
        }

        let player = this.roundNr & 1;
        this.board[move % 9][Math.floor(move / 9)] = player;
        this.history.push(move);

        this.roundNr++;

        if(this.roundNr >= 3) {
            this.isGameOver = true;
        }
    }

    isValid(move) {
        return move >= 0 && move < 81 && this.board[move % 9][Math.floor(move / 9)] == -1;
    }

    getValidMoves() {
        return [];
    }

    getPlayerToMove() {
        return this.roundNr & 1;
    }

    get2DBoard() {
        return this.board;
    }

    clone() {
        let state = new State();
        state.copyPosition(this);
        return state;
    }

    copyPosition(state) {
        this.score = state.score;
        this.roundNr = state.roundNr;
        this.gameOver = state.gameOver;
        this.history = state.history.slice();
    }
}