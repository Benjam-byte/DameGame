class Board {
    constructor(size) {
        this.cases = [];
        this.ref = window.document.getElementById("board");
        this.size = size; // nombre de case
    
        this.drawBoard();
        this.whitePions = this.createPions('white');
        this.blackPions = this.createPions('black', true);
    }

    // trace les cases du plateau
    drawBoard() {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let color = (y % 2 == 0 && x % 2 == 0 || y % 2 != 0 && x % 2 != 0) ? 'Cornsilk' : 'DarkRed';
                this.cases.push(new Case({"x" : x, "y" : y}, color, this));
            }
        }
    }

    // génère des pions et les places sur le plateau
    // reverse commence a tracer les cases sur la seconde partie du tableau
    createPions(color, reverse){
        let coef = reverse ? 0 : (this.size / 2) + 1
        let pions = []
        for (let y = 0; y < (this.size / 2) - 1; y++) {
            for (let x = 0; x < this.size; x++) {
                if(y % 2 == 0 && x % 2 != 0 || y % 2 != 0 && x % 2 == 0){
                    let square = this.searchCase(x, y + coef);
                    let pion = new Pion({"x" : x, "y" : y + coef}, color, square);
                    square.pion = pion;
                    pions.push(pion);
                }
            }
        }
        return pions;
    }

    // retourne une case selon ses coordonnées
    searchCase(x, y){
        let square;
        this.cases.forEach(item => {
            if(item.position.x === x && item.position.y === y){
                square = item;
            };
        })
        return square;
    }

    // retourne les coups possible d'un joueur
    searchShot(color){
        let shots = []
        let pions = color === 'white' ? this.whitePions : this.blackPions;
        pions.forEach(pion => {
            // regarde si on peut se déplacer vers le bas ou le haut selon notre couleur
            let y = color === 'white' ? pion.position.y - 1 : pion.position.y + 1;
            let x1 = pion.position.x - 1;
            let x2 = pion.position.x + 1;
            // on cherche la case diagonale bas gauche
            if((x1 >= 0 && x1 < this.size) && (y >= 0 && y < this.size)){
                let square = this.searchCase(x1, y);
                if(!square.pion){
                    shots.push(new Shot(pion, square))
                }
            }
            // on cherche la case diagonale bas droit
            if((x2 >= 0 && x2 < this.size) && (y >= 0 && y < this.size)){
                let square = this.searchCase(x2, y);
                if(!square.pion){
                    shots.push(new Shot(pion, square))
                }
            }
        })
        return shots
    }

    // emet un feedback des coups possible d'un joueur
    viewShots(color){
        this.clearViewShots();
        let shots = this.searchShot(color);
        shots.forEach(shot => {
            shot.destination.ref.classList.add("available");
        })
        return shots;
    }

    // emet un feedback du coup envisagé
    viewSpecificShot(shot){
        if(shot.destination.ref.classList.contains('available')){
            shot.destination.ref.classList.add('selected');
        }
    }

    // supprime le feedback des coups possible
    clearViewShots(){
        let shotsAvailable = document.getElementsByClassName('available');
        while(shotsAvailable[0]){
            shotsAvailable[0].classList.remove('available')
        }
    }

    // supprime le feedback du coup envisagé
    clearViewSpecificShot(){
        let shotSelected = document.getElementsByClassName('selected');
        while(shotSelected[0]){
            shotSelected[0].classList.remove('selected')
        }
    }
}
