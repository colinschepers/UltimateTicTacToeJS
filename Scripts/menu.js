const menuItems = [];
const menuPlayerNames = ['Human', 'Easy', 'Medium', 'Hard', 'Godlike'];
const menuPlayers = [new HumanPlayer(), new MCTSPlayer(5), new MCTSPlayer(100), new MCTSPlayer(500), new MCTSPlayer(1500)];
const menuSpeedNames = ['Instant', 'Fast', 'Normal', 'Slow', 'Slothlike'];
const menuSpeeds = [1, 100, 300, 1000, 3000];

var menuShown = false;
var menuPlayer1 = 0;
var menuPlayer2 = 2;
var menuSpeed = 0;

class MenuItem {
    constructor(text, x, y, width, height, fontSize, backgroundColor, textColor, animate, onClicked) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fontSize = fontSize;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.transparency = 0;
        this.animate = animate;
        this.onClicked = onClicked;
    }

    draw() {
        rectMode(CORNER);
        textStyle(BOLD);

        let fontSize = this.fontSize;
        let textColor = this.textColor

        if (this.animate  && mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
            fontSize = this.fontSize * 1.1;
            textColor = 200 + (55 * sin(frameCount / 15));
        }

        this.transparency = min(200, this.transparency + menuAnimationSpeed);

        fill(this.backgroundColor, this.transparency);
        rect(this.x, this.y, this.width, this.height);

        fill(textColor, this.transparency);
        textSize(fontSize)
        textAlign(CENTER, CENTER);
        text(this.text, this.x, this.y, this.width, this.height);
    }
}

function drawMenu() {
    if (menuItems.length === 0) {
        initMenu();
    }
    if (!state || state.isGameOver) {
        if(!menuShown && state) {
            if(state && state.score === 1) {
                menuItems[menuItems.length - 2].text++;
            } else if (state && state.score === 0) {
                menuItems[menuItems.length - 1].text++;
            }
        }
        for (let menuItem of menuItems) {
            menuItem.draw();
        }
        menuShown = true;
    }
}

function initMenu() {
    let w = gridSizeXL * menuItemSizeX;
    let h = gridSizeXL * menuItemSizeY / 2;
    let x = size / 2 - w / 2;
    let dy = gridSizeXL * (1 - menuItemSizeY) / 4;

    menuItems.push(new MenuItem('New Game', x, gridSizeXL * 0.5 + dy, w, h, 
        menuFontSize, 15, 145, true, function () {
            for (let menuItem of menuItems) {
                menuItem.transparency = 0;
            }
            menuShown = false;
            players[0] = menuPlayers[menuPlayer1];
            players[1] = menuPlayers[menuPlayer2];
            moveDelay = menuSpeeds[menuSpeed];
            newGame();
        }));
    menuItems.push(new MenuItem('Cross: ' + menuPlayerNames[menuPlayer1], x, gridSizeXL * 1 + dy, w, h, 
        menuFontSize, 15, 145, true, function () {
            menuPlayer1 = (menuPlayer1 + 1) % menuPlayerNames.length;
            this.text = 'Cross: ' + menuPlayerNames[menuPlayer1]
        }));
    menuItems.push(new MenuItem('Circle: ' + menuPlayerNames[menuPlayer2], x, gridSizeXL * 1.5 + dy, w, h, 
        menuFontSize, 15, 145, true, function () {
            menuPlayer2 = (menuPlayer2 + 1) % menuPlayerNames.length;
            this.text = 'Circle: ' + menuPlayerNames[menuPlayer2];
        }));
    menuItems.push(new MenuItem('Speed: ' + menuSpeedNames[menuSpeed], x, gridSizeXL * 2 + dy, w, h, 
        menuFontSize, 15, 145, true, function () {
            menuSpeed = (menuSpeed + 1) % menuSpeedNames.length;
            this.text = 'Speed: ' + menuSpeedNames[menuSpeed];
        }));
    menuItems.push(new MenuItem(0, x - gridSizeXL, gridSizeXL + dy, w, gridSizeXL - dy * 2,
        menuFontSize * 3, 50, 255, false, function () {}));
    menuItems.push(new MenuItem(0, x + gridSizeXL, gridSizeXL + dy, w, gridSizeXL - dy * 2,
        menuFontSize * 3, 50, 255, false, function () {}));
} 

function checkMenuItemsClicked() {
    if(menuShown) {
        for (let menuItem of menuItems) {
            if (mouseX > menuItem.x && mouseX < menuItem.x + menuItem.width &&
                mouseY > menuItem.y && mouseY < menuItem.y + menuItem.height) {
                menuItem.onClicked();
            }
        }
    }
}