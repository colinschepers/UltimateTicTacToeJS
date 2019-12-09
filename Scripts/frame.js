var frameLargeElements = null;
var frameSmallElements = null;

class FrameElement {
    constructor(x, y, width, height, r, g, b) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = 255;
        this.isVisible = true;
        this.isDimmed = false;
    }

    draw() {
        fill(this.r, this.g, this.b, this.a);
        rect(this.x, this.y, this.width, this.height);

        if (!this.isVisible) {
            this.a = max(0, this.a - frameAnimationSpeed * 10);
        } else if (this.isDimmed) {
            this.a = max(50, this.a - frameAnimationSpeed * 10);
        } else {
            this.a = min(255, this.a + frameAnimationSpeed * 10);
        }
    }
}

function drawFrame() {
    if (!frameLargeElements) {
        frameLargeElements = createLargeFrameElements();
    }
    if (!frameSmallElements || (state && state.roundNr == 0)) {
        frameSmallElements = createSmallFrameElements();
    }

    if (state) {
        updateSmallFrameElements();
    }

    rectMode(CORNER);

    for (let frameElement of frameLargeElements) {
        frameElement.draw();
    }

    for (let boardNr = 0; boardNr < 9; boardNr++) {
        for (let frameElement of frameSmallElements[boardNr]) {
            frameElement.draw();
        }
    }
}

function createLargeFrameElements() {
    const elements = [];
    for (i = 1; i < 3; i++) {
        let x = i * gridSizeXL - frameThickness / 2;
        let y = size * ((1 - frameCoverageXL) / 2);
        let w = frameThickness;
        let h = size * frameCoverageXL;
        elements.push(new FrameElement(x, y, w, h, 0, 150, 200, 255));
        elements.push(new FrameElement(y, x, h, w, 0, 150, 200, 255));
    }
    return elements;
}

function createSmallFrameElements() {
    const elements = Array(9);
    for (let boardNr = 0; boardNr < 9; boardNr++) {
        const elementsForBoard = []
        let i = boardNr % 3;
        let j = Math.floor(boardNr / 3);
        for (k = 1; k < 3; k++) {
            let x = i * gridSizeXL + k * gridSize - frameThickness / 2;
            let y = j * gridSizeXL + gridSizeXL * ((1 - frameCoverage) / 2);
            elementsForBoard.push(new FrameElement(x, y, frameThickness, gridSizeXL * frameCoverage, 0, 150, 200));
        }
        for (k = 1; k < 3; k++) {
            let x = i * gridSizeXL + gridSizeXL * ((1 - frameCoverage) / 2);
            let y = j * gridSizeXL + k * gridSize - frameThickness / 2;
            elementsForBoard.push(new FrameElement(x, y, gridSizeXL * frameCoverage, frameThickness, 0, 150, 200));
        }
        elements[boardNr] = elementsForBoard;
    }
    return elements;
}

function updateSmallFrameElements() {
    if (!state.history || state.history.length === 0) {
        return;
    }

    const move = state.history[state.history.length - 1];
    const boardNr = Math.floor(move / 9);
    const boardValue = state.getBoardValue(boardNr);

    if (boardValue !== undefined) {
        for (k = 0; k < 4; k++) {
            frameSmallElements[boardNr][k].isVisible = false;
        }
    }

    for (let i = 0; i < 9; i++) {
        for (k = 0; k < 4; k++) {
            frameSmallElements[i][k].isDimmed = state.nextBoardNr != 9 && state.nextBoardNr !== i;
        }
    }
}