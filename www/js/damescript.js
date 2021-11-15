
        const game = true;

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

        class Joueur {
            constructor(id, couleur) {
                this.id = id;
                this.couleur = couleur;
                this.coup;
            }

            setCoup(coup) {
                this.coup = coup;
            }
        }

        class Board { //pour l'instant le dix par dix 
            constructor() {
                this.tab = [];
                this.ref = window.document.getElementById("board");
                this.fillBoard();
                this.drawBoard();
            }

            fillBoard() {
                var x = true;
                for (var i = 0; i < 10; i++) {
                    if (x) {
                        x = false;
                    } else { x = true; }
                    for (var j = 0; j < 10; j++) {
                        if (x) {
                            this.tab.push(new Caseboard(new Position2D(i, j), "yellow"));
                            x = false;
                        }
                        else {
                            this.tab.push(new Caseboard(new Position2D(i, j), "black"));
                            x = true;
                        }
                    }
                }
            }

            drawBoard() {
                this.tab.forEach(item => {
                    item.drawCase(this.ref);
                });
            }
        }

        class Caseboard {
            constructor(position, couleur) {
                this.ref;
                this.position = position;
                this.couleur = couleur;
                this.pion = false;
            }

            drawCase(Parent) {
                var Case = document.createElement("div");
                Case.setAttribute("id", "case");
                Case.style.width = "40px";
                Case.style.height = "40px";
                Case.style.backgroundColor = this.couleur;
                Case.style.display = "inline-block";
                this.ref = Case;
                Parent.appendChild(Case);
            }
        }


        class Pion {
            constructor(position, joueur) {
                this.ref;
                this.position = position;
                this.couleur = joueur.couleur;
                this.joueur = joueur;
                this.estDame = false;
            }

            drawPion(Parent) {
                let pion = document.createElement("div");
                pion.setAttribute("id", "pion" + this.position.x + this.position.y);
                pion.style.width = "30px";
                pion.style.height = "30px";
                pion.style.backgroundColor = this.couleur;
                pion.style.borderRadius = "30px";
                pion.style.marginLeft = "5px";
                pion.style.marginTop = "5px";
                this.ref = pion;
                Parent.appendChild(pion);
                console.log("pion ajouter");
            }

            deplacer(newParent) {
                this.position = newParent.position;
                this.ref.remove();
                newParent.appendChild(this.ref);
                console.log("pion deplacer");
            }

        }

        class Position2D {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
        }

        class Coup {
            constructor(pionajouer, newParent) {
                this.idpion = pionajouer.id.substring(4, pionajouer.length);
                this.newParent = newParent;
            }

            setPion(pionajouer) {
                this.idpion = pionajouer.id.substring(4, pionajouer.length);
            }

            setNewParent(newParent) {
                this.newParent = newParent;
            }

            notnull() {
                if (this.idpion === null || this.newParent === null) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }


        // tFrame est le temps d'appel de l'animation passé à main en ms
        ; (function () {
            var partie = new Party(new Joueur(1, "red"), new Joueur(2, "green"));
            function main(tFrame) {
                let cbId = window.requestAnimationFrame(main);
                if (!game) {
                    window.cancelAnimationFrame(cbId);
                    console.log("Game over");
                } else { //boucle de jeu

                }
            }
            main(0); // Début du cycle
        })();