class Pion {
    constructor(position, color, parent) {
        this.parent = parent;
        this.ref;
        this.position = position;
        this.color = color;
        this.isQueen = false;
        this.drawPion();
    }

    // construit un pion
    drawPion() {
        let pion = document.createElement("div");
        pion.setAttribute("class", "pion");
        pion.style.backgroundColor = this.color == 'white' ? 'BlanchedAlmond' : 'Chocolate';
        this.ref = pion;
        this.parent.ref.appendChild(pion);
    }

    // bouge le pion vers une case (parent) de destination
    move(newParent) {
        this.parent.ref.removeChild(this.ref);
        delete this.parent.pion;
        this.parent = newParent;
        this.position = newParent.position;

        newParent.ref.appendChild(this.ref);
        newParent.pion = this;
    }
    /** 
     * Supprime un pion
     */
    delete(){
        this.parent.parent.deletePion(this)
        delete this.parent.pion;
        this.ref.remove();
        delete this;
    }
    /** 
     * transforme un pion en reine 
     */
    becomesQueen(){
        this.isQueen = true;
        this.ref.classList.add('queen')
    }
}
