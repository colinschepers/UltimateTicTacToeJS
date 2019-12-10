class HumanPlayer {
    getMove(state, callback) {
        let x = Math.floor(mouseX / (width / 9));
        let y = Math.floor(mouseY / (height / 9));
        if (x >= 0 && x < 9 && y >= 0 && y < 9) {
            let move = Math.floor(y / 3) * 27 + (y % 3) * 3 + Math.floor(x / 3) * 9 + x % 3;
            if (!state.isValid(move)) {
                console.error('Invalid Move!');
                return;
            }
            callback(move);
        }
    }
}