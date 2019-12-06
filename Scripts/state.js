class State {
    constructor() {
        this.board = Array(9 * 9).fill(-1);
        this.roundNr = 0;
        this.score = 0.5;
        this.isGameOver = false;
        this.history = [];
    }

    play(move) {
        if (typeof move === 'undefined' || !this.isValid(move)) {
            console.error("Invalid move: " + move);
            this.isGameOver = true;
            return;
        }

        let player = this.roundNr & 1;
        this.board[move] = player;
        this.history.push(move);

        this.roundNr++;

        if (this.roundNr >= 81) {
            this.isGameOver = true;
        }
    }

    isValid(move) {
        return move >= 0 && move < 81 && this.board[move] == -1;
    }

    getValidMoves() {
        const moves = [];
        for (let i = 0; i < 81; i++) {
            if (this.board[i] === -1) {
                moves.push(i);
            }
        }
        return moves;
    }

    getPlayerToMove() {
        return this.roundNr & 1;
    }

    get2DBoard() {
        const board2D = Array(9).fill(Array(9));
        for (let i = 0; i < 81; i++) {
            board2D[i % 9][Math.floor(i / 9)] = this.board[i];
        }
        return board2D;
    }

    clone() {
        let state = new State();
        state.copyPosition(this);
        return state;
    }

    copyPosition(state) {
        this.board = state.board.slice();
        this.roundNr = state.roundNr;
        this.score = state.score;
        this.gameOver = state.gameOver;
        this.history = state.history.slice();
    }
}