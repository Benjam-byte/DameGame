
/** - ca viens du serveur + ca viens d'un client
 * code 0 : donne ton nom
 * code 1 : demarrer une partie
 * code 2 : joue
 * code 3 : execute ce coup
 * code 4 : victoire/defaite
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
var partieEncours = [];
var lastId = 0;

console.log("serveur creer");
//Mise en place des événements WebSockets 
wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);
    if (clientsUnknown.indexOf(connection) === -1) {
        clientsUnknown.push(connection);
        console.log("jai une connection");
        clientsUnknown[clientsUnknown.length-1].send(JSON.stringify({code :0})); 
    }


    connection.on('message', function (message) {
        var message = JSON.parse(message.utf8Data);
        findCode(message,connection);
        
      
    });



    connection.on('close', function (reasonCode, description) {
       
    });

});

function findCode(message,connection){
    if(message.code === 0){
        console.log("reception code 0");
        setName(message.myName,connection);
        if(clientsDispo.length === 2){ // si il y a deux client dispo on creer une partie et on les retires
            var p = new Partie(clientsDispo[0],clientsDispo[1],lastId+1);
            lastId = lastId+1;
            partieEncours.push(p);
            clientsDispo = clientsDispo.slice(2);
            console.log("une partie de créer");
            p.start();

        }
    }else if(message.code === 1){
        console.log("reception code 1");
        var partie = findParty(message.id);
        if(partie.joueur1.connection === connection && message.ready){
            partie.j1R = true;
            console.log("j1 est ready");
        }else if(partie.joueur2.connection === connection && message.ready){
            partie.j2R = true;
            console.log("j2 est ready");
        }
        if(partie.j1R === true && partie.j2R === true){
            partie.changeState("Started");
        }
    }else if(message.code === 2){
        console.log("reception code 2");
        var partie = findParty(message.id);
        if(partie.joueur1.connection === connection ){
            var mj2 = JSON.stringify({code : 3, shot:message.shot,pionpos:message.pionpos});
            partie.sendJ2(mj2);
        }else{
            var mj1 = JSON.stringify({code : 3,  shot:message.shot,pionpos:message.pionpos});
            partie.sendJ1(mj1);
        }
    }else if(message.code ===3){
        console.log("reception code 3");
        var partie = findParty(message.id);
        if(partie.joueur1.connection === connection ){
            partie.sendJ1(JSON.stringify({code :2}));
        }else{
            partie.sendJ2(JSON.stringify({code :2}));
        }

    }else if(message.code === 4){
        console.log("reception code 4");
        var partie = findParty(message.id);
        if(partie.joueur1.connection === connection ){
            console.log("a gagné");
        }else{
            console.log("a gagné");
        }
    }
}
function findParty(id){
    for(var i=0;i<partieEncours.length;i++){
        if(partieEncours[i].id === id){
            return partieEncours[i];
        }
    }
}

function setName(name,connection){
    clientsUnknown.forEach(client => {if(connection === client){
        clientsDispo.push(new Clients(connection,name));
    }})
}

class Partie{
    constructor(j1,j2,id){
        this.joueur1 =j1;
        this.joueur2 = j2;
        this.j1R = false;
        this.j2R = false;
        this.id = id;
        this.size = 10;
        this.etat="noStart"; /** noStart Started Paused End  */
        }

    start(){
        var mj1 = {code : 1,name :this.joueur1.name,nameAd : this.joueur2.name,size : this.size,isFirst:true,id:this.id };
        var mj2 = {code : 1,name :this.joueur2.name,nameAd : this.joueur1.name,size : this.size,isFirst:false,id:this.id };
        this.joueur1.connection.send(JSON.stringify(mj1));
        this.joueur2.connection.send(JSON.stringify(mj2));
    }


    changeState(newState){
        this.etat = newState;
        this.exeState();
    }

    exeState(){
        if(this.etat === 'Started'){
            var j1m = JSON.stringify({code : 2});
            this.sendJ1(j1m);
        }
    }


    sendMessageAll(message){
        this.joueur1.send(message);
        this.joueur2.send(message);
    }

    sendJ1(message){
        this.joueur1.connection.send(message);
    }

    sendJ2(message){
        this.joueur2.connection.send(message);
    }

    setFin(){
        this.etat = "End";
        this.joueur1 ="";
        this.joueur2 ="";
    }
}

class Clients{
    constructor(connection,name){
        this.connection = connection;
        this.name = name;
    }

    setName(name){
        this.name = name;
    }

}