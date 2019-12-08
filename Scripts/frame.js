var frameLargeElements = null;
var frameSmallElements = null;

class FrameElement {
    constructor(x, y, width, height, r, g, b, a) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.width = width;
        this.height = height;
    }

    draw() {
        fill(this.r, this.g, this.b, this.a);
        rect(this.x, this.y, this.width, this.height);
    }
}

function drawFrame() {
    if (!frameLargeElements) {
        frameLargeElements = createLargeFrameElements();
    }
    if (!frameSmallElements || (state && state.roundNr == 0 && frameSmallElements.length < 36)) {
        frameSmallElements = createSmallFrameElements();
    }

    if (state) {
        updateSmallFrameElements();
    }

    rectMode(CORNER);
    for (let frameElement of frameLargeElements) {
        frameElement.draw();
    }
    for (let frameElement of frameSmallElements) {
        frameElement.draw();
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
    const elements = [];
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            for (k = 1; k < 3; k++) {
                let x = i * gridSizeXL + k * gridSize - frameThickness / 2;
                let y = j * gridSizeXL + gridSizeXL * ((1 - frameCoverage) / 2);
                let w = frameThickness;
                let h = gridSizeXL * frameCoverage;
                elements.push(new FrameElement(x, y, w, h, 0, 150, 200, 255));
                elements.push(new FrameElement(y, x, h, w, 0, 150, 200, 255));
            }
        }
    }
    return elements;
}

function updateSmallFrameElements() {
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            if (state.getBoardValue(i, j) !== undefined) {
                for (k = 0; k < 4; k++) {
                    element = frameSmallElements[(j * 3 + i) * 4 + k];
                    element.a = max(0, element.a - (200 / frameAnimationSpeed));
                }
            }
        }
    }
}