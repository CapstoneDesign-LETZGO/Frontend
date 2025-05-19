import { useState } from 'react';
import {
    deleteFcmTokenApi,
    fetchNotificationsApi,
    readNotificationApi,
    saveFcmTokenApi
} from '../services/NotificationService.ts';
import {FcmToken, NotificationDto, NotificationForm} from '../../../common/interfaces/NotificationInterface.ts';
import { useAuthFetch } from '../../../common/hooks/useAuthFetch';
import { toast } from 'react-toastify';

export const useNotification = () => {
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);
    const [loading, setLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    // 알림 목록 조회
    const fetchNotifications = async ()=> {
        setLoading(true);
        try {
            const { notifications, success } = await fetchNotificationsApi(authFetch);
            if (success) {
                setNotifications(notifications);
                return notifications;
            } else {
                return [];
            }
        } catch (err) {
            console.error('알림 목록 조회 중 오류:', err);
            toast.error('알림 목록 조회 중 오류가 발생했습니다.');
            return [];
        } finally {
            setLoading(false);
        }
    };

    // 알림 읽음 처리
    const readNotification = async (notificationIdList: number[]) => {
        setLoading(true);
        try {
            const form: NotificationForm = { notificationIdList };
            await readNotificationApi(authFetch, form);
        } catch (err) {
            console.error('알림 읽음 처리 중 오류:', err);
            toast.error('알림 읽음 처리 중 오류가 발생했습니다.');
            return [];
        } finally {
            setLoading(false);
        }
    };

    // FCM 토큰 저장
    const saveFcmToken = async (token: string) => {
        setLoading(true);
        try {
            const fcmToken: FcmToken = { fcmToken: token };
            await saveFcmTokenApi(authFetch, fcmToken);
        } catch (err) {
            console.error('FCM 토큰 저장 중 오류:', err);
            toast.error('FCM 토큰 저장 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // FCM 토큰 삭제
    const deleteFcmToken = async () => {
        setLoading(true);
        try {
            await deleteFcmTokenApi(authFetch);
        } catch (err) {
            console.error('FCM 토큰 삭제 중 오류:', err);
            toast.error('FCM 토큰 삭제 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return { notifications, loading, fetchNotifications, readNotification, saveFcmToken, deleteFcmToken };
};
