class Board {
    constructor(size) {
        this.cases = [];
        this.ref = window.document.getElementById("board");
        this.size = size; // nombre de case
    
        this.drawBoard();
        this.whitePions = this.createPions('white');
        this.blackPions = this.createPions('black', true);
        this.whitePions[0].becomesQueen();
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
        console.log(shots)
        // vérifie si le joueur doit manger des pions pour établir une priorité des coups
        let shotsEatPion = []
        shots.forEach(shot => {
            if(shot.eatedPion){
                shotsEatPion.push(shot)
            }
        })
        console.log(shotsEatPion)
        return shotsEatPion.length ? shotsEatPion : shots;
    }

    checkForwardMovement(pion, x, y, right){
        let shotsForPion = [];
        if((x >= 0 && x < this.size) && (y >= 0 && y < this.size)){
            let square = this.searchCase(x, y);
            // si elle est disponible on crée un nouveau coup
            if(!square.pion){
                shotsForPion.push(new Shot(pion, square))
            // sinon on regarde si le pion est ennemi et si la case d'après est libre
            } else {
                if(square.pion.color != pion.color){
                    let y1 = pion.color === 'white' ? y - 1 : y + 1;
                    let x1 = right ? x + 1 : x - 1;
                    if((x1 >= 0 && x1 < this.size) && (y1 >= 0 && y1 < this.size)){
                        let square2 = this.searchCase(x1, y1);
                        if(!square2.pion){
                            shotsForPion.push(new Shot(pion, square2, square.pion))
                        }
                    }
                }
            }
        }
        return shotsForPion;
    }

    checkBackwardMovement(pion, x, y, right){
        let shotsForPion = [];
        if((x >= 0 && x < this.size) && (y >= 0 && y < this.size)){
            let square = this.searchCase(x, y);
            if(square.pion){
                if(square.pion.color != pion.color){
                    let y1 = pion.color === 'white' ? y + 1 : y - 1;
                    let x1 = right ? x + 1 : x - 1;
                    if((x1 >= 0 && x1 < this.size) && (y1 >= 0 && y1 < this.size)){
                        let square2 = this.searchCase(x1, y1);
                        if(!square2.pion){
                            shotsForPion.push(new Shot(pion, square2, square.pion))
                        }
                    }
                }
            }
        }
        return shotsForPion;
    }

    searchSpecificShot(pion){
        let shotsForPion = []
        // si le pion n'est pas une dame
        if(!pion.isQueen){
            // regarde si on peut se déplacer vers le bas ou le haut selon notre couleur
            let y = pion.color === 'white' ? pion.position.y - 1 : pion.position.y + 1;
            let x1 = pion.position.x - 1;
            let x2 = pion.position.x + 1;
            // a gauche
            let forwardLeft = this.checkForwardMovement(pion, x1, y)
            // a droite
            let forwardRight = this.checkForwardMovement(pion, x2, y, true)
            // regarde si on peut manger un pion vers l'arrière selon notre couleur
            let yReverse = pion.color === 'white' ? pion.position.y + 1 : pion.position.y - 1;
            let backwardLeft = this.checkBackwardMovement(pion, x1, yReverse)
            let backwardRight =this.checkBackwardMovement(pion, x2, yReverse, true)

            shotsForPion = forwardLeft.concat(forwardRight, backwardLeft, backwardRight);
        // si le pion est une dame
        } else {
            let condition = true;
            let y = pion.color === 'white' ? pion.position.y - 1 : pion.position.y + 1;
            let x1 = pion.position.x - 1;
            let x2 = pion.position.x + 1;

            let forwardLeft = [];
            let forwardRight = [];
            let backwardLeft = [];
            let backwardRight = [];
            // a gauche
            while(condition){
                let interForwardLeft = this.checkForwardMovement(pion, x1, y);
                interForwardLeft.length ? forwardLeft = forwardLeft.concat(interForwardLeft) : condition = false;
                y = pion.color === 'white' ? y - 1 : y + 1;
                x1 -= 1;
            }
            condition = true;
            y = pion.color === 'white' ? pion.position.y - 1 : pion.position.y + 1;
            // a droite
            while(condition){
                let interForwardRight = this.checkForwardMovement(pion, x2, y, true);
                interForwardRight.length ? forwardRight = forwardRight.concat(interForwardRight) : condition = false;
                y = pion.color === 'white' ? y - 1 : y + 1;
                x2 += 1;
            }
            condition = true;
            y = pion.color === 'white' ? pion.position.y + 1 : pion.position.y - 1;
            x1 = pion.position.x - 1;
            // a gauche inverse selon couleur
            while(condition){
                let interBackwardLeft = this.checkForwardMovement(pion, x1, y);
                interBackwardLeft.length ? backwardLeft = backwardLeft.concat(interBackwardLeft) : condition = false;
                y = pion.color === 'white' ? y + 1 : y - 1;
                x1 -= 1;
            }
            condition = true;
            y = pion.color === 'white' ? pion.position.y + 1 : pion.position.y - 1;
            x2 = pion.position.x + 1;
            // a droite inverse selon couleur
            while(condition){
                let interBackwardRight = this.checkForwardMovement(pion, x2, y, true);
                interBackwardRight.length ? backwardRight = backwardRight.concat(interBackwardRight) : condition = false;
                y = pion.color === 'white' ? y + 1 : y - 1;
                x2 += 1;
            }
            shotsForPion = forwardLeft.concat(forwardRight, backwardLeft, backwardRight);

        }
        console.log(shotsForPion)
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
