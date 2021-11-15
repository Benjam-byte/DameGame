class Party {
    constructor(joueur1, joueur2) {
        this.etat = true;
        this.joueur1 = joueur1;
        this.joueur2 = joueur2;
        this.board = new Board();
        this.tour = false; //false c'est le tour de j1 true l'inverse 
        this.addPion();
        this.board.ref.addEventListener('click', event => {
            var pionajouer;
            var newParent;

            if (this.tour) {
                if (joueur2.coup === undefined) {
                    joueur2.setCoup(new coup(pionajouer, newParent));
                }
                else {
                    if (event.target.id.substring(0, 4) === "pion") {
                        joueur2.coup.setPion(event.target);
                    }
                    if (event.target.id === "case") {
                        joueur2.coup.setNewParent(event.target)
                    }
                }
            }
            else {
                if (joueur1.coup === undefined) {
                    joueur1.setCoup(new coup(pionajouer, newParent));
                }
                else {
                    if (event.target.id.substring(0, 4) === "pion") {
                        joueur1.coup.setPion(event.target);
                    }
                    if (event.target.id === "case") {
                        joueur1.coup.setNewParent(event.target)
                    }
                }
            }
            if (joueur1.coup.notnull()) {
                this.board.tab[joueur1.coup.idpion].pion.deplacer(joueur1.coup.newParent);
            }
        });
    }

    addPion() {
        this.board.tab.forEach(item => {
            if (item.couleur === "black") {
                if (item.position.x < 4) {
                    item.pion = new Pion(item.position, this.joueur1);
                    item.pion.drawPion(item.ref);
                }
                if (item.position.x >= 6) {
                    item.pion = new Pion(item.position, this.joueur2);
                    item.pion.drawPion(item.ref);
                }
            }
        });
    }
}