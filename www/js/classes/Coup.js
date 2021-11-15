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

