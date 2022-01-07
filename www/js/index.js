
//////////////////////////////////////////////////////////////// Constante coté client ////////////////////////////////////////////////////////////////////////////////////////////
const onlinemode = true; //possibilité de jouer directement hors-ligne (paramètre non accessible si le client est lancé)
game = "";
nameJ = ""
passJ = ""


////////////////////////////////////////////////////////////////// Fonction du jeu /////////////////////////////////////////////////////////////////////////////////////////
if (onlinemode) {

    /** 
     * cache le bordereau d'information en cas de mauvais mot de passe
     */
    retryConnection = () => {
        window.document.getElementById("wrongPass").classList.add("hidden");
    }

    /** 
     * cache le leaderboard et affiche un plateau de jeu
     * émet un signal vers le serveur pour signifier son envie de démarrer une partie
     */
    play = () => {
        window.document.getElementById("homeVue").style.display = "none";
        window.document.getElementById("board").classList.remove("hidden");
        var ans = JSON.stringify({ code: 0.3, myName: nameJ });
        ws.send(ans);
    }

    /** 
     * essaye de se connecter en récuperant les valeurs des inputs
     */
    signIn = () => {
        console.log("je m'inscrit");
        nameJ = window.document.getElementById("username").value;
        passJ = window.document.getElementById("password").value;
        var ans = JSON.stringify({ code: 0, myName: nameJ, password: passJ });
        ws.send(ans);
    }

    /** 
     * Retire le bordereau d'information en cas de fin de partie et retire du plateau tout les elements HTML qu'il contient
     * affiche le leaderboard
     */
    restart = () => { 
        document.getElementById("endGame").classList.add("hidden");
        var myNode = document.getElementById("board");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.lastChild);
        }
        window.document.getElementById("board").classList.add("hidden");
        window.document.getElementById("home2Vue").style.display = "block";

    }

    /** 
     * retire le leaderboard et affiche le plateau de jeu
     * signifie au serveur qu'il souhaite rejouer 
     */
    playAgain = () => {
        window.document.getElementById("home2Vue").style.display = "none";
        window.document.getElementById("board").classList.remove("hidden");
        ws.send(JSON.stringify({ code: 0.5 }));
    }

    /** 
     * retire le bordereau d'information en cas de pause de la partie et detruit tous les élements
     * du board afin d'ensuite signifier au serveur qu'il ne souhaitait plus attendre 
     */
    stopWait = () => { 
        document.getElementById("pauseGame").classList.add("hidden");
        var myNode = document.getElementById("board");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.lastChild);
        }
        ws.send(JSON.stringify({ code: 6, id: game.id }));
    }


    const ws = new WebSocket('ws://127.0.1:9898/'); //on ouvre la connexion 

    //lors du handshake entre le client et le serveur
    ws.onopen = function () {
        console.log("Je suis connecté");
    };

    //lors de la reception d'un message on le traduit dans le bon format
    ws.onmessage = function (e) {
        var msg = JSON.parse(e.data);
        findCode(msg, ws);
    };

    //en cas d'erreur avec le serveur on affiche
    ws.onerror = function (event) {
        console.error("WebSocket error observed:", event);
    };

} else {
    // si l'on a parametré le modeonline = false;
    window.onload = function () {
        var game = new Party("Jean", "Paul", 10);

        restart = () => {
            document.location.href = "index.html";
        }
    }
}

/** 
 * détruit tous les élements du leaderboard
 */
function undrawLeaderBoard() {
    var myNode = document.getElementById("scoreboard");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }
}

/** 
 * param tab
 * dessine un tout nouveau leaderboard CONTINUER A PARTIR D'ICI
 */
function drawLeaderBoard(tab) {
    var ld = window.document.getElementsByClassName("scoreboard");
    for (var j = 0; j < ld.length; j++) {
        var divI = document.createElement("div");
        var spanI1 = document.createElement('span');
        spanI1.innerHTML = "pseudo";
        var spanI2 = document.createElement('span');
        spanI2.innerHTML = "score";
        divI.appendChild(spanI1);
        divI.appendChild(spanI2);
        ld[j].appendChild(divI);
        for (var i = 0; i < tab.length; i++) {
            var div = document.createElement("div");
            div.classList.add("item");
            var span = document.createElement('span');
            console.log(tab[i].login);
            span.innerHTML = tab[i].login;
            var span2 = document.createElement("span");
            span2.innerHTML = tab[i].nbPartiesGagnees;
            div.appendChild(span);
            div.appendChild(span2);
            ld[j].appendChild(div);
        }
    }
}


function findCode(message, ws) {
    if (message.code === 0) {
        console.log("reception code 0");
        drawLeaderBoard(message.leaderscore);
    } else if (message.code === 0.1) {
        console.log('reception code 0.1')
        if (message.value) {
            console.log("je continue le compte est ok");
            window.document.getElementById("logVue").style.display = "none";
            window.document.getElementById("homeVue").style.display = "block";
        } else {
            console.log("je continue pas le code est pas ok");
            window.document.getElementById("wrongPass").classList.remove("hidden");
        }
    } else if (message.code === 0.2) {
        game = new Party("Vous", "Enemi", 10);
    }
    else if (message.code === 1) {
        console.log("reception code 1");
        var myNode = document.getElementById("board");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.lastChild);
        }
        var el = document.getElementById('board'),
            elClone = el.cloneNode(true);
        el.parentNode.replaceChild(elClone, el);

        game = new PartyOnLine(message.name, message.nameAd, message.size, message.isFirst, message.id, ws, false);
        var ans = JSON.stringify({ code: 1, id: game.id, ready: true });
        ws.send(ans);
        console.log(game);
    } else if (message.code === 2) {
        console.log("reception code 2");
        game.play();
    } else if (message.code === 3) {
        console.log("reception code 3");
        var e = cycle.retrocycle(message.shot);
        console.log(message.pionpos);
        console.log(message.eatedpionPos);
        var msg = new Shot(game.getPion(message.pionpos), game.getCase(e.destination.position), game.getPionEated(message.eatedpionPos), e.queen);
        game.playAShot(
            msg
        );
    } else if (message.code === 5) {
        console.log("reception code 5");
        document.getElementById("endGame").classList.remove("hidden");
        let endGame = document.querySelector("#endGame>p");
        if (message.victoire) {
            endGame.innerHTML = "Vous avez gagné";
        } else {
            endGame.innerHTML = "Vous avez perdu";
        }
        var el = document.getElementById('board'),
            elClone = el.cloneNode(true);
        el.parentNode.replaceChild(elClone, el);
        undrawLeaderBoard();
        drawLeaderBoard(message.leaderscore);

    } else if (message.code === 5.5) {
        console.log("reception code 5.5");
        document.getElementById("endGame").classList.remove("hidden");
        let endGame = document.querySelector("#endGame>p");
        endGame.innerHTML = "Vous avez gagné";
    } else if (message.code === 6) {
        console.log("reception code 6");
        document.getElementById("pauseGame").classList.remove("hidden");
        game.stop();
    } else if (message.code === 7) {
        console.log("reception code 7");
        document.getElementById("pauseGame").classList.add("hidden");
    } else if (message.code === 8) {
        console.log("reception code 8");
        game = new PartyOnLine(message.name, message.nameAd, message.size, message.isFirst, message.id, ws, message.boardCase);
        ws.send(JSON.stringify({ code: 8, id: game.id }));
    }
}

