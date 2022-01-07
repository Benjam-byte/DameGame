# Installation et lancement
- Cloner le repos
- Lancer un cmd
- npm i dans le dossier DameGame
- LaunchCordova.bat pour avoir accès à cordova
- cordova add browser
- node ServeurWsDame.js pour lancer le serveur
- Ouvrir 2 autres cmd avec LaunchCordova.bat
- cordova run browser dans les 2 cmd nouvellement ouvert

## Pour avoir accès à la BD
1. soit avoir MongoDB Compass et se connecter à l'adresse suivante : mongodb://localhost:27017/dameGame
1. soit lancer un cmd, LaunchCordova.bat, mongo, use dameGame, show collections, db.joueurs.find() et db.parties.find()
En cas de mauvaise manipulation, pour drop les tables : db.TABLE.drop()
