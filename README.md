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

### Soit avoir MongoDB Compass

Se connecter à l'adresse suivante : mongodb://localhost:27017/dameGame

### Soit lancer un cmd

1. LaunchCordova.bat
2. mongo
3. use dameGame
4. show collections
5. db.joueurs.find() et db.parties.find()

### En cas de mauvaise manipulation
Pour drop les tables : db.TABLE.drop()
