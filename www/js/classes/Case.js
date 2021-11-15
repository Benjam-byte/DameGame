class Case {
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