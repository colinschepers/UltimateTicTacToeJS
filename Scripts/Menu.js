var menu1Items = []
var menu2Items = []
var menuShown = 0;

var xxx = null

class MenuItem {
    constructor(text, x, y, width, height, onClicked) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.onClicked = onClicked;
        this.transparency = 0;
    }

    draw() {
        rectMode(CORNER);

        fill(10, this.transparency);
        rect(this.x, this.y, this.width, this.height);

        fill(100, this.transparency);
        textSize(menuFontSize);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text(this.text, this.x, this.y, this.width, this.height);

        this.transparency = min(200, this.transparency + (200 * menuAnimationLength));
    }
}

function drawMenu() {
    if (menu1Items.length == 0) {
        initMenu1();
    }
    if (menu2Items.length == 0) {
        initMenu2();
    }

    if(state && state.isGameOver) {
        if (menuShown == 0) {
            menuShown = 1;
        }
        for (let menuItem of getMenuItems()) {
            menuItem.draw();
        }
    }
}

function initMenu1() {
    let txt = 'New Game';
    let w = gridSizeXL * menuItemSize;
    let h = gridSizeXL * menuItemSize / 2;
    let x = size / 2 - w / 2;
    let y = size / 2 - h / 2;
    let onClicked = function() { 
        menuShown = 2; 
    };
    menu1Items.push(new MenuItem(txt, x, y, w, h, onClicked));
}

function initMenu2() {
    let newPlayers = [new HumanPlayer(), new RandomPlayer(), new MCTSPlayer()];
    for (let i = 0; i < 9; i++) {
        let txt = newPlayers[i % 3].constructor.name.replace('Player', '') + '\nvs\n' 
            + newPlayers[Math.floor(i / 3)].constructor.name.replace('Player', '') + '\n';
        let w = gridSizeXL * menuItemSize;
        let h = gridSizeXL * menuItemSize;
        let x = (i % 3 + 0.5) * gridSizeXL - w / 2;
        let y = (Math.floor(i / 3) + 0.5) * gridSizeXL - h / 2;
        let onClicked = function() { 
            players[0] = newPlayers[i % 3];
            players[1] = newPlayers[Math.floor(i / 3)]; 
            newGame(); 
            menuShown = 0; 
        };
        menu2Items.push(new MenuItem(txt, x, y, w, h, onClicked));
    }
}

function getMenuItems() {
    if(menuShown == 1) {
        return menu1Items;
    } else if(menuShown == 2) {
        return menu2Items;
    }
    return [];
}

function checkMenuItemsClicked() {
    for (let menuItem of getMenuItems()) {
        if(mouseX > menuItem.x && mouseX < menuItem.x + menuItem.width && 
            mouseY > menuItem.y && mouseY < menuItem.y + menuItem.height) {
            menuItem.onClicked();
        }
    }
}