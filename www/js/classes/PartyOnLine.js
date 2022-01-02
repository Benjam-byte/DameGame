class PartyOnLine {
    constructor(playerName1, playerName2, size, isFirst, id, ws,board) {
         if(!board){
            if (isFirst) {
                this.player = new Player(playerName1, 'white', true);
                this.playerAd = new Player(playerName2, 'black', false);
                this.board = new Board(size,false);
                this.gameTurn = this.player;
                this.ws = ws;
            } else {
                this.player = new Player(playerName1, 'black', true);
                this.playerAd = new Player(playerName2, 'white', false);
                this.board = new Board(size,false);
                this.gameTurn = this.player;
                this.ws = ws;
            }
            this.id = id;
            this.selectedSquare;
            this.currentShots;
            this.requiredShots = [];
            this.pionpos = '';
            this.eatedpionPos = '';
         }else{
            if (isFirst) {
                this.player = new Player(playerName1, 'white', true);
                this.playerAd = new Player(playerName2, 'black', false);
                this.board = new Board(size,board);
                this.gameTurn = this.player;
                this.ws = ws;
            } else {
                this.player = new Player(playerName1, 'black', true);
                this.playerAd = new Player(playerName2, 'white', false);
                this.board = new Board(size,board);
                this.gameTurn = this.player;
                this.ws = ws;
            }
            this.id = id;
            this.selectedSquare;
            this.currentShots;
            this.requiredShots = [];
            this.pionpos = '';
            this.eatedpionPos = '';
         }   
        
    }


    stop(){
        this.deleteEvent();
    }


    playAShot(shotAd) {
        console.log(shotAd);
        let shot = shotAd;
        // on fait bouger le pion sur cette case
        shot.pion.move(shot.destination);
        // on regarde si le pion devient dame
        if (shot.queen) {
            shot.pion.becomesQueen();
        }
        // si le coup a manger un pion on regarde si il peut enchainer
        if (shot.eatedPion) {
            shot.eatedPion.delete();
            this.requiredShots = [];
            if (!this.endGame()) {
                this.board.searchSpecificShot(shot.pion).forEach(element => {
                    if (element.eatedPion) {
                        this.requiredShots.push(element);
                    }
                })
                // si c'est le cas on attend qu'il joue
                if (this.requiredShots.length) {
                    this.viewDisponibleShot();
                    // sinon on passe le tour normalement
                } else {
                    this.switchTurn();
                }
                this.ws.send(JSON.stringify({ code: 3, id: game.id }));
            } else {
                //document.getElementById("endGame").classList.remove("hidden");
            }
        } else {
            this.switchTurn();
            this.ws.send(JSON.stringify({ code: 3, id: game.id }));
        }
    }

    getPion(pos) {
        console.log(pos);
        if (this.playerAd.color === 'black') {
            console.log("il etait black");
            for (var i = 0; i < this.board.blackPions.length; i++) {
                if (this.board.blackPions[i].position.x === pos.x && this.board.blackPions[i].position.y === pos.y) {
                    return this.board.blackPions[i];
                }
            }
        } else {
            console.log("il etait white");
            for (var i = 0; i < this.board.whitePions.length; i++) {
                if (this.board.whitePions[i].position.x === pos.x && this.board.whitePions[i].position.y === pos.y) {
                    return this.board.whitePions[i];
                }
            }
        }
    }

    getPionEated(pos) {
        if (pos !== undefined) {
            if (this.playerAd.color === 'black') {
                console.log("il etait black 2");
                for (var i = 0; i < this.board.whitePions.length; i++) {
                    if (this.board.whitePions[i].position.x === pos.x && this.board.whitePions[i].position.y === pos.y) {
                        return this.board.whitePions[i];
                    }
                }
            } else {
                console.log("il etait white 2");
                for (var i = 0; i < this.board.blackPions.length; i++) {
                    if (this.board.blackPions[i].position.x === pos.x && this.board.blackPions[i].position.y === pos.y) {
                        return this.board.blackPions[i];
                    }
                }
            }
        }
    }


    getCase(pos) {
        for (var i = 0; i < this.board.cases.length; i++) {
            if (this.board.cases[i].position.x === pos.x && this.board.cases[i].position.y === pos.y) {
                return this.board.cases[i];
            }
        }
    }

    play() {
        console.log("mdrr 1")
        this.viewDisponibleShot();
        this.createEvent();
    }


    deleteEvent() {
        console.log("mdrr");
        this.board.ref.removeEventListener('click', this.clickEvent);
        this.board.clearViewShots();
        this.board.clearViewSpecificShot();
    }

    //fct event 
    clickEvent = ((event) => {
        console.log("on me clique");
        let chaine = this.requiredShots.length ? this.requiredShots[0].pion.ref : false;
        let condition = (chaine === event.target || chaine === false) ? true : false;
        // si on clique sur un pion
        if (event.target.classList.contains("pion") && condition) {
            // on supprime le feedback des coups si il y'en avait
            this.board.clearViewSpecificShot();
            // on récupère les pions du joueur
            console.log(this.gameTurn.color);
            let pions = this.gameTurn.color === "white" ? this.board.whitePions : this.board.blackPions;
            // on regarde quel pion a été sélectionné
            pions.forEach(pion => {
                if (pion.ref === event.target) {
                    this.pionpos = pion.position;
                    console.log(pion.position);
                    this.selectedSquare = pion.parent;
                    // on regarde parmi les coups disponible ceux correspondant au pion sélectionné
                    this.currentShots.forEach(shot => {
                        if (shot.pion === pion) { //////////////////////////////////////// reprendre ici //////////////////////////////////////
                            // on émet un feedback des coups possible sur ce pion
                            console.log(shot);
                            this.board.viewSpecificShot(shot)
                        }
                    })
                }
            })
            // si le clique correspond a une case possible pour le pion sélectionné
        } else if ((event.target.classList.contains("selected"))) {
            // on supprime le feedback
            this.board.clearViewSpecificShot();
            // on cherche la case de destination
            let destinationSquare = this.board.searchCase(parseInt(event.target.getAttribute("x")), parseInt(event.target.getAttribute("y")));
            // on cherche le coup des coups courant
            let shot = this.searchCurrentShot(destinationSquare);
            console.log(shot);
            console.log(this.pionpos);
            this.eatedpionPos = shot.eatedPion.position;
            console.log("pnt etex");
            console.log(this.eatedpionPos);
            this.ws.send(JSON.stringify({ code: 2, id: this.id, shot: cycle.decycle(shot), pionpos: this.pionpos, eatedpionPos: this.eatedpionPos }));
            // on fait bouger le pion sur cette case
            shot.pion.move(destinationSquare);
            // on regarde si le pion devient dame
            if (shot.queen) {
                shot.pion.becomesQueen();
            }
            // si le coup a manger un pion on regarde si il peut enchainer
            if (shot.eatedPion) {
                shot.eatedPion.delete();
                this.requiredShots = [];
                if (!this.endGame()) {
                    this.board.searchSpecificShot(shot.pion).forEach(element => {
                        if (element.eatedPion) {
                            this.requiredShots.push(element);
                        }
                    })
                    // si c'est le cas on attend qu'il joue
                    if (this.requiredShots.length) {
                        this.viewDisponibleShot();
                        // sinon on passe le tour normalement
                    } else {
                        this.switchTurn();
                    }
                } else {
                    //document.getElementById("endGame").classList.remove("hidden");
                }
            } else {
                this.switchTurn();
            }
        }
    })

    // détection des cliques
    createEvent() {
        this.board.ref.addEventListener('click', this.clickEvent);
    }

    // trouve les coups disponible pour un joueur
    viewDisponibleShot() {
        let player = this.gameTurn.color == 'white' ? "white" : "black";
        this.currentShots = this.board.viewShots(player)
    }

    searchCurrentShot(square) {
        let currentShot;
        this.currentShots.forEach(shot => {
            if (shot.destination === square && this.selectedSquare.pion === shot.pion) {
                currentShot = shot;
            }
        })
        return currentShot;
    }

    // change de tour
    switchTurn() {
        this.board.clearViewSpecificShot();
        this.deleteEvent();
    }

    // vérifie si le jeu est fini
    endGame() {
        if (!this.board.whitePions.length || !this.board.blackPions.length) {
            this.ws.send(JSON.stringify({ code: 4, id: this.id, victoire: true }))
            return true;
        } else {
            return false;
        }
    }
}

