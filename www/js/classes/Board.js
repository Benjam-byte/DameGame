class Board { //pour l'instant le dix par dix 
    constructor() {
        this.tab = [];
        this.ref = window.document.getElementById("board");
        this.fillBoard();
        this.drawBoard();
    }

    fillBoard() {
        var x = true;
        for (var i = 0; i < 10; i++) {
            if (x) {
                x = false;
            } else { x = true; }
            for (var j = 0; j < 10; j++) {
                if (x) {
                    this.tab.push(new Case(new Position(i, j), "yellow"));
                    x = false;
                }
                else {
                    this.tab.push(new Case(new Position(i, j), "black"));
                    x = true;
                }
            }
        }
    }

    drawBoard() {
        this.tab.forEach(item => {
            item.drawCase(this.ref);
        });
    }
}