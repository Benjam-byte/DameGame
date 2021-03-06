///////////////////////////////////////////////////////////////BD ///////////////////////////////////////////////////
var mongoose = require('mongoose');
//Schéma pour la table Joueur
const joueurSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true
    },
    estEnPartie: {
        type: Boolean,
        default: false
    },
    estDejaConnecte: {
        type: Boolean,
        default: false
    },
    nbPartiesGagnees: {
        type: Number,
        default: 0
    }
});

//Schéma pour la table Partie
const partieSchema = new mongoose.Schema({
    login1: {
        type: String,
        required: true
    },
    login2: {
        type: String,
        required: true
    },
    board: {
        type: [Number], //Etat du jeu au départ
        default: [2, 0, 2, 0, 2, 0, 2, 0, 2, 0,
            0, 2, 0, 2, 0, 2, 0, 2, 0, 2,
            2, 0, 2, 0, 2, 0, 2, 0, 2, 0,
            0, 2, 0, 2, 0, 2, 0, 2, 0, 2,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
            0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
            1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
            0, 1, 0, 1, 0, 1, 0, 1, 0, 1
        ]
    },
    dernierJoueur: {
        type: String
    }
});

//Création des models pour Joueur et Partie
const Joueur = mongoose.model('Joueur', joueurSchema);
const PartieS = mongoose.model('PartieS', partieSchema);
///////////////////////////////////////////////////  FONCTION BD ////////////////////////////////////////////////////////////////////////
// 
//----------------- Joueur ------------------------------//

//Test si on peut créer le couple login/mdp, sinon s'il existe un couple login/mdp déjà enregistré
async function connexion(login, password) {
    var joueur = new Joueur({ login: login, pass: password });
    try {
        console.log("Tentative d'inscription dans la BD...");
        await joueur.save();
        updateEstDejaConnecte(login);
        console.log("Compte créé.");
        return true;
    }
    catch {
        console.log("Recherche compte dans la BD...");
        if (Joueur.findOne({ login: login, pass: password })) {
            updateEstDejaConnecte(login);
            console.log("Compte trouvé.");
            return true;
        }
    }
    console.log("Mauvaise paire, login / mdp");
    return false;
}


// GET la liste des joueurs
function getAllJoueur() {
    var promise = Joueur.find().exec();
    promise.then(function (doc) {
        if (doc) {
            console.log(doc);
            return doc;
        }
    });
}

// GET le nombre de parties gagnées d'un login
function getNbParties(login) {
    var promise = Joueur.findOne({ login: login }).exec();
    promise.then(function (doc) {
        console.log("Get nbParties : " + doc.nbPartiesGagnees);
        //if(afficherDansHTMLLeTexteSuivant(doc.nbPartiesGagnees)) return true; else return false;
        //remplacer par la méthode faisant la maj dans le leaderboard
    });
}

// GET le booléen estDejaConnecte d'un login
function getEstDejaConnecte(login) {
    var promise = Joueur.findOne({ login: login }).exec();
    promise.then(function (doc) {
        console.log("Get estDejaCo : " + doc.estDejaConnecte);
        if (doc.estDejaConnecte) {
            return true;
        } else {
            return false;
        }
    });
}

// GET le booléen estEnPartie d'un login
function getEstEnPartie(login) {
    var promise = Joueur.findOne({ login: login }).exec();
    promise.then(function (doc) {
        console.log("Get estEnPartie : " + doc.estEnPartie);
        if (doc.estEnPartie) {
            return true;
        } else {
            return false;
        }
    });
}

// Incrémente le nombre de parties gagnées d'un login
function plusUnePartieGagnee(login) {
    var promise = Joueur.findOne({ login: login }).exec();
    promise.then(function (doc) {
        console.log("PlusUne avant : " + doc.nbPartiesGagnees);
        doc.nbPartiesGagnees += 1;
        console.log("PlusUne après : " + doc.nbPartiesGagnees);
        try {
            console.log("Update de nbPartie+=1...");
            doc.save();
            console.log("Update done.");
            return true;
        }
        catch {
            console.log("Erreur de l'update de nbPartie+=1.");
            return false;
        }
    });
}

