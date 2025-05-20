import { ApiResponse } from "../../../common/interfaces/response/ApiResponse.ts";
import {FcmToken, NotificationDto, NotificationForm} from "../../../common/interfaces/NotificationInterface.ts";
import { AuthFetch, isSuccess } from "../../../common/utils/fetch.ts";

// 알림 목록 조회
export const fetchNotificationsApi = async (
    authFetch: AuthFetch
): Promise<{ notifications: NotificationDto[]; success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<NotificationDto>>(
            `/rest-api/v1/notification`, {}, 'GET'
        );
        console.log('Fetch Notifications Response:', response);
        if (isSuccess(response)) {
            const notifications = response?.letzgoPage?.contents as unknown as NotificationDto[] ?? [];
            return { notifications, success: true };
        } else {
            console.error("알림 목록 조회 실패:", response?.returnMessage);
            return { notifications: [], success: false };
        }
    } catch (err) {
        console.error("알림 목록 조회 중 오류:", err);
        return { notifications: [], success: false };
    }
};

// 알림 읽음 처리
export const readNotificationApi = async (
    authFetch: AuthFetch,
    notificationForm: NotificationForm
): Promise<boolean> => {
    try {
        const response = await authFetch<ApiResponse<string>>(
            `/rest-api/v1/notification`,
            notificationForm as unknown as Record<string, unknown>,
            'PUT'
        );
        console.log('Read Notification Response:', response);
        return isSuccess(response);
    } catch (err) {
        console.error("알림 읽음 처리 중 오류:", err);
        return false;
    }
};

// FCM 토큰 저장
export const saveFcmTokenApi = async (
    authFetch: AuthFetch,
    fcmToken: FcmToken,
): Promise<boolean> => {
    try {
        const response = await authFetch<ApiResponse<string>>(
            `/rest-api/v1/fcm`,
            fcmToken as unknown as Record<string, unknown>,
            'POST'
        );
        console.log('Save FCM Token Response:', response);
        return isSuccess(response);
    } catch (err) {
        console.error("FCM 토큰 저장 중 오류:", err);
        return false;
    }
};

// FCM 토큰 삭제
export const deleteFcmTokenApi = async (
    authFetch: AuthFetch
): Promise<boolean> => {
    try {
        const response = await authFetch<ApiResponse<string>>(
            `/rest-api/v1/fcm`,
            {},
            'DELETE'
        );
        console.log('Delete FCM Token Response:', response);
        return isSuccess(response);
    } catch (err) {
        console.error("FCM 토큰 삭제 중 오류:", err);
        return false;
    }
};
