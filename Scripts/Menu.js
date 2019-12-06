function drawMenu() {
    if (menuEnabled) {
        fill(200, 200);

        const players = ['Human', 'Random', 'MCTS'];
        for (var j = 0; j < 3; j++) {
            for (var i = 0; i < 3; i++) {
                let txt = players[i] + '\nvs\n' + players[j] + '\n';
                let x = gridSizeXL * i;
                let y = gridSizeXL * j;

                stroke(0);
                textSize(28);
                textStyle(BOLD);
                textAlign(CENTER, TOP);
                text(txt, x, y + height / 10, gridSizeXL, gridSizeXL);
            }
        }


    }
}