// Change la valeur du booléen estDejaConnecte d'un login
function updateEstDejaConnecte(login) {
    var promise = Joueur.findOne({ login: login }).exec();
    promise.then(function (doc) {
        console.log("Update estDejaCo avant : " + doc.estDejaConnecte);
        doc.estDejaConnecte = !doc.estDejaConnecte;
        console.log("Update estDejaCo après : " + doc.estDejaConnecte);
        try {
            console.log("Update de estDejaCo...");
            doc.save();
            console.log("Update done.");
            return true;
        }
        catch {
            console.log("Erreur de l'update de estDejaCo.");
            return false;
        }
    });
}

// Change la valeur du booléen estEnPartie d'un login
function updateEstEnPartie(login) {
    var promise = Joueur.findOne({ login: login }).exec();
    promise.then(function (doc) {
        console.log("Update estEnPartie avant : " + doc.estEnPartie);
        doc.estEnPartie = !doc.estEnPartie;
        console.log("Update estEnPartie après : " + doc.estEnPartie);
        try {
            console.log("Update de estDejaEnPartie...");
            doc.save();
            console.log("Update done.");
            return true;
        }
        catch {
            console.log("Erreur dans l'update de estDejaEnPartie.");
            return false;
        }
    });
}

//----------------- Partie ------------------------------//

// Ajoute une nouvelle partie dans la BD
function ajouterUneNouvellePartie(login1, login2, board, dernierJoueur) {
    var game = new PartieS({ login1: login1, login2: login2, board: board, dernierJoueur: dernierJoueur });
    try {
        console.log(login1);
        console.log(login2);
        console.log(board);
        console.log(dernierJoueur);
        console.log("Enregistrement de la nouvelle partie...");
        game.save();
        console.log("Enregistrement done.");
        return true;
    }
    catch {
        console.log("Erreur dans l'enregistrement de la nouvelle partie.")
        return false;
    }
}

// GET la liste des Parties (en cours)
function getAllParties() {
    var promise = PartieS.find().exec();
    promise.then(function (doc) {
        return doc;
    })
}

// GET le board et le dernierJoueur d'une partie
function getBoardEtDernierJoueur(login1, login2) {
    var promise = PartieS.findOne({ login1: login1, login2: login2 }).exec();
    promise.then(function (doc) {
        console.log("Get board : " + doc.board);
        console.log("Get dernierJ : " + doc.dernierJoueur);
        return [doc.board, doc.dernierJoueur];
    });
}

// Met à jour le board et le dernierJoueur d'une partie
function updateBoardEtDernierJoueur(login1, login2, board, dernier) {
    var promise = PartieS.findOne({ login1: login1, login2: login2 }).exec();
    promise.then(function (doc) {
        doc.board = board;
        doc.dernierJoueur = dernier;
        try {
            console.log("Update board et dernier...");
            doc.save();
            console.log("Update done.");
            return true;
        }
        catch {
            console.log("Erreur dans l'update board et dernier.")
            return false;
        }
    });
}

// DELETE d'une partie dans la BD
function deletePartieFinie(login1, login2) {
    try {
        console.log("Suppression de la partie...");
        PartieS.deleteOne({ login1: login1, login2: login2 }).exec();
        console.log("Supp done.");
        return true;
    }
    catch {
        console.log("Erreur dans le delete.");
        return false;
    }
}
//////////////////////////////////////////////////// BD ////////////////////////////////////////////////////////////////////////////


// Connexion à la BD
function ouvrirDB() {
    mongoose.connect('mongodb://localhost:27017/dameGame');
    console.log("Connection...");
}

// Fermeture de la connexion
function fermerDB() {
    mongoose.connection.close();
    console.log("Closing connection.")
}

ouvrirDB();

//  Pour tester si la connection fonctionne bien
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connection Successful!");
});

////////////////////////////////////////////////// Websocket //////////////////////////////////////////////////////////////////

/** - ça vient du serveur + ça vient d'un client
 * code 0 : donne ton nom
 * code 0.5 : je souhaite rejouer
 * code 1 : démarrer une partie
 * code 2 : joue
 * code 3 : execute ce coup
 * code 4 : victoire/défaite
 * code 5 : la partie est supprimée
 * code 5.5 : la partie est supprimée suite au désistement de l'autre joueur
 * code 6 : un joueur a quitté la partie / je ne souhaite plus attendre
 * code 7 : le joueur s'est reconnecté la partie va reprendre
 * code 8 : voici le tableau que tu dois utiliser (joueur qui se reconnecte)
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

var promise = PartieS.find().exec();
promise.then(function (doc) {
    console.log("Init du serveur...");
    for (var i = 0; i < doc.length; i++) {
        var j1 = new Clients("", doc[i].login1);
        var j2 = new Clients("", doc[i].login2);
        var partie = new Partie(j1, j2, i);
        lastId = i;
        partie.lastPlayer = doc[i].dernierJoueur;
        partie.etat = "Paused"
        partieEncours.push(partie);
    }
    console.log("Init terminé");
})

//Mise en place des événements WebSockets 
console.log("Serveur créé");
wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);
    if (clientsUnknown.indexOf(connection) === -1) {
        clientsUnknown.push(connection);
        console.log("J'ai une connexion");
        var promise = Joueur.find().exec();
        promise.then(function (doc) {
            if (doc) {
                console.log(doc);
                clientsUnknown[clientsUnknown.length - 1].send(JSON.stringify({ code: 0, leaderscore: doc }));
            }
        });
    }

    /** 
     * En cas de reception d'un message depuis un client
     * On traite le message avec la fonction findcode
     */
    connection.on('message', function (message) {
        var message = JSON.parse(message.utf8Data);
        findCode(message, connection);


    });

    /** 
     * En cas de fermeture d'une connection 
     * On verifie ou se trouvais cette connection pour la retirer correctement
     */
    connection.on('close', function (reasonCode, description) {
        var p = findPartyFromConnection(connection);
        console.log("Une connexion de perdu");
        if (p !== false) { // le joueur était en partie
            console.log("Le joueur était en partie");
            if (p.joueur1.connection === connection) {
                updateEstDejaConnecte(p.joueur1.name);
                p.j1R = false;
            } else if (p.joueur2.connection === connection) {
                updateEstDejaConnecte(p.joueur2.name);
                p.j2R = false;
            }
            p.setPause(connection);
        } else { //le joueur n'y était pas
            var uc = findUnknownFromConnection(connection);
            if (uc !== false) {
                clientsUnknown.splice(uc, 1);
            }
            var dc = findClientsDispoFromConnection(connection);
            if (dc !== false) {
                updateEstDejaConnecte(clientsDispo[dc].name);
                clientsDispo.splice(dc, 1);
            }
            var ac = findClientsEnAttenteFromConnection(connection);
            if (ac !== false) {
                updateEstDejaConnecte(clientsEnAttente[ac].name);
                clientsEnAttente.splice(ac, 1);
            }
        }
    });

});

/** 
 * params message : JSON {} , connection : socket {}
 * Fonction principale de traitement des messages 
 * 
 */
function findCode(message, connection) { 
    if (message.code === 0) {
        console.log("Réception code 0");
        var promise = Joueur.findOne({ login: message.myName, pass: message.password }).exec();
        promise.then(function (doc) {
            if (doc) {
                updateEstDejaConnecte(message.myName);
                console.log("Compte trouvé.");
                connection.send(JSON.stringify({ code: 0.1, value: true }));
            } else {
                var promise2 = Joueur.findOne({ login: message.myName }).exec();
                promise2.then(function (res) {
                    if (res) {
                        console.log("Mauvaise paire, login / mdp");
                        connection.send(JSON.stringify({ code: 0.1, value: false }));
                    } else {
                        var joueur = new Joueur({ login: message.myName, pass: message.password });
                        console.log("Tentative d'inscription dans la BD...");
                        joueur.save().then(res => {console.log(res);updateEstDejaConnecte(message.myName)});
                        console.log("Compte créé.");
                        connection.send(JSON.stringify({ code: 0.1, value: true }));
                    }
                })
            }
        })
    } else if (message.code === 0.3) {
        console.log("Réception code 0.3");
        var promise = Joueur.findOne({ login: message.myName }).exec();
        promise.then(function (doc) {
            console.log("Get estEnPartie : " + doc.estEnPartie);
            if (doc.estEnPartie) {
                var p = findPartyByLogin(message.myName);
                console.log("Je suis en partie");
                if (p.joueur1.name === message.myName) {
                    p.joueur1.connection = connection;
                    var promise = PartieS.findOne({ login1: p.joueur1.name, login2: p.joueur2.name }).exec();
                    promise.then(function (doc) {
                        var ans = { code: 8, name: message.myName, nameAd: p.joueur2.name, size: p.size, isFirst: true, id: p.id, boardCase: doc.board }
                        p.sendJ1(JSON.stringify(ans));
                    });
                } else {
                    p.joueur2.connection = connection;
                    var promise = PartieS.findOne({ login1: p.joueur1.name, login2: p.joueur2.name }).exec();
                    promise.then(function (doc) {
                        var ans = { code: 8, name: message.myName, nameAd: p.joueur1.name, size: p.size, isFirst: false, id: p.id, boardCase: doc.board }
                        p.sendJ2(JSON.stringify(ans));
                    });
                }
            } else {
                console.log("Ref du getestenpartie");
                setName(message.myName, connection);
                startGame();
            }
        });
    } else if (message.code === 0.5) {
        console.log("Réception code 0.5")
        for (var i = 0; i < clientsEnAttente.length; i++) {
            if (clientsEnAttente[i].connection === connection) {
                clientsDispo.push(clientsEnAttente[i]); 
                clientsEnAttente.splice(i, 1);
            }
        }
        startGame();
    } else if (message.code === 1) {
        console.log("Réception code 1");
        var partie = findParty(message.id);
        console.log("Info recu dans le code 1 :");
        console.log(message.id);
        console.log(message.ready);
        if (partie.joueur1.connection === connection && message.ready) {
            partie.j1R = true;
            console.log("J1 est ready");
        } else if (partie.joueur2.connection === connection && message.ready) {
            partie.j2R = true;
            console.log("J2 est ready");
        }
        if (partie.j1R === true && partie.j2R === true) {
            partie.changeState("Started");
        }
    } else if (message.code === 2) {
        console.log("Réception code 2");
        var partie = findParty(message.id);
        partie.changeLastPlayer();
        var promise = PartieS.findOne({ login1: partie.joueur1.name, login2: partie.joueur2.name }).exec();
        promise.then(function (doc) {
            doc.board = message.board;
            doc.dernierJoueur = partie.lastPlayer.name;
            try {
                console.log("Update board et dernierJoueur...");
                doc.save();
                console.log("Update done.");
                if (partie.joueur1.connection === connection) {
                    var mj2 = JSON.stringify({ code: 3, shot: message.shot, pionpos: message.pionpos, eatedpionPos: message.eatedpionPos });
                    partie.sendJ2(mj2);
                } else {
                    var mj1 = JSON.stringify({ code: 3, shot: message.shot, pionpos: message.pionpos, eatedpionPos: message.eatedpionPos });
                    partie.sendJ1(mj1);
                }
                return true;
            }
            catch {
                console.log("Erreur dans l'update board et dernierJoueur.")
                return false;
            }
        });
    } else if (message.code === 3) {
        console.log("Réception code 3");
        var partie = findParty(message.id);
        if (partie.joueur1.connection === connection) {
            partie.sendJ1(JSON.stringify({ code: 2 }));
        } else {
            partie.sendJ2(JSON.stringify({ code: 2 }));
        }

    } else if (message.code === 4) {
        console.log("Réception code 4");
        var partie = findParty(message.id);
        if (partie.joueur1.connection === connection) {
            partie.j1end = true;
            if (message.victoire) {
                partie.setVicJ1();
                plusUnePartieGagnee(partie.joueur1.name);
            }
        } else {
            partie.j2end = true;
            if (message.victoire) {
                partie.setVicJ2();
                plusUnePartieGagnee(partie.joueur2.name);
            }
        }
        if (partie.j1end && partie.j2end) {
            removePartie(partie)
            deletePartieFinie(partie.joueur1.name, partie.joueur2.name);
            updateEstEnPartie(partie.joueur1.name);
            updateEstEnPartie(partie.joueur2.name);
        }
    } else if (message.code === 6) {
        console.log("Réception code 6");
        var partie = findParty(message.id);
        console.log(partie)
        if (partie.etat === "Paused") {
            removePartiePaused(partie, connection)
            deletePartieFinie(partie.joueur1.name, partie.joueur2.name);
            updateEstEnPartie(partie.joueur1.name);
            updateEstEnPartie(partie.joueur2.name);
        }

    } else if (message.code === 7) {
        console.log("Réception code 7");
        var partie = findParty(message.id);
        if (partie.etat === "Paused") {
            if (partie.joueur1.connection === connection) {
                partie.sendJ2(JSON.stringify({ code: 8, boardCase: message.boardCase }));
            } else {
                partie.sendJ1(JSON.stringify({ code: 8, boardCase: message.boardCase }))
            }
        }
    } else if (message.code === 8) {
        console.log("Réception code 8");
        var partie = findParty(message.id);
        if (partie.joueur1.connection === connection) {
            partie.j1R = true;
        } else if (partie.joueur2.connection === connection) {
            partie.j2R = true;
        }
        if (partie.j1R && partie.j2R) {
            partie.etat = "Started";
            var promise = PartieS.findOne({ login1: partie.joueur1.name, login2: partie.joueur2.name }).exec();
            promise.then(function (doc) {
                if (doc.dernierJoueur === partie.joueur1.name) {
                    partie.sendJ2(JSON.stringify({ code: 2 }));
                } else {
                    partie.sendJ1(JSON.stringify({ code: 2 }))
                }
                if (partie.joueur1.connection === connection) {
                    partie.sendJ2(JSON.stringify({ code: 7 }));
                } else {
                    partie.sendJ1(JSON.stringify({ code: 7 }));
                }
            });
        } else {
            if (partie.j1R && !partie.j2R) {
                partie.sendJ1(JSON.stringify({ code: 6 }));
            } else if (partie.j2R && !partie.j1R) {
                partie.sendJ2(JSON.stringify({ code: 6 }));
            }
        }

    }
}

/** 
 * Fonction de création de partie
 * Ou de mis en attente du joueur
 */
function startGame() {
    if (clientsDispo.length === 2) { // s'il y a deux clients dispos on crée une partie et on les retire
        var p = new Partie(clientsDispo[0], clientsDispo[1], lastId); /// à chaque connexion il crée potentiellement une partie 
        lastId = lastId + 1;
        partieEncours.push(p);
        clientsDispo = clientsDispo.slice(2);
        console.log("Une partie de créée");
        p.start();
        updateEstEnPartie(p.joueur1.name);
        updateEstEnPartie(p.joueur2.name);
        ajouterUneNouvellePartie(p.joueur1.name, p.joueur2.name, [], p.joueur2.name); 
    }else{
        clientsDispo[0].connection.send(JSON.stringify({code : 0.2}));
    }
}

/** 
 * 
 * param partie : Partie
 * retire de partieEnCours la partie passé en parametre et replace les joueurs dans la file d'attente
 */
function removePartie(partie) {
    for (var i = 0; i < partieEncours.length; i++) {
        if (partieEncours[i].id === partie.id) {
            partieEncours.splice(i, 1);
        }
    }
    var promise = Joueur.find().exec();
    promise.then(function (doc) {
        if (doc) {
            partie.sendJ1(JSON.stringify({ code: 5, victoire: partie.j1Vic, leaderscore: doc }));
            partie.sendJ2(JSON.stringify({ code: 5, victoire: partie.j2Vic, leaderscore: doc }));
        }
    });
    clientsEnAttente.push(partie.joueur1);
    clientsEnAttente.push(partie.joueur2);
}

/** 
 * params partie : Partie , connection  : socket
 * retire la partie passé en parametre et envoie au joueur qui etais rester les instructions pour se reconnecter
 */
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

/** 
 * param id : number
 * Trouve une partie en cours selon son id
 */
function findParty(id) {
    for (var i = 0; i < partieEncours.length; i++) {
        if (partieEncours[i].id === id) {
            return partieEncours[i];
        }
    }
}

/** 
 * param login : string
 * Trouve une partie selon un login
 */
function findPartyByLogin(login) {
    console.log(login);
    console.log(partieEncours);
    for (var i = 0; i < partieEncours.length; i++) {
        if (partieEncours[i].joueur1.name === login || partieEncours[i].joueur2.name === login) {
            console.log("J'ai trouvé la partie");
            console.log(partieEncours[i]);
            return partieEncours[i];
        }
    }
    return false;
}


/** 
 * param connection : socket
 * Trouve une partie en cours selon le socket en parametre
 */
function findPartyFromConnection(connection) {
    for (var i = 0; i < partieEncours.length; i++) {
        if (partieEncours[i].joueur1.connection === connection || partieEncours[i].joueur2.connection === connection) {
            return partieEncours[i];
        }
    }
    return false;
}

/** 
 * param connection :socket
 * Trouve un client disponible selon le socket en parametre
 * 
 */
function findClientsDispoFromConnection(connection) {
    for (var i = 0; i < clientsDispo.length; i++) {
        if (clientsDispo[i].connection === connection) {
            return i;
        }
    }
    return false;
}

/** 
 * param connection : socket
 * Trouve un client unknown selon le socket en parametre
 * 
 */
function findUnknownFromConnection(connection) {
    for (var i = 0; i < clientsUnknown.length; i++) {
        if (clientsUnknown[i] === connection) {
            return i;
        }
    }
    return false;
}

/** 
 * param connection  : socket
 * Trouve un client en attente selon le socket en parametre
 */
function findClientsEnAttenteFromConnection(connection) {
    for (var i = 0; i < clientsEnAttente.length; i++) {
        if (clientsEnAttente[i].connection === connection) {
            return i;
        }
    }
    return false;
}

/** 
 * params name : string , connection  : socket
 * Créer un nouveau client à partir des informations en parametre et le place dans clientsDispo
 */
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
        this.j1Vic = false;
        this.j2Vic = false;
        this.j1R = false;
        this.j2R = false;
        this.id = id;
        this.j1end = false;
        this.j2end = false;
        this.lastPlayer = j2;
        this.size = 10;
        this.etat = "noStart"; /** noStart Started Paused End  */
    }

    /** 
     * Annonce au client que la partie demarre
     */
    start() {
        var mj1 = { code: 1, name: this.joueur1.name, nameAd: this.joueur2.name, size: this.size, isFirst: true, id: this.id };
        var mj2 = { code: 1, name: this.joueur2.name, nameAd: this.joueur1.name, size: this.size, isFirst: false, id: this.id };
        this.joueur1.connection.send(JSON.stringify(mj1));
        this.joueur2.connection.send(JSON.stringify(mj2));
    }

    setVicJ1() {
        this.j1Vic = true;
    }

    setVicJ2() {
        this.j2Vic = true;
    }


    changeState(newState) {
        this.etat = newState;
        this.exeState();
    }

    exeState() {
        console.log("J'exec state")
        if (this.etat === 'Started') {
            var j1m = JSON.stringify({ code: 2 });
            this.sendJ1(j1m);
        }
    }

    changeLastPlayer() {

        if (this.lastPlayer === this.joueur1) {
            this.lastPlayer = this.joueur2;
            console.log("Le player actuel est le : 2 ");
        } else {
            this.lastPlayer = this.joueur1;
            console.log("Le player actuel est le : 1 ");
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
        console.log("La partie est mise en pause");
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