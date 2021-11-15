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