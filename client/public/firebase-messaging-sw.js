importScripts('https://www.gstatic.com/firebasejs/8.2.6/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.6/firebase-messaging.js')

firebase.initializeApp({
    apiKey: "AIzaSyBY_mpPfj14hIktBjGmbpipBL6xVXV2vLo",
    authDomain: "mal3abi-cloud-messaging-d79da.firebaseapp.com",
    projectId: "mal3abi-cloud-messaging-d79da",
    storageBucket: "mal3abi-cloud-messaging-d79da.appspot.com",
    messagingSenderId: "155219898004",
    appId: "1:155219898004:web:855bb0fec69bcd34894e81",
    measurementId: "G-GS1TSHNN0L"
});

const messaging = firebase.messaging();