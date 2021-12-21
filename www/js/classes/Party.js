class Party {
    constructor(playerName1, playerName2, size) {
        this.player1 = new Player(playerName1, 'white', true);
        this.player2 = new Player(playerName2, 'black', false);;
        this.board = new Board(size);
        this.gameTurn = this.player1;
        this.selectedSquare;
        this.currentShots;
        this.createEvent();
        this.viewDisponibleShot();
    }

    // détection des cliques
    createEvent(){
        this.board.ref.addEventListener('click', event => {
            // si on clique sur un pion
            if(event.target.classList.contains("pion")){
                // on supprime le feedback des coups si il y'en avait
                this.board.clearViewSpecificShot();
                // on récupère les pions du joueur
                let pions = this.gameTurn.color === "white" ? this.board.whitePions :  this.board.blackPions;
                // on regarde quel pion a été sélectionné
                pions.forEach(pion => {
                    if(pion.ref === event.target){
                        this.selectedSquare = pion.parent;
                        // on regarde parmi les coups disponible ceux correspondant au pion sélectionné
                        this.currentShots.forEach(shot => {
                            if(shot.pion === pion){
                                // on émet un feedback des coups possible sur ce pion
                                this.board.viewSpecificShot(shot)
                            }
                        })
                    }
                })
            // si le clique correspond a une case possible pour le pion sélectionné
            } else if ((event.target.classList.contains("selected"))){
                // on supprime le feedback
                this.board.clearViewSpecificShot();
                // on cherche la case de destination
                let destinationSquare = this.board.searchCase(parseInt(event.target.getAttribute("x")), parseInt(event.target.getAttribute("y")));
                // on fait bouger le pion sur cette case
                this.selectedSquare.pion.move(destinationSquare);
                this.switchTurn();
            }
        })
    }

    // trouve les coups disponible pour un joueur
    viewDisponibleShot(){
        let player =  this.gameTurn.color == 'white' ? this.player1 : this.player2;
        this.currentShots = this.board.viewShots(player.color)
    }

    // change de tour
    switchTurn(){
        this.gameTurn = this.gameTurn == this.player1 ? this.player2 : this.player1;
        this.viewDisponibleShot();
    }
}