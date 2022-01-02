
/** - ca viens du serveur + ca viens d'un client
 * code 0 : donne ton nom
 * code 0.5 : je souhaite rejouier
 * code 1 : demarrer une partie
 * code 2 : joue
 * code 3 : execute ce coup
 * code 4 : victoire/defaite
 * code 5 : la partie est supprimé
 * code 5.5 : la partie est supprimé suite au desistement de l'autre joueur
 * code 6 : un joueur a quitté la partie / je ne souhaite plus attendre
 * code 7 : le joueur s'est reconnecté la partie vas reprendre
 * code 8 : voici le tableau que tu doit utiliser (joueur qui se reconnecte)
 */

const http = require('http');
const server = http.createServer();
server.listen(9898);  // On écoute sur le port 9898

// Création du server WebSocket qui utilise le serveur précédent 
const WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer({
    httpServer: server
});

var clientsUnknown = [];
var clientsDispo = [];
var clientsEnAttente = [];
var partieEncours = [];
var lastId = 0;

console.log("serveur creer");
//Mise en place des événements WebSockets 
wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);
    var p = findPartyFromConnection(connection);
    console.log(p);
    if( p !== false){
        if(p.joueur1.connection === connection){
            p.sendJ2(JSON.stringify({code : 7}));
        }else{
            p.sendJ1(JSON.stringify({code : 7}));
        }
    }else if (clientsUnknown.indexOf(connection) === -1) {
        clientsUnknown.push(connection);
        console.log("jai une connection");
        clientsUnknown[clientsUnknown.length - 1].send(JSON.stringify({ code: 0 }));
    }


    connection.on('message', function (message) {
        var message = JSON.parse(message.utf8Data);
        findCode(message, connection);


    });



    connection.on('close', function (reasonCode, description) {
        var p = findPartyFromConnection(connection);
        if (p !== false) { // le joueur etais en partie
            p.setPause(connection);
        } else { //le joueur n'y etait pas
            var uc = findUnknownFromConnection(connection);
            if (uc !== false) {
                clientsUnknown.splice(uc, 1);
            }
            var dc = findClientsDispoFromConnection(connection);
            if (dc !== false) {
                clientsDispo.splice(dc, 1);
            }
            var ac = findClientsEnAttenteFromConnection(connection);
            if(ac !== false){
                clientsEnAttente.splice(ac, 1);
            }
        }
    });

});

function findCode(message, connection) { /// averifier si tout est toujours bien réalisé au sein de partie 
    if (message.code === 0) {
        console.log("reception code 0");
        setName(message.myName, connection);
        startGame();
    } else if (message.code === 0.5) {
        console.log("reception code 0.5")
        for (var i = 0; i < clientsEnAttente.length; i++) {
            if (clientsEnAttente[i].connection === connection) {
                clientsDispo.push(clientsEnAttente[i]);
                clientsEnAttente.splice(i, 1);
            }
        }
        startGame();
    } else if (message.code === 1) {
        console.log("reception code 1");
        var partie = findParty(message.id);
        if (partie.joueur1.connection === connection && message.ready) {
            partie.j1R = true;
            console.log("j1 est ready");
        } else if (partie.joueur2.connection === connection && message.ready) {
            partie.j2R = true;
            console.log("j2 est ready");
        }
        if (partie.j1R === true && partie.j2R === true) {
            partie.changeState("Started");
        }
    } else if (message.code === 2) {
        console.log("reception code 2");
        var partie = findParty(message.id);
        if (partie.joueur1.connection === connection) {
            var mj2 = JSON.stringify({ code: 3, shot: message.shot, pionpos: message.pionpos, eatedpionPos: message.eatedpionPos });
            partie.sendJ2(mj2);
            partie.changeLastPlayer();
        } else {
            var mj1 = JSON.stringify({ code: 3, shot: message.shot, pionpos: message.pionpos, eatedpionPos: message.eatedpionPos });
            partie.sendJ1(mj1);
            partie.changeLastPlayer();
        }
    } else if (message.code === 3) {
        console.log("reception code 3");
        var partie = findParty(message.id);
        if (partie.joueur1.connection === connection) {
            partie.sendJ1(JSON.stringify({ code: 2 }));
        } else {
            partie.sendJ2(JSON.stringify({ code: 2 }));
        }

    } else if (message.code === 4) {
        console.log("reception code 4");
        var partie = findParty(message.id);
        if (partie.joueur1.connection === connection) {
            partie.j1end = true;
        } else {
            partie.j2end = true;
        }
        if (partie.j1end && partie.j2end) {
            removePartie(partie)
        }
    } else if (message.code === 6) {
        console.log("reception code 6");
        var partie = findParty(message.id);
        if (partie.etat === "Paused") {
            removePartiePaused(partie, connection)
        }

    }else if(message.code === 7){
        console.log("reception code 7");
        var partie = findParty(message.id);
        if(partie.etat === "Paused"){
            if(partie.joueur1.connection === connection){
                partie.sendJ2(JSON.stringify({code : 8,boardCase : message.boardCase}));
            }else{
                partie.sendJ1(JSON.stringify({code : 8,boardCase : message.boardCase}))
            }
        }
    }else if(message.code === 8){
        console.log("reception code 8");
        var partie = findParty(message.id);
        partie.etat = "Started";
        if(partie.lastPlayer === partie.joueur1){
            partie.sendJ2(JSON.stringify({code : 2}));
        }else{
            partie.sendJ1(JSON.stringify({code : 2}))
        }

    }
}

function startGame() {
    if (clientsDispo.length === 2) { // si il y a deux client dispo on creer une partie et on les retires
        var p = new Partie(clientsDispo[0], clientsDispo[1], lastId); /// a chaque connection il creer potentiellement une partie ? mais sa se trouve y'ne a plus
        lastId = lastId + 1;
        partieEncours.push(p);
        clientsDispo = clientsDispo.slice(2);
        console.log("une partie de créer");
        p.start();
    }
}


function removePartie(partie) {
    for (var i = 0; i < partieEncours.length; i++) {
        if (partieEncours[i].id === partie.id) {
            partieEncours.splice(i, 1);
        }
    }
    partie.sendJ1(JSON.stringify({ code: 5 }));
    partie.sendJ2(JSON.stringify({ code: 5 }));
    clientsEnAttente.push(partie.joueur1);
    clientsEnAttente.push(partie.joueur2);
}

function removePartiePaused(partie, connection) {
    for (var i = 0; i < partieEncours.length; i++) {
        if (partieEncours[i].id === partie.id) {
            partieEncours.splice(i, 1);
        }
    }
    if (partie.joueur1.connection === connection) {
        partie.sendJ1(JSON.stringify({ code: 5.5 }));
        clientsEnAttente.push(partie.joueur1);
    } else {
        partie.sendJ2(JSON.stringify({ code: 5.5 }));
        clientsEnAttente.push(partie.joueur2);
    }
}

function findParty(id) {
    for (var i = 0; i < partieEncours.length; i++) {
        if (partieEncours[i].id === id) {
            return partieEncours[i];
        }
    }
}

function findPartyFromConnection(connection) {
    for (var i = 0; i < partieEncours.length; i++) {
        if (partieEncours[i].joueur1.connection === connection || partieEncours[i].joueur2.connection === connection) {
            return partieEncours[i];
        }
    }
    return false;
}


function findClientsDispoFromConnection(connection) {
    for (var i = 0; i < clientsDispo.length; i++) {
        if (clientsDispo[i].connection === connection) {
            return i;
        }
    }
    return false;
}

function findUnknownFromConnection(connection) {
    for (var i = 0; i < clientsUnknown.length; i++) {
        if (clientsUnknown[i] === connection) {
            return i;
        }
    }
    return false;
}

function findClientsEnAttenteFromConnection(connection) {
    for (var i = 0; i < clientsEnAttente.length; i++) {
        if (clientsEnAttente[i].connection === connection) {
            return i;
        }
    }
    return false;
}


function setName(name, connection) {
    clientsUnknown.forEach(client => {
        if (connection === client) {
            clientsDispo.push(new Clients(connection, name));
        }
    })
    clientsUnknown.splice(findUnknownFromConnection(connection), 1);
}

class Partie {
    constructor(j1, j2, id) {
        this.joueur1 = j1;
        this.joueur2 = j2;
        this.j1R = false;
        this.j2R = false;
        this.id = id;
        this.j1end = false;
        this.j2end = false;
        this.lastPlayer = j2;
        this.size = 10;
        this.etat = "noStart"; /** noStart Started Paused End  */
    }

    start() {
        var mj1 = { code: 1, name: this.joueur1.name, nameAd: this.joueur2.name, size: this.size, isFirst: true, id: this.id };
        var mj2 = { code: 1, name: this.joueur2.name, nameAd: this.joueur1.name, size: this.size, isFirst: false, id: this.id };
        this.joueur1.connection.send(JSON.stringify(mj1));
        this.joueur2.connection.send(JSON.stringify(mj2));
    }


    changeState(newState) {
        this.etat = newState;
        this.exeState();
    }

    exeState() {
        if (this.etat === 'Started') {
            var j1m = JSON.stringify({ code: 2 });
            this.sendJ1(j1m);
        }
    }

    changeLastPlayer(){
        if(this.lastPlayer === this.joueur1){
            this.lastPlayer = this.joueur2;
            console.log("le player est actuel est le : 2 ");
        }else{
            this.lastPlayer = this.joueur1;
            console.log("le player est actuel est le : 1 ");
        }
    }


    sendMessageAll(message) {
        this.joueur1.send(message);
        this.joueur2.send(message);
    }

    sendJ1(message) {
        this.joueur1.connection.send(message);
    }

    sendJ2(message) {
        this.joueur2.connection.send(message);
    }

    setPause(connection) {
        this.etat = "Paused";
        if (this.joueur1.connection === connection) {
            this.sendJ2(JSON.stringify({ code: 6 }));

        } else {
            this.sendJ1(JSON.stringify({ code: 6 }));

        }
    }

    setFin() {
        this.etat = "End";
        this.joueur1 = "";
        this.joueur2 = "";
    }
}

class Clients {
    constructor(connection, name) {
        this.connection = connection;
        this.name = name;
    }

    setName(name) {
        this.name = name;
    }

}