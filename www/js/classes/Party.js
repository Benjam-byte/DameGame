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

    createEvent(){
        this.board.ref.addEventListener('click', event => {
            if(event.target.classList.contains("pion")){
                this.board.clearViewSpecificShot();
                let pions = this.gameTurn.color === "white" ? this.board.whitePions :  this.board.blackPions;
                pions.forEach(pion => {
                    if(pion.ref === event.target){
                        this.selectedSquare = pion.parent;
                        this.currentShots.forEach(shot => {
                            if(shot.pion === pion){
                                this.board.viewSpecificShot(shot)
                            }
                        })
                    }
                })
            } else if ((event.target.classList.contains("selected"))){
                this.board.clearViewSpecificShot();
                let destinationSquare = this.board.searchCase(parseInt(event.target.getAttribute("x")), parseInt(event.target.getAttribute("y")));
                this.selectedSquare.pion.move(destinationSquare);
                this.switchTurn();
            }
        })
    }

    viewDisponibleShot(){
        let player =  this.gameTurn.color == 'white' ? this.player1 : this.player2;
        this.currentShots = this.board.viewShots(player.color)
    }

    switchTurn(){
        this.gameTurn = this.gameTurn == this.player1 ? this.player2 : this.player1;
        this.viewDisponibleShot();
    }
}