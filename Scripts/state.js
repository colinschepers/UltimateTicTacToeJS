class State {
    constructor() {
        this.roundNr = 0;
        this.bitBoards = [Array(10).fill(0), Array(10).fill(0)];
        this.counts = Array(10).fill(0);
        this.nextBoardNr = 9;
        this.drawBitBoard = 0;
        this.score = 0;
        this.isGameOver = false;
        this.history = [];
    }

    play(move) {
        if (typeof move === 'undefined' || !this.isValid(move)) {
            console.error("Invalid move: " + move);
            this.isGameOver = true;
            return;
        }

        const player = this.getPlayerToMove();
        const boardNr = Math.floor(move / 9);
        const moveNr = move % 9;

        this.bitBoards[player][boardNr] |= State.bitMove[moveNr];
        this.counts[boardNr]++;
        this.nextBoardNr = moveNr;

        if (this.__isLine(this.bitBoards[player][boardNr])) {
            // line on small board
            this.bitBoards[player][9] |= State.bitMove[boardNr];
            this.counts[9]++;
            this.score += player - 0.5;

            if (this.__isLine(this.bitBoards[player][9])) {
                // line on the large board
                this.isGameOver = true;
                this.score = 1 - player;
            } else if (this.counts[9] === 9) {
                // all 9 small boards are filled
                this.isGameOver = true;

                // calculate score based on most boards won
                if (this.score < 0) {
                    this.score = 1;
                } else if (this.score > 0) {
                    this.score = 0;
                } else {
                    this.score = 0.5;
                }
            }
        } else if (this.counts[boardNr] == 9) {
            // small board full; draw
            this.drawBitBoard |= State.bitMove[boardNr];
            this.counts[9]++;

            if (this.counts[9] === 9) {
                // all 9 small boards are filled
                this.isGameOver = true;

                // calculate score based on most boards won
                if (this.score < 0) {
                    this.score = 1;
                } else if (this.score > 0) {
                    this.score = 0;
                } else {
                    this.score = 0.5;
                }
            }
        }

        // if next board is full or won; next player can choose board
        if (this.counts[this.nextBoardNr] === 9 ||
            (this.__getMergedBoard(9) & State.bitMove[this.nextBoardNr]) != 0) {
            this.nextBoardNr = 9;
        }

        this.roundNr++;
        this.history.push(move);
    }

    isValid(move) {
        // check for out of bounds
        if (move < 0 && move >= 81) {
            return false;
        }

        // check if player is allowed to play on this board
        const boardNr = Math.floor(move / 9);
        if (this.nextBoardNr != 9 && boardNr != this.nextBoardNr) {
            return false;
        }

        // check if location on board is empty
        const moveNr = move % 9;
        if ((this.__getMergedBoard(boardNr) & State.bitMove[moveNr]) != 0) {
            return false;
        }

        return true;
    }

    getValidMoves() {
        let mergedBoard = this.__getMergedBoard(this.nextBoardNr);

        if (this.nextBoardNr == 9) {
            let moves = [];
            const possibleBoardNrs = State.moves[0][mergedBoard];
            for (let boardNr of possibleBoardNrs) {
                mergedBoard = this.__getMergedBoard(boardNr);
                moves = moves.concat(State.moves[boardNr][mergedBoard]);
            }
            return moves;
        }

        return State.moves[this.nextBoardNr][mergedBoard];
    }

    getPlayerToMove() {
        return this.roundNr & 1;
    }

    getBoardValue(boardNr) {
        if ((this.bitBoards[0][9] & (1 << boardNr)) != 0) {
            return 0;
        } else if ((this.bitBoards[1][9] & (1 << boardNr)) != 0) {
            return 1;
        } else if ((this.drawBitBoard & (1 << boardNr)) != 0) {
            return 0.5;
        }
        return undefined;
    }

    clone() {
        let state = new State();
        state.copyPosition(this);
        return state;
    }

    copyPosition(state) {
        this.bitBoards = [Array(10), Array(10)];
        this.counts = Array(10);
        for (let i = 0; i < 10; i++) {
            this.counts[i] = state.counts[i];
            this.bitBoards[0][i] = state.bitBoards[0][i];
            this.bitBoards[1][i] = state.bitBoards[1][i];
        }
        this.roundNr = state.roundNr;
        this.nextBoardNr = state.nextBoardNr;
        this.drawBitBoard = state.drawBitBoard;
        this.score = state.score;
        this.isGameOver = state.isGameOver;
        this.history = state.history.slice();
    }

    __isLine(bitBoard) {
        return (bitBoard & (bitBoard >> 1) & (bitBoard >> 2) & State.lineFilter) != 0;
    }

    __getMergedBoard(boardNr) {
        if (boardNr == 9) {
            return (this.bitBoards[0][boardNr] | this.bitBoards[1][boardNr] | this.drawBitBoard) & 0b111111111;
        }
        return (this.bitBoards[0][boardNr] | this.bitBoards[1][boardNr]) & 0b111111111;
    }
}

State.bitMove = [
    0b000001000000001000000001,
    0b000000000001000000000010,
    0b001000001000000000000100,
    0b000000000000010000001000,
    0b010010000010000000010000,
    0b000000010000000000100000,
    0b100000000000100001000000,
    0b000000000100000010000000,
    0b000100100000000100000000
];

State.lineFilter = 0b001001001001001001001001;

State.moves = [];

for (let b = 0; b < 9; b++) {
    let movesForBoard = [];
    for (let i = 0; i < 0b1000000000; i++) {
        let movesForPosition = [];
        for (let x = 0; x < 9; x++) {
            if ((i & (1 << x)) == 0) {
                movesForPosition.push(b * 9 + x);
            }
        }
        movesForBoard.push(movesForPosition);
    }
    State.moves.push(movesForBoard);
}