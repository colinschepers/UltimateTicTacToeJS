var symbols = []

function drawSymbols() {
    if (!state) {
        return;
    }
    if (state.roundNr === 0) {
        symbols = []
    }
    for (let i = symbols.length; i < state.history.length; i++) {
        let symbol = i % 2 == 0 ? new Cross(state.history[i]) : new Circle(state.history[i]);
        symbols.push(symbol);
    }
    for (let symbol of symbols) {
        symbol.draw();
    }
}

class Cross {
    constructor(boardPosition) {
        this.x = (boardPosition % 9 + 0.5) * gridSize;
        this.y = (Math.floor(boardPosition / 9) + 0.5) * gridSize;
        this.rotation = 0;
        this.scale = 0;
    }

    draw() {
        rectMode(CENTER);
        fill(0, 255, 0);

        translate(this.x, this.y);
        rotate(this.rotation);
        scale(this.scale);

        rotate(0.25 * PI);
        rect(0, 0, symbolSize * crossThickness, symbolSize)
        rotate(0.5 * PI);
        rect(0, 0, symbolSize * crossThickness, symbolSize)
        rotate(1.25 * PI);

        scale(1 / this.scale);
        rotate(-this.rotation);
        translate(-this.x, -this.y);

        this.rotation = min(1 * PI, this.rotation + symbolAnimationLength * 1 * PI);
        this.scale = min(1, this.scale + 1 * symbolAnimationLength);
    }
}

class Circle {
    constructor(boardPosition) {
        this.x = (boardPosition % 9 + 0.5) * gridSize;
        this.y = (Math.floor(boardPosition / 9) + 0.5) * gridSize;
        this.scale = 0;
    }

    draw() {
        ellipseMode(CENTER);
        fill(255, 0, 0);

        translate(this.x, this.y);
        scale(this.scale);

        circle(0, 0, symbolSize);
        fill(0);
        circle(0, 0, symbolSize * (1 - circleThickness));

        scale(1 / this.scale);
        translate(-this.x, -this.y);

        this.rotation = min(2 * PI, this.rotation + symbolAnimationLength * 2 * PI);
        this.scale = min(1, this.scale + 1 * symbolAnimationLength);
    }
}