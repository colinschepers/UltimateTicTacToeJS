var symbols = null;
var largeSymbols = null;

class GameSymbol {
    constructor(i, j, size) {
        this.x = (i + 0.5) * gridSize;
        this.y = (j + 0.5) * gridSize;
        this.size = size;
        this.scale = 0;
        this.rotation = 0;
        this.r = 255;
        this.g = 255;
        this.b = 255;
        this.a = 255;
        this.animationSpeed = symbolAnimationSpeed;
        this.isVisible = true;
        this.isDimmed = false;
        this.isJumping = false;
    }

    draw() {
        rectMode(CENTER);
        fill(this.r, this.g, this.b, this.a);

        this.rotation = min(PI, this.rotation + this.animationSpeed * PI);
        this.scale = min(1, this.scale + this.animationSpeed);

        if (this.isJumping) {
            this.scale = 1 + (0.1 * sin(frameCount / 15));
        }

        if (!this.isVisible) {
            this.a = max(0, this.a - this.animationSpeed * 100);
        } else if (this.isDimmed) {
            this.a = max(50, this.a - this.animationSpeed * 100);
        } else {
            this.a = min(255, this.a + this.animationSpeed * 100);
        }
    }
}

class Cross extends GameSymbol {
    constructor(i, j, size) {
        super(i, j, size);
        this.r = 0;
        this.g = 255;
        this.b = 0;
        this.a = 255;
    }

    draw() {
        super.draw();

        translate(this.x, this.y);
        rotate(this.rotation);
        scale(this.scale);

        let firstDis = pythagorean(this.size * crossThickness / 2);
        let longDis = (this.size / 2 - this.size * crossThickness / 2) / Math.sqrt(2);
        let shortDis = (this.size * crossThickness) / Math.sqrt(2);

        beginShape();
        vertex(0, firstDis);
        vertex(longDis, firstDis + longDis);
        vertex(longDis + shortDis, firstDis + longDis - shortDis);
        vertex(firstDis, 0);
        vertex(firstDis + longDis, -firstDis - longDis + shortDis);
        vertex(longDis, -firstDis - longDis);
        vertex(0, -firstDis);
        vertex(-longDis, -firstDis - longDis);
        vertex(-longDis - shortDis, -firstDis - longDis + shortDis);
        vertex(-firstDis, 0);
        vertex(-firstDis - longDis, firstDis + longDis - shortDis);
        vertex(-longDis, firstDis + longDis);
        endShape(CLOSE);

        scale(1 / this.scale);
        rotate(-this.rotation);
        translate(-this.x, -this.y);
    }
}

class Circle extends GameSymbol {
    constructor(i, j, size) {
        super(i, j, size);
        this.r = 255;
        this.g = 0;
        this.b = 0;
        this.a = 255;
    }

    draw() {
        super.draw();

        translate(this.x, this.y);
        scale(this.scale);

        circle(0, 0, this.size);
        fill(0);
        circle(0, 0, this.size * (1 - circleThickness));

        scale(1 / this.scale);
        translate(-this.x, -this.y);
    }
}

function drawSymbols() {
    if (!state) {
        return;
    }

    if (state.roundNr === 0) {
        symbols = Array(9);
        for (let i = 0; i < 9; i++) {
            symbols[i] = Array(9);
        }
        largeSymbols = Array(9)
    }

    updateSymbols();

    for (let boardNr = 0; boardNr < 9; boardNr++) {
        for (let moveNr = 0; moveNr < 9; moveNr++) {
            if (symbols[boardNr][moveNr]) {
                symbols[boardNr][moveNr].draw();
            }
        }
    }

    for (let boardNr = 0; boardNr < 9; boardNr++) {
        if (largeSymbols[boardNr]) {
            largeSymbols[boardNr].draw();
        }
    }
}

function updateSymbols() {
    if (!state.history || state.history.length === 0) {
        return;
    }

    const move = state.history[state.history.length - 1];
    const boardNr = Math.floor(move / 9);
    const moveNr = move % 9;

    if (symbols[boardNr][moveNr]) {
        return;
    }

    // add the small symbol
    let i = (Math.floor(move / 9) % 3) * 3 + (move % 3);
    let j = Math.floor(move / 27) * 3 + Math.floor(move / 3) % 3;
    if (state.history.length % 2 == 1) {
        symbols[boardNr][moveNr] = new Cross(i, j, symbolSize);
    } else {
        symbols[boardNr][moveNr] = new Circle(i, j, symbolSize);
    }

    // check to add big symbol
    const boardValue = state.getBoardValue(boardNr);
    i = 1 + (boardNr % 3) * 3;
    j = 1 + (Math.floor(boardNr / 3)) * 3;
    if (boardValue == 0) {
        largeSymbols[boardNr] = new Cross(i, j, symbolSize * 3);
    } else if (boardValue == 1) {
        largeSymbols[boardNr] = new Circle(i, j, symbolSize * 3);
    }

    // start fading out small symbols
    if (boardValue !== undefined) {
        for (let i = 0; i < 9; i++) {
            if (symbols[boardNr][i]) {
                symbols[boardNr][i].isVisible = false;
            }
        }
    }

    // fade out symbols not on the next board
    for (let b = 0; b < 9; b++) {
        for (let m = 0; m < 9; m++) {
            if (symbols[b][m]) {
                symbols[b][m].isDimmed = state.nextBoardNr !== b;
            }
        }
    }

    // make winning animation
    if (state.isGameOver) {

        let anyLine = false;
        let lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        // check for the winning line
        for (let line of lines) {
            let s1 = largeSymbols[line[0]];
            let s2 = largeSymbols[line[1]];
            let s3 = largeSymbols[line[2]];
            if (s1 && s2 && s3 && s1.constructor.name == s2.constructor.name &&
                s2.constructor.name == s3.constructor.name) {
                s1.isJumping = true;
                s2.isJumping = true;
                s3.isJumping = true;
                anyLine = true;
            }
        }

        // check for win by winning more small boards
        if (!anyLine && state.score != 0.5) {
            for (let largeSymbol of largeSymbols) {
                if (!largeSymbol) {
                    continue;
                } else if (largeSymbol.constructor.name === 'Cross' && state.score === 1) {
                    largeSymbol.isJumping = true;
                } else if (largeSymbol.constructor.name === 'Circle' && state.score === 0) {
                    largeSymbol.isJumping = true;
                }
            }
        }
    }
}

function pythagorean(a) {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(a, 2));
}