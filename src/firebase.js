import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDatMLvcGEa1Xo1Zly9bS1xaV_0CfH6nWg",
    // authDomain: "personal-web-5a5e4.firebaseapp.com",
    // databaseURL: "https://personal-web-5a5e4.firebaseio.com",
    projectId: "iot-website-9610c",
    // storageBucket: "personal-web-5a5e4.appspot.com",
    // messagingSenderId: "154032860057",
    // appId: "1:154032860057:web:1ed650a889ea7dab4f0108",
    // measurementId: "G-W8HP550MQN"
});

const db = firebaseApp.firestore();

const tempAndHumidityRef = db.collection("tempAndHumidity");

export { tempAndHumidityRef };