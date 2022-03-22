This is an user interface that simulates ordering food online. It was made with REACT JS and uses the google database Firebase to simulate the backend.

Getting Started
First you will need to setup the database. To do that, you need to create both the "Authentication Database" and the "Realtime Database" on Firebase.

Then you will need your API key from the Authentication Database, and the link from the Realtime Database. Now you have to open the config.js file located on source and place your link from the Realtime Database on the const FIREBASE_DOMAIN and the API Key from the Authentication Database on FIREBASE_APIKEY

Then run npm install and open http://localhost:3000/startproject. Finally just click on populate database and you're ready to go.