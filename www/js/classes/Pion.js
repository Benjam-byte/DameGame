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
