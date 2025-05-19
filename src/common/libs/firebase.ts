import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage } from 'firebase/messaging';
import {toast} from "react-toastify";

const firebaseConfig = {
    apiKey: "AIzaSyBE2qnerf84BzJOHTgl5aB7NXvGfulzlp0",
    authDomain: "letzgo-v1.firebaseapp.com",
    projectId: "letzgo-v1",
    storageBucket: "letzgo-v1.firebasestorage.app",
    messagingSenderId: "285801023043",
    appId: "1:285801023043:web:5bbe8e79f2283fe92636f6",
    measurementId: "G-CKHXRFN1VF"
};

export const firebaseApp = initializeApp(firebaseConfig);

export const messaging = getMessaging(firebaseApp);

export function initFirebaseMessaging() {
    onMessage(messaging, (payload) => {
        console.log('포그라운드 메시지 수신:', payload);

        const { title, body } = payload.notification || {};
        if (title && body) {
            toast.info(`${body}`, {
                position: "top-right",
                autoClose: 4000,
            });
        }
    });
}
