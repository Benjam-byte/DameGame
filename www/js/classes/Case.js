class Case {
    constructor(position, color, parent) {
        this.parent = parent;
        this.ref;
        this.position = position;
        this.color = color;
        this.pion;
        this.drawCase();
    }

    // construit une case
    drawCase() {
        let Case = document.createElement("div");
        this.setAttributes(Case,{"class": "case", "x" : this.position.x, "y" : this.position.y});
        let dimension = ((80 * window.innerHeight) / 100) / this.parent.size;
        Case.style.width = dimension + "px";
        Case.style.height = dimension + "px";
        Case.style.backgroundColor = this.color;
        this.parent.ref.appendChild(Case);
        this.ref = Case;
    }

    // permet de set plusieurs attributs en même temps
    setAttributes(el, attrs) {
        for(var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }

}