class Party {
    constructor(playerName1, playerName2, size) {
        this.player1 = new Player(playerName1, 'white', true);
        this.player2 = new Player(playerName2, 'black', false);;
        this.board = new Board(size);
        this.gameTurn = this.player1;
        this.selectedSquare;
        this.currentShots;
        this.requiredShots = []
        this.createEvent();
        this.viewDisponibleShot();
    }

    // détection des cliques
    createEvent(){
        this.board.ref.addEventListener('click', event => {
            let chaine = this.requiredShots.length ? this.requiredShots[0].pion.ref : false;
            let condition = (chaine === event.target || chaine === false) ? true : false;
            // si on clique sur un pion
            if(event.target.classList.contains("pion") && condition){
                // on supprime le feedback des coups s'il y en avait
                this.board.clearViewSpecificShot();
                // on récupère les pions du joueur
                let pions = this.gameTurn.color === "white" ? this.board.whitePions :  this.board.blackPions;
                // on regarde quel pion a été sélectionné
                pions.forEach(pion => {
                    if(pion.ref === event.target){
                        this.selectedSquare = pion.parent;
                        // on regarde parmi les coups disponibles ceux correspondants au pion sélectionné
                        this.currentShots.forEach(shot => {
                            if(shot.pion === pion){
                                // on émet un feedback des coups possibles sur ce pion
                                this.board.viewSpecificShot(shot)
                            }
                        })
                    }
                })
            // si le clique correspond à une case possible pour le pion sélectionné
            } else if ((event.target.classList.contains("selected"))){
                // on supprime le feedback
                this.board.clearViewSpecificShot();
                // on cherche la case de destination
                let destinationSquare = this.board.searchCase(parseInt(event.target.getAttribute("x")), parseInt(event.target.getAttribute("y")));
                // on cherche le coup des coups courants
                let shot = this.searchCurrentShot(destinationSquare);
                // on fait bouger le pion sur cette case
                shot.pion.move(destinationSquare);
                // on regarde si le pion devient une dame
                if(shot.queen){
                    shot.pion.becomesQueen();
                }
                // si le coup a mangé un pion on regarde s'il peut enchaîner
                if(shot.eatedPion){
                    shot.eatedPion.delete();
                    this.requiredShots = [];
                    if(!this.endGame()){
                        this.board.searchSpecificShot(shot.pion).forEach(element => {
                            if(element.eatedPion){
                                this.requiredShots.push(element);
                            }
                        })
                        // si c'est le cas on attend qu'il joue
                        if(this.requiredShots.length){
                            this.viewDisponibleShot();
                        // sinon on passe le tour normalement
                        } else {
                            this.switchTurn();
                        }
                    } else {
                        document.getElementById("endGame").classList.remove("hidden");
                    }
                } else {
                    this.switchTurn();
                }
            }
        })
    }

    // trouve les coups disponibles pour un joueur
    viewDisponibleShot(){
        let player =  this.gameTurn.color == 'white' ? this.player1 : this.player2;
        this.currentShots = this.board.viewShots(player.color)
    }

    searchCurrentShot(square){
        let currentShot;
        this.currentShots.forEach(shot =>{
            if(shot.destination === square && this.selectedSquare.pion === shot.pion){
                currentShot = shot; 
            }
        })
        return currentShot;
    }

    // change de tour
    switchTurn(){
        this.gameTurn = this.gameTurn == this.player1 ? this.player2 : this.player1;
        this.viewDisponibleShot();
    }

    // vérifie si le jeu est fini
    endGame(){
        if(!this.board.whitePions.length || !this.board.blackPions.length){
            let endGame = document.querySelector("#endGame>p");
            endGame.innerHTML = this.board.whitePions.length ? "Joueur blanc gagne" : "Joueur noir gagne";
            return true;
        } else {
            return false;
        }
    }
}