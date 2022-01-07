class Board {
    constructor(size, board) {
        if (!board) {
            this.cases = [];
            this.ref = window.document.getElementById("board");
            this.size = size; // nombre de case

            this.drawBoard();
            this.whitePions = this.createPions('white');
            this.blackPions = this.createPions('black', true);
        } else {
            this.cases = [];
            this.ref = window.document.getElementById("board");
            this.size = size; // nombre de case
            this.whitePions = [];
            this.blackPions = [];
            this.drawBoard();
            this.drawBoardFrombViz(board);
        }

    }

    /** 0 pas de pion
     * 1 pion blanc
     * 2 pion noir
     * 3 dame blanche
     * 4 dame noir
     *      */
    getVizBoard() {
        var bViz = [];
        for (var i = 0; i < this.cases.length; i++) {
            if (this.cases[i].pion === undefined) {
                bViz.push(0); // 0 si pas de pion
            } else if (this.cases[i].pion.color === "white" && !this.cases[i].pion.isQueen) {
                bViz.push(1); // 1 si le pion est blanc
            }else if(this.cases[i].pion.color === "white" && this.cases[i].pion.isQueen){
                bViz.push(3); // 3 si le pion est une dame blanche
            } else if (this.cases[i].pion.color === "black" && !this.cases[i].pion.isQueen) {
                bViz.push(2); // 2 si le pîon est noir
            }else if(this.cases[i].pion.color === "black" && !this.cases[i].pion.isQueen) {
                bViz.push(4); //4 si le pion est une dame noir
            }
        }
        return bViz;
    }


    drawBoardFrombViz(bViz) {
        console.log(bViz);
        console.log("je rentre dans la boucle");
        for (var i = 0; i < bViz.length; i++) {
            console.log(bViz[i]);
            if (bViz[i] === 0) {
            } else if (bViz[i] === 1) {
                var x = i % 10;
                var y = Math.floor(i / 10);
                console.log("on regarde la case :");
                console.log(x);
                console.log(y);
                let square = this.searchCase(x, y);
                console.log("le resultat :")
                console.log(square);
                let pion = new Pion({ "x": x, "y": y }, "white", square);
                square.pion = pion;
                this.whitePions.push(pion);
            } else if (bViz[i] === 2) {
                var x = i % 10;
                var y = Math.floor(i / 10);
                console.log("on regarde la case :");
                console.log(x);
                console.log(y);
                let square = this.searchCase(x, y);
                console.log("le resultat :")
                console.log(square);
                let pion = new Pion({ "x": x, "y": y }, "black", square);
                square.pion = pion;
                this.blackPions.push(pion);
            }else if(bViz[i] === 3){
                var x = i % 10;
                var y = Math.floor(i / 10);
                console.log("on regarde la case :");
                console.log(x);
                console.log(y);
                let square = this.searchCase(x, y);
                console.log("le resultat :")
                console.log(square);
                let pion = new Pion({ "x": x, "y": y }, "white", square);
                square.pion = pion;
                pion.becomesQueen();
                this.whitePions.push(pion);

            }else if(bViz[i] === 4){
                var x = i % 10;
                var y = Math.floor(i / 10);
                console.log("on regarde la case :");
                console.log(x);
                console.log(y);
                let square = this.searchCase(x, y);
                console.log("le resultat :")
                console.log(square);
                let pion = new Pion({ "x": x, "y": y }, "black", square);
                square.pion = pion;
                pion.becomesQueen();
                this.blackPions.push(pion);
            }
        }
    }

    // trace les cases du plateau
    drawBoard() {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let color = (y % 2 == 0 && x % 2 == 0 || y % 2 != 0 && x % 2 != 0) ? 'Cornsilk' : 'DarkRed';
                this.cases.push(new Case({ "x": x, "y": y }, color, this));
            }
        }
    }

    // génère des pions et les places sur le plateau
    // reverse commence a tracer les cases sur la seconde partie du tableau
    createPions(color, reverse) {
        let coef = reverse ? 0 : (this.size / 2) + 1
        let pions = []
        for (let y = 0; y < (this.size / 2) - 1; y++) {
            for (let x = 0; x < this.size; x++) {
                if (y % 2 == 0 && x % 2 != 0 || y % 2 != 0 && x % 2 == 0) {
                    let square = this.searchCase(x, y + coef);
                    let pion = new Pion({ "x": x, "y": y + coef }, color, square);
                    square.pion = pion;
                    pions.push(pion);
                }
            }
        }
        return pions;
    }

    // retourne une case selon ses coordonnées
    searchCase(x, y) {
        let square;
        this.cases.forEach(item => {
            if (item.position.x === x && item.position.y === y) {
                square = item;
            };
        })
        return square;
    }

    // retourne les coups possible d'un joueur
    searchShot(color) {
        let shots = []
        let pions = color === 'white' ? this.whitePions : this.blackPions;
        pions.forEach(pion => {
            shots = shots.concat(this.searchSpecificShot(pion));
        })
        // vérifie si le joueur doit manger des pions pour établir une priorité des coups
        let shotsEatPion = []
        shots.forEach(shot => {
            if (shot.eatedPion) {
                shotsEatPion.push(shot)
            }
        })
        return shotsEatPion.length ? shotsEatPion : shots;
    }

    // right permet de vérifier le sens de la diagonale et queen d'interpréter le mouvement comme libre (pas de limite arrière)
    checkForwardMovement(pion, x, y, right, queen) {
        let shotsForPion = [];
        let becomesQueen = pion.color === 'white' ? (y === 0 ? true : false) : (y === this.size - 1 ? true : false);
        if ((x >= 0 && x < this.size) && (y >= 0 && y < this.size)) {
            let square = this.searchCase(x, y);
            // si elle est disponible on crée un nouveau coup
            if (!square.pion) {
                shotsForPion.push(new Shot(pion, square, false, becomesQueen))
                // sinon on regarde si le pion est ennemi et si la case d'après est libre
            } else {
                if (square.pion.color != pion.color) {
                    let y1 = queen ? (pion.color === 'white' ? y + 1 : y - 1) : (pion.color === 'white' ? y - 1 : y + 1);
                    let x1 = right ? x + 1 : x - 1;
                    becomesQueen = pion.color === 'white' ? (y1 === 0 ? true : false) : (y1 === this.size - 1 ? true : false);
                    if ((x1 >= 0 && x1 < this.size) && (y1 >= 0 && y1 < this.size)) {
                        let square2 = this.searchCase(x1, y1);
                        if (!square2.pion) {
                            shotsForPion.push(new Shot(pion, square2, square.pion, becomesQueen))
                        }
                    }
                }
            }
        }
        return shotsForPion;
    }

    checkBackwardMovement(pion, x, y, right) {
        let shotsForPion = [];
        if ((x >= 0 && x < this.size) && (y >= 0 && y < this.size)) {
            let square = this.searchCase(x, y);
            if (square.pion) {
                if (square.pion.color != pion.color) {
                    let y1 = pion.color === 'white' ? y + 1 : y - 1;
                    let x1 = right ? x + 1 : x - 1;
                    let becomesQueen = pion.color === 'white' ? (y1 === 0 ? true : false) : (y1 === this.size - 1 ? true : false);
                    if ((x1 >= 0 && x1 < this.size) && (y1 >= 0 && y1 < this.size)) {
                        let square2 = this.searchCase(x1, y1);
                        if (!square2.pion) {
                            shotsForPion.push(new Shot(pion, square2, square.pion, becomesQueen))
                        }
                    }
                }
            }
        }
        return shotsForPion;
    }

    checkQueenMovement(pion, x, y, right, backward) {
        // cherche les coups d'une dame
        let condition = true;
        let queenShots = []
        // tant que la condition est respecté on incrémente la diagonale
        while (condition) {
            // on récupère un mouvement
            let interMovements = this.checkForwardMovement(pion, x, y, right, backward);
            // si un mouvement est récupéré c'est qu'on peut jouer dans cette drection
            if (interMovements.length) {
                queenShots = queenShots.concat(interMovements);
                condition = interMovements[0].eatedPion ? false : true;
                // sinon c'est qu'il n'y a plus rien a jouer sur cette diagonale
            } else {
                condition = false;
            }
            // on incrémente la diagonale suivant la couleur et le sens souhaité
            y = pion.color === 'white' ? (backward ? y + 1 : y - 1) : (backward ? y - 1 : y + 1);
            x = right ? x + 1 : x - 1;
        }
        return queenShots;
    }

    searchSpecificShot(pion) {
        let shotsForPion = []
        // si le pion n'est pas une dame
        if (!pion.isQueen) {
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
            let backwardRight = this.checkBackwardMovement(pion, x2, yReverse, true)

            shotsForPion = forwardLeft.concat(forwardRight, backwardLeft, backwardRight);
            // si le pion est une dame
        } else {
            let y = pion.color === 'white' ? pion.position.y - 1 : pion.position.y + 1;
            let x1 = pion.position.x - 1;
            let x2 = pion.position.x + 1;

            // regarde les coups disponible a gauche dans le sens de la couleur
            let forwardLeft = this.checkQueenMovement(pion, x1, y, false, false)

            // regarde les coups disponible a droite dans le sens de la couleur
            let forwardRight = this.checkQueenMovement(pion, x2, y, true, false)

            // regarde les coups disponible a gauche dans le sens inverse de la couleur
            y = pion.color === 'white' ? pion.position.y + 1 : pion.position.y - 1; // inverse le sens
            let backwardLeft = this.checkQueenMovement(pion, x1, y, false, true)

            // regarde les coups disponible a droite dans le sens inverse de la couleur
            let backwardRight = this.checkQueenMovement(pion, x2, y, true, true)

            shotsForPion = forwardLeft.concat(forwardRight, backwardLeft, backwardRight);
        }
        return shotsForPion;
    }

    // emet un feedback des coups possible d'un joueur et retourne un tableau des coups possible
    viewShots(color) {
        this.clearViewShots();
        let shots = this.searchShot(color);
        shots.forEach(shot => {
            shot.destination.ref.classList.add("available");
        })
        return shots;
    }

    // emet un feedback du coup envisagé
    viewSpecificShot(shot) {
        if (shot.destination.ref.classList.contains('available')) {
            shot.destination.ref.classList.add('selected');
        }
    }

    // supprime le feedback des coups possible
    clearViewShots() {
        let shotsAvailable = document.getElementsByClassName('available');
        while (shotsAvailable[0]) {
            shotsAvailable[0].classList.remove('available')
        }
    }

    // supprime le feedback du coup envisagé
    clearViewSpecificShot() {
        let shotSelected = document.getElementsByClassName('selected');
        while (shotSelected[0]) {
            shotSelected[0].classList.remove('selected')
        }
    }

    // supprime un pion des paquets
    deletePion(pion) {
        let pions = pion.color === 'white' ? this.whitePions : this.blackPions;
        pions.forEach(element => {
            if (element === pion) {
                pions.splice(pions.indexOf(element), 1)
            }
        })
    }
}
