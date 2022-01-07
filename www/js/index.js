
/** 
 * code 0 : donne ton nom
 * code 1 : demarrer une partie
 * code 2 : joue
 * code 3 : execute ce coup
 * code 4 : victoire/defaite
 */


const onlinemode = true;
game = "";
nameJ = ""
passJ = ""



if (onlinemode) {

    retryConnection = () => {
        window.document.getElementById("wrongPass").classList.add("hidden");
    }

    play = () => {
        window.document.getElementById("homeVue").style.display = "none";
        window.document.getElementById("board").classList.remove("hidden");
        var ans = JSON.stringify({ code: 0.3, myName: nameJ });
        ws.send(ans);
    }

    signIn = () => {
        console.log("je m'inscrit");
        nameJ = window.document.getElementById("username").value;
        passJ = window.document.getElementById("password").value;
        var ans = JSON.stringify({ code: 0, myName: nameJ, password: passJ });
        ws.send(ans);
    }

    restart = () => { // ne fonctionne pas car place directement avant qu'il est rappuyer sur rejouer le deuxieme joueur en partie et donc fais n'importe quoi mdrrr il vas falloir rajouter un code
        document.getElementById("endGame").classList.add("hidden");
        var myNode = document.getElementById("board");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.lastChild);
        }
        window.document.getElementById("board").classList.add("hidden");
        window.document.getElementById("home2Vue").style.display = "block";

    }

    playAgain = () => {
        window.document.getElementById("home2Vue").style.display = "none";
        window.document.getElementById("board").classList.remove("hidden");
        ws.send(JSON.stringify({ code: 0.5 }));
    }

    stopWait = () => { // ne fonctionne pas car place directement avant qu'il est rappuyer sur rejouer le deuxieme joueur en partie et donc fais n'importe quoi mdrrr il vas falloir rajouter un code
        document.getElementById("pauseGame").classList.add("hidden");
        var myNode = document.getElementById("board");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.lastChild);
        }
        ws.send(JSON.stringify({ code: 6, id: game.id }));
    }
    const ws = new WebSocket('ws://127.0.1:9898/'); //on ouvre la connexion 

    ws.onopen = function () {
        console.log("je suis connécté");
    };

    ws.onmessage = function (e) {
        var msg = JSON.parse(e.data);
        findCode(msg, ws);
    };

    ws.onerror = function (event) {
        console.error("WebSocket error observed:", event);
    };

} else {
    window.onload = function () {
        var game = new Party("Jean", "Paul", 10);

        restart = () => {
            document.location.href = "index.html";
        }
    }
}


function undrawLeaderBoard() {
    var myNode = document.getElementById("board");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }
}

function drawLeaderBoard(tab) {
    var ld = window.document.getElementsByClassName("scoreboard");
    console.log(tab);
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

