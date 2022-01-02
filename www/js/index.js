/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
// document.addEventListener('deviceready', onDeviceReady, false);

// function onDeviceReady() {
//     // Cordova is now initialized. Have fun!

//     console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
//     document.getElementById('deviceready').classList.add('ready');
// }

/** 
 * code 0 : donne ton nom
 * code 1 : demarrer une partie
 * code 2 : joue
 * code 3 : execute ce coup
 * code 4 : victoire/defaite
 */

const onlinemode = true;
game = "";
const nameJ = "jean";

if (onlinemode) {

    restart = () => { // ne fonctionne pas car place directement avant qu'il est rappuyer sur rejouer le deuxieme joueur en partie et donc fais n'importe quoi mdrrr il vas falloir rajouter un code
        document.getElementById("endGame").classList.add("hidden");
        var myNode = document.getElementById("board");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.lastChild);
        }
        ws.send(JSON.stringify({ code: 0.5 }));
    }

    stopWait = () => { // ne fonctionne pas car place directement avant qu'il est rappuyer sur rejouer le deuxieme joueur en partie et donc fais n'importe quoi mdrrr il vas falloir rajouter un code
        document.getElementById("pauseGame").classList.add("hidden");
        var myNode = document.getElementById("board");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.lastChild);
        }
        ws.send(JSON.stringify({ code: 6,id : game.id  }));
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
        game.board.getVizBoard();

        restart = () => {
            document.location.href = "index.html";
        }
    }
}

function findCode(message, ws) {
    if (message.code === 0) {
        console.log("reception code 0");
        var ans = JSON.stringify({ code: 0, myName: nameJ });
        ws.send(ans);
    } else if (message.code === 1) {
        console.log("reception code 1");
        window.game = new PartyOnLine(message.name, message.nameAd, message.size, message.isFirst, message.id, ws,false);
        var ans = JSON.stringify({ code: 1, id: window.game.id, ready: true });
        ws.send(ans);
    } else if (message.code === 2) {
        console.log("reception code 2");
        window.game.play();
    } else if (message.code === 3) {
        console.log("reception code 3");
        var e = cycle.retrocycle(message.shot);
        console.log(message.pionpos);
        console.log(message.eatedpionPos);
        var msg = new Shot(game.getPion(message.pionpos), game.getCase(e.destination.position), game.getPionEated(message.eatedpionPos), e.queen);
        window.game.playAShot(
            msg
        );
    } else if (message.code === 5) {
        console.log("reception code 5");
        document.getElementById("endGame").classList.remove("hidden");
        let endGame = document.querySelector("#endGame>p");
        var nameVic = '';
        if (game.player.color === "white" && game.board.whitePions.length) {
            nameVic = game.player.name
        } else if (game.player.color === "white" && game.board.blackPions.length) {
            nameVic = game.playerAd.name
        } else if (game.player.color === "black" && game.board.blackPions.length) {
            nameVic = game.playerAd.name
        } else {
            nameVic = game.player.name
        }
        endGame.innerHTML = nameVic + " à gagné";
    }else if(message.code === 5.5){
        console.log("reception code 5.5");
        document.getElementById("endGame").classList.remove("hidden");
        let endGame = document.querySelector("#endGame>p");
        endGame.innerHTML = "Vous avez gagné";
    }else if(message.code === 6){
        console.log("reception code 6");
        document.getElementById("pauseGame").classList.remove("hidden");
        game.stop();
    }else if(message.code === 7){
        var ans = JSON.stringify({code : 7, id: game.id, boardCase : game.board.getVizBoard()});
        ws.send(ans);
    }else if(message.code === 8){
        window.game = new PartyOnLine(message.name, message.nameAd, message.size, message.isFirst, message.id, ws,message.boardCase);
        ws.send(JSON.stringify({code :8, id:game.id}));
    }
}

