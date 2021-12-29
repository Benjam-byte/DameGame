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
game="";
const nameJ = "jean";

if(onlinemode){
    const ws = new WebSocket('ws://127.0.1:9898/'); //on ouvre la connexion 

    ws.onopen = function () {
        console.log("je suis connécté");
    };

    ws.onmessage = function (e) {
        var msg= JSON.parse(e.data);
        findCode(msg,ws);
    };

    ws.onerror = function (event) {
        console.error("WebSocket error observed:", event);
    };

}else{
    window.onload=function()   { 
        var game = new Party("Jean", "Paul", 10);
    
        restart = () => {
            // document.getElementById("endGame").classList.add("hidden");
            // document.getElementById("board").innerHTML = "";
            // game = new Party("Jean2", "Paul2", 6 )
            document.location.href="index.html"; 
        }
    }
}

function findCode(message,ws){
    if(message.code === 0){
        console.log("reception code 0");
        var ans = JSON.stringify({code : 0,myName : nameJ});
        ws.send(ans);
    }else if(message.code === 1 ){
        console.log("reception code 1");
        window.game = new PartyOnLine(message.name,message.nameAd,message.size,message.isFirst,message.id,ws);
        var ans = JSON.stringify({code :1,id:window.game.id,ready:true});
        ws.send(ans);
    }else if(message.code === 2){
        console.log("reception code 2");
        window.game.play();
    }else if(message.code === 3){
        console.log("reception code 3");
        var e = cycle.retrocycle(message.shot);
        console.log(message.pionpos);
        var msg = new Shot(game.getPion(message.pionpos),game.getCase(e.destination.position),e.eatedPion,e.queen);
        window.game.playAShot(
            msg
        );
        ws.send(JSON.stringify({code : 3,id : game.id}));
    }
}

