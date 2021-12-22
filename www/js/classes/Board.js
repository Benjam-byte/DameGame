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
            shots = shots.concat(this.searchSpecificShot(pion));
        })
        return shots
    }

    searchSpecificShot(pion){
        let shotsForPion = []
        // regarde si on peut se déplacer vers le bas ou le haut selon notre couleur
        let y = pion.color === 'white' ? pion.position.y - 1 : pion.position.y + 1;
        let x1 = pion.position.x - 1;
        let x2 = pion.position.x + 1;
        // on cherche la case diagonale  gauche
        if((x1 >= 0 && x1 < this.size) && (y >= 0 && y < this.size)){
            let square = this.searchCase(x1, y);
            // si elle est disponible on crée un nouveau coup
            if(!square.pion){
                shotsForPion.push(new Shot(pion, square))
            // sinon on regarde si le pion est ennemi et si la case d'après est libre
            } else {
                if(square.pion.color != pion.color){
                    let y1 = pion.color === 'white' ? y - 1 : y + 1;
                    let x3 = x1 - 1;
                    if((x3 >= 0 && x3 < this.size) && (y1 >= 0 && y1 < this.size)){
                        let square2 = this.searchCase(x3, y1);
                        if(!square2.pion){
                            shotsForPion.push(new Shot(pion, square2, square.pion))
                        }
                    }
                }
            }
        }
        // on cherche la case diagonale droit
        if((x2 >= 0 && x2 < this.size) && (y >= 0 && y < this.size)){
            let square = this.searchCase(x2, y);
            if(!square.pion){
                shotsForPion.push(new Shot(pion, square))
            } else {
                if(square.pion.color != pion.color){
                    let y1 = pion.color === 'white' ? y - 1 : y + 1;
                    let x4 = x2 + 1;
                    if((x4 >= 0 && x4 < this.size) && (y1 >= 0 && y1 < this.size)){
                        let square2 = this.searchCase(x4, y1);
                        if(!square2.pion){
                            shotsForPion.push(new Shot(pion, square2, square.pion))
                        }
                    }
                }
            }
        }
        // on cherche la case diagonale gauche inverse (voir si on peut manger un pion à l'envers)
        let yReverse = pion.color === 'white' ? pion.position.y + 1 : pion.position.y - 1;
        if((x1 >= 0 && x1 < this.size) && (yReverse >= 0 && yReverse < this.size)){
            let square = this.searchCase(x1, yReverse);
            if(square.pion){
                if(square.pion.color != pion.color){
                    let yReverse1 = pion.color === 'white' ? yReverse + 1 : yReverse - 1;
                    let x3 = x1 - 1;
                    if((x3 >= 0 && x3 < this.size) && (yReverse1 >= 0 && yReverse1 < this.size)){
                        let square2 = this.searchCase(x3, yReverse1);
                        if(!square2.pion){
                            shotsForPion.push(new Shot(pion, square2, square.pion))
                        }
                    }
                }
            }
        }
        // on cherche la case diagonale droite inverse (voir si on peut manger un pion à l'envers)
        if((x2 >= 0 && x2 < this.size) && (yReverse >= 0 && yReverse < this.size)){
            let square = this.searchCase(x2, yReverse);
            if(square.pion){
                if(square.pion.color != pion.color){
                    let yReverse1 = pion.color === 'white' ? yReverse + 1 : yReverse - 1;
                    let x4 = x2 + 1;
                    if((x4 >= 0 && x4 < this.size) && (yReverse1 >= 0 && yReverse1 < this.size)){
                        let square2 = this.searchCase(x4, yReverse1);
                        if(!square2.pion){
                            shotsForPion.push(new Shot(pion, square2, square.pion))
                        }
                    }
                }
            }
        }
        return shotsForPion;
    }

    // emet un feedback des coups possible d'un joueur et retourne un tableau des coups possible
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

    // supprime un pion des paquets
    deletePion(pion){
        let pions = pion.color === 'white' ? this.whitePions : this.blackPions;
        pions.forEach(element => {
            if(element === pion){
                pions.splice(pions.indexOf(element), 1)
            }
        })
    }
}
