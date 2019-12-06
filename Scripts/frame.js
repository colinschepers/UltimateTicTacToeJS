const frameElements = [];

class FrameElement {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        rect(this.x, this.y, this.width, this.height);
    }
}

function drawFrame() {
    if (frameElements.length === 0) {
        initFrameElements();
    }

    rectMode(CORNER);
    fill(0, 150, 200, 200);

    for (let frameElement of frameElements) {
        frameElement.draw();
    }
}

function initFrameElements() {
    for (i = 1; i < 3; i++) {
        let x = i * gridSizeXL - frameThickness / 2;
        let y = size * ((1 - frameCoverageXL) / 2);
        let w = frameThickness;
        let h = size * frameCoverageXL;
        frameElements.push(new FrameElement(x, y, w, h));
        frameElements.push(new FrameElement(y, x, h, w));
    }

    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            for (k = 1; k < 3; k++) {
                let x = i * gridSizeXL + k * gridSize - frameThickness / 2;
                let y = j * gridSizeXL + gridSizeXL * ((1 - frameCoverage) / 2);
                let w = frameThickness;
                let h = gridSizeXL * frameCoverage;
                frameElements.push(new FrameElement(x, y, w, h));
                frameElements.push(new FrameElement(y, x, h, w));
            }
        }
    }
}