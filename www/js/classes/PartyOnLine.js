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
            this.selectedSquare = [];
            this.currentShots = [];
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
            this.selectedSquare =[];
            this.currentShots = [];
            this.requiredShots = [];
            this.pionpos = '';
            this.eatedpionPos = '';
         }   
        
    }

    /** 
     * retire l'eventListener du board 
     */
    stop(){
        this.deleteEvent();
    }

    /** 
     * param shotAd Shot 
     * effectue sur le plateau le shot transmit en paramètre
     */
    playAShot(shotAd) {
        let shot = shotAd;
        // on fait bouger le pion sur cette case
        shot.pion.move(shot.destination);
        // on regarde si le pion devient une dame
        if (shot.queen) {
            shot.pion.becomesQueen();
        }
        // si le coup a mangé un pion on regarde s'il peut enchainer
        if (shot.eatedPion) {
            shot.eatedPion.delete();
            this.requiredShots = [];
            if (!this.endGame(false)) {
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
                
            }
        } else {
            this.switchTurn();
            this.ws.send(JSON.stringify({ code: 3, id: game.id }));
        }
    }

    /** 
     * param pos {x:int,y:int}
     * permet d'obtenir l'instance d'un pion pour une position parmi les pions du joueur
     */
    getPion(pos) {
        if (this.playerAd.color === 'black') {
            for (var i = 0; i < this.board.blackPions.length; i++) {
                if (this.board.blackPions[i].position.x === pos.x && this.board.blackPions[i].position.y === pos.y) {
                    return this.board.blackPions[i];
                }
            }
        } else {
            for (var i = 0; i < this.board.whitePions.length; i++) {
                if (this.board.whitePions[i].position.x === pos.x && this.board.whitePions[i].position.y === pos.y) {
                    return this.board.whitePions[i];
                }
            }
        }
    }
    /** 
     * param pos {x:int,y:int}
     * permet d'obtenir l'instance d'un pion pour une position donnée parmi les pions du joueur adverse
     * 
     */
    getPionEated(pos) {
        if (pos !== undefined) {
            if (this.playerAd.color === 'black') {
                for (var i = 0; i < this.board.whitePions.length; i++) {
                    if (this.board.whitePions[i].position.x === pos.x && this.board.whitePions[i].position.y === pos.y) {
                        return this.board.whitePions[i];
                    }
                }
            } else {
                for (var i = 0; i < this.board.blackPions.length; i++) {
                    if (this.board.blackPions[i].position.x === pos.x && this.board.blackPions[i].position.y === pos.y) {
                        return this.board.blackPions[i];
                    }
                }
            }
        }
    }

    /** 
     * param pos {x:int,y:int}
     * permet d'obtenir l'instance d'une case pour une position donnée
     */
    getCase(pos) {
        for (var i = 0; i < this.board.cases.length; i++) {
            if (this.board.cases[i].position.x === pos.x && this.board.cases[i].position.y === pos.y) {
                return this.board.cases[i];
            }
        }
    }

    /** 
     * Active la possiblité de jouer en placant l'eventListener sur le plateau
     */
    play() {
        this.viewDisponibleShot();
        this.createEvent();
    }

    /** 
     * Désactive la possibilité de jouer et retire les possibilités de jeux
    */
    deleteEvent() {
        this.board.ref.removeEventListener('click', this.clickEvent);
        this.board.clearViewShots();
        this.board.clearViewSpecificShot();
    }

    /** 
     * fonction destinée à être utilisée dans un eventListener 
     * est le "main" du jeux
     */
    clickEvent = ((event) => {
        let chaine = this.requiredShots.length ? this.requiredShots[0].pion.ref : false;
        let condition = (chaine === event.target || chaine === false) ? true : false;
        // si on clique sur un pion
        if (event.target.classList.contains("pion") && condition) {
            // on supprime le feedback des coups s'il y en avait
            this.board.clearViewSpecificShot();
            // on récupère les pions du joueur
            let pions = this.gameTurn.color === "white" ? this.board.whitePions : this.board.blackPions;
            // on regarde quel pion a été sélectionné
            pions.forEach(pion => {
                if (pion.ref === event.target) {
                    this.pionpos = pion.position;
                    this.selectedSquare = pion.parent;
                    // on regarde parmi les coups disponibles ceux correspondant au pion sélectionné
                    this.currentShots.forEach(shot => {
                        if (shot.pion === pion) { //////////////////////////////////////// reprendre ici //////////////////////////////////////
                            // on émet un feedback des coups possible sur ce pion
                            this.board.viewSpecificShot(shot)
                        }
                    })
                }
            })
            // si le clique correspond à une case possible pour le pion sélectionné
        } else if ((event.target.classList.contains("selected"))) {
            // on supprime le feedback
            this.board.clearViewSpecificShot();
            // on cherche la case de destination
            let destinationSquare = this.board.searchCase(parseInt(event.target.getAttribute("x")), parseInt(event.target.getAttribute("y")));
            // on cherche le coup des coups courants
            let shot = this.searchCurrentShot(destinationSquare);
            this.eatedpionPos = shot.eatedPion.position;
            //this.ws.send(JSON.stringify({ code: 2, id: this.id, shot: cycle.decycle(shot), pionpos: this.pionpos, eatedpionPos: this.eatedpionPos, board : this.board.getVizBoard() }));
            // on fait bouger le pion sur cette case
            shot.pion.move(destinationSquare);
            // on regarde si le pion devient une dame
            if (shot.queen) {
                shot.pion.becomesQueen();
            }
            // si le coup a mangé un pion on regarde s'il peut enchaîner
            if (shot.eatedPion) {
                shot.eatedPion.delete();
                this.requiredShots = [];
                if (!this.endGame(true)) {
                    this.board.searchSpecificShot(shot.pion).forEach(element => {
                        if (element.eatedPion) {
                            this.requiredShots.push(element);
                        }
                    })
                    // si c'est le cas on attend qu'il joue
                    if (this.requiredShots.length) {
                        this.viewDisponibleShot();
                        this.ws.send(JSON.stringify({ code: 2, id: this.id, shot: cycle.decycle(shot), pionpos: this.pionpos, eatedpionPos: this.eatedpionPos, board : this.board.getVizBoard() }));
                        // sinon on passe le tour normalement
                    } else {
                        this.switchTurn();
                        this.ws.send(JSON.stringify({ code: 2, id: this.id, shot: cycle.decycle(shot), pionpos: this.pionpos, eatedpionPos: this.eatedpionPos, board : this.board.getVizBoard() }));
                    }
                } else {
                    this.ws.send(JSON.stringify({ code: 2, id: this.id, shot: cycle.decycle(shot), pionpos: this.pionpos, eatedpionPos: this.eatedpionPos, board : this.board.getVizBoard() }));
                }
            } else {
                this.switchTurn();
                this.ws.send(JSON.stringify({ code: 2, id: this.id, shot: cycle.decycle(shot), pionpos: this.pionpos, eatedpionPos: this.eatedpionPos, board : this.board.getVizBoard() }));
            }
        }
    })

    /** 
     * ajoute au tableau l'eventListener avec la bonne fonction
     */
    createEvent() {
        this.board.ref.addEventListener('click', this.clickEvent);
    }

    // trouve les coups disponibles pour un joueur
    viewDisponibleShot() {
        let player = this.gameTurn.color == 'white' ? "white" : "black";
        this.currentShots = this.board.viewShots(player);
    }

    /** 
     * param square Case
     * cherche parmi les shots possibles lequel correspond à la case donnée
     */
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
    endGame(boolean) {
        if (!this.board.whitePions.length || !this.board.blackPions.length) {
            this.ws.send(JSON.stringify({ code: 4, id: this.id, victoire: boolean }))
            this.board.clearViewSpecificShot();
            this.board.clearViewShots();
            this.deleteEvent();
            return true;
        } else {
            return false;
        }
    }
}

