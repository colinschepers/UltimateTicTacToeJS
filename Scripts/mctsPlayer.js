const UCT_C = Math.sqrt(2);

class MCTSPlayer {
    constructor() {
        this.worker = new Worker(`Scripts/mcts.js`);
    }

    async getMove(state, timeLimit, callback) {
        try {
            this.worker.onmessage = function (messageEvent) { callback(messageEvent.data[0]) }
            this.worker.onerror = function (error) { console.error(error); };
            this.worker.postMessage([state, timeLimit]);
        } catch (error) {
            console.error(error);
        }
    }
}