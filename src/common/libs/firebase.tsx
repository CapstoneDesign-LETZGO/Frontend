import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage } from 'firebase/messaging';
import {toast} from "react-toastify";
import { NotificationDto } from '../interfaces/NotificationInterface';
import {formatDate} from "../utils/formatDate.ts";

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

function NotificationToast({ notification }: { notification: NotificationDto }) {
    return (
        <div className="w-full p-3 bg-white text-xs flex items-center space-x-3">
            <img
                src={notification.senderProfileUrl ?? '/icons/user/user_4_line.svg'}
                alt="프로필"
                className="w-8 h-8 rounded-full object-cover"
            />
            <div className="text-gray-800 flex flex-col">
                <span>
                    <span className="font-semibold">
                        {notification.senderNickname ?? '알 수 없음'}
                    </span>
                    {notification.content}
                </span>
                {notification.createdAt && (
                    <div className="flex items-center text-gray-500 text-[11px] mt-0.5">
                        <span className="mx-1">·</span>
                        <span>{formatDate(notification.createdAt)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export function initFirebaseMessaging() {
    onMessage(messaging, (payload) => {
        console.log('포그라운드 메시지 수신:', payload);
        try {
            const body = payload.notification?.body;
            if (!body) return;
            // NotificationDto 타입으로 역직렬화
            const notification: NotificationDto = JSON.parse(body);
            toast(<NotificationToast notification={notification} />, {
                position: 'top-right',
                autoClose: 5000,
                closeOnClick: true,
                hideProgressBar: true,
                pauseOnHover: true,
                draggable: false,
                style: {
                    minWidth: '280px',
                    maxWidth: '360px',
                },
            });
        } catch (err) {
            console.error('FCM 메시지 역직렬화 오류:', err);
        }
    });
}
