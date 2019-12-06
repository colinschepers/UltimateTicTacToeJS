const symbolSize = gridSize * 0.8;
const circleThickness = 0.25;

function drawSymbols() {
    if (!state) {
        return;
    }
    let board = state.get2DBoard();
    for (var j = 0; j < 9; j++) {
        for (var i = 0; i < 9; i++) {
            if (board[i][j] == 0) {
                drawCross(i, j);
            } else if (board[i][j] == 1) {
                drawCircle(i, j);
            }
        }
    }
}

function drawCross(i, j) {
    let x = (i + 0.5) * gridSize;
    let y = (j + 0.5) * gridSize;

    fill(0, 255, 0);
    rectMode(CENTER);
    translate(x, y);
    rotate(0.25 * PI);
    rect(0, 0, symbolSize / 5, symbolSize)
    rotate(0.5 * PI);
    rect(0, 0, symbolSize / 5, symbolSize)
    rotate(1.25 * PI);
    translate(-x, -y);
}

function drawCircle(i, j) {
    let x = (i + 0.5) * gridSize;
    let y = (j + 0.5) * gridSize;
    let innerSize = symbolSize * (1 - circleThickness);

    ellipseMode(CENTER);
    fill(255, 0, 0);
    circle(x, y, symbolSize);
    fill(0);
    circle(x, y, innerSize);
}