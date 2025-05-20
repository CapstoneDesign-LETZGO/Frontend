importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

// Firebase 초기화
firebase.initializeApp({
    apiKey: "AIzaSyBE2qnerf84BzJOHTgl5aB7NXvGfulzlp0",
    authDomain: "letzgo-v1.firebaseapp.com",
    projectId: "letzgo-v1",
    storageBucket: "letzgo-v1.firebasestorage.app",
    messagingSenderId: "285801023043",
    appId: "1:285801023043:web:5bbe8e79f2283fe92636f6",
    measurementId: "G-CKHXRFN1VF"
});

// 메시지 수신 및 알림 표시
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] 백그라운드 메시지 수신:', payload);

    const { title, body, icon } = payload.notification;

    self.registration.showNotification(title, {
        body: body,
        icon: icon || '/icon.png' // 기본 아이콘 경로
    });
});
