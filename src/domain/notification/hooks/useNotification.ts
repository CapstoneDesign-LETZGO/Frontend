import { useState } from 'react';
import { fetchNotificationsApi, readNotificationApi } from '../services/NotificationService.ts';
import { NotificationDto, NotificationForm } from '../../../common/interfaces/NotificationInterface.ts';
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

    return { notifications, loading, fetchNotifications, readNotification };
};
