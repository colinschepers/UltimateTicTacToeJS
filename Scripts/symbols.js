var symbols = null;
var largeSymbols = null;

class Cross {
    constructor(i, j, size) {
        this.x = (i + 0.5) * gridSize;
        this.y = (j + 0.5) * gridSize;
        this.size = size;
        this.scale = 0;
        this.rotation = 0;
        this.r = 0;
        this.g = 255;
        this.b = 0;
        this.a = 255;
    }

    draw() {
        rectMode(CENTER);
        fill(this.r, this.g, this.b, this.a);

        translate(this.x, this.y);
        rotate(this.rotation);
        scale(this.scale);

        rotate(0.25 * PI);
        rect(0, 0, this.size * crossThickness, this.size)
        rotate(0.5 * PI);
        rect(0, 0, this.size * crossThickness, this.size)
        rotate(1.25 * PI);

        scale(1 / this.scale);
        rotate(-this.rotation);
        translate(-this.x, -this.y);

        this.rotation = min(1 * PI, this.rotation + (1 / symbolAnimationSpeed) * 1 * PI);
        this.scale = min(1, this.scale + 1 * (1 / symbolAnimationSpeed));
    }
}

class Circle {
    constructor(i, j, size) {
        this.x = (i + 0.5) * gridSize;
        this.y = (j + 0.5) * gridSize;
        this.size = size;
        this.scale = 0;
        this.r = 255;
        this.g = 0;
        this.b = 0;
        this.a = 255;
    }

    draw() {
        ellipseMode(CENTER);
        fill(this.r, this.g, this.b, this.a);

        translate(this.x, this.y);
        scale(this.scale);

        circle(0, 0, this.size);
        fill(0);
        circle(0, 0, this.size * (1 - circleThickness));

        scale(1 / this.scale);
        translate(-this.x, -this.y);

        this.rotation = min(2 * PI, this.rotation + (1 / symbolAnimationSpeed) * 2 * PI);
        this.scale = min(1, this.scale + 1 * (1 / symbolAnimationSpeed));
    }
}

function drawSymbols() {
    if (!state) {
        return;
    }

    if (state.roundNr === 0) {
        symbols = Array(81)
        largeSymbols = Array(9)
    }

    updateSymbols();

    for (i = 0; i < symbols.length; i++) {
        if (!symbols[i] || symbols[i].a == 0) {
            symbols[i] = undefined;
        } else {
            symbols[i].draw();
        }
    }

    for (i = 0; i < largeSymbols.length; i++) {
        if (!largeSymbols[i] || symbols[i].a == 0) {
            largeSymbols[i] = undefined;
        } else {
            largeSymbols[i].draw();
        }
    }
}

function updateSymbols() {
    const move = state.history[state.history.length - 1];
    const boardNr = Math.floor(move / 9);

    if (symbols[move] || largeSymbols[boardNr]) {
        return;
    }

    const i = (Math.floor(move / 9) % 3) * 3 + (move % 3);
    const j = Math.floor(move / 27) * 3 + Math.floor(move / 3) % 3;

    if (state.history.length % 2 == 1) {
        symbols[move] = new Cross(i, j, symbolSize);
    } else {
        symbols[move] = new Circle(i, j, symbolSize);
    }

    const bi = Math.floor(boardNr / 3);
    const bj = boardNr % 3;

    if (state.getBoardValue(bi, bj) === undefined) {
        return;
    } else if (state.getBoardValue(bi, bj) == 0) {
        largeSymbols[boardNr] = new Cross(i, j, symbolSize * 3);
    } else if (state.getBoardValue(bi, bj) == 1) {
        largeSymbols[boardNr] = new Circle(i, j, symbolSize * 3);
    } else if (state.getBoardValue(bi, bj) == 0.5) {

    }
}