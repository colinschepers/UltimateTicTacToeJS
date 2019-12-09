var symbols = null;
var largeSymbols = null;

class Cross {
    constructor(i, j, size, animationSpeed) {
        this.x = (i + 0.5) * gridSize;
        this.y = (j + 0.5) * gridSize;
        this.size = size;
        this.animationSpeed = animationSpeed;
        this.scale = 0;
        this.rotation = 0;
        this.r = 0;
        this.g = 255;
        this.b = 0;
        this.a = 255;
        this.isVisible = true;
        this.isDimmed = false;
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

        this.rotation = min(PI, this.rotation + this.animationSpeed * PI);
        this.scale = min(1, this.scale + this.animationSpeed);

        if(!this.isVisible) {
            this.a = max(0, this.a - this.animationSpeed * 1);
        } else if(this.isDimmed) {
            this.a = max(100, this.a - this.animationSpeed * 100);
        } else {
            this.a = min(255, this.a + this.animationSpeed * 100);
        }
    }
}

class Circle {
    constructor(i, j, size, animationSpeed) {
        this.x = (i + 0.5) * gridSize;
        this.y = (j + 0.5) * gridSize;
        this.size = size;
        this.animationSpeed = animationSpeed;
        this.scale = 0;
        this.r = 255;
        this.g = 0;
        this.b = 0;
        this.a = 255;
        this.isVisible = true;
        this.isDimmed = false;
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

        this.scale = min(1, this.scale + this.animationSpeed);
        
        if(!this.isVisible) {
            this.a = max(0, this.a - this.animationSpeed * 1);
        } else if(this.isDimmed) {
            this.a = max(100, this.a - this.animationSpeed * 100);
        } else {
            this.a = min(255, this.a + this.animationSpeed * 100);
        }
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
    if(!state.history || state.history.length === 0) {
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
        symbols[boardNr][moveNr] = new Cross(i, j, symbolSize, symbolAnimationSpeed);
    } else {
        symbols[boardNr][moveNr] = new Circle(i, j, symbolSize, symbolAnimationSpeed);
    }

    // check to add big symbol
    const boardValue = state.getBoardValue(boardNr);
    i = 1 + (boardNr % 3) * 3;
    j = 1 + (Math.floor(boardNr / 3)) * 3;
    if (boardValue == 0) {
        largeSymbols[boardNr] = new Cross(i, j, symbolSize * 3, symbolAnimationSpeed * 3);
    } else if (boardValue == 1) {
        largeSymbols[boardNr] = new Circle(i, j, symbolSize * 3, symbolAnimationSpeed * 3);
    }

    // start fading out small symbols
    if(boardValue !== undefined) {
        for (let i = 0; i < 9; i++) {
            if (symbols[boardNr][i]) {
                symbols[boardNr][i].isVisible = true;
            }
        }
    }

    // fade out symbols not on the next board
    for (let b = 0; b < 9; b++) {
        for (let m = 0; m < 9; m++) {
            if (symbols[b][m]) {
                symbols[b][m].isDimmed = state.nextBoardNr !== i;
            }
        }
    }
}