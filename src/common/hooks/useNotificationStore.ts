import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface NotificationDto {
    id: number;
    senderId: number;
    senderNickname: string;
    senderProfileUrl: string;
    receiverId: number;
    objectId: number;
    content: string;
    isRead: boolean;
    targetObject: NotificationTargetObject;
    createdAt: string;
}

export type NotificationTargetObject = 'Comment' | 'Follow' | 'Post';

interface NotificationStore {
    notifications: NotificationDto[];
    hasUnread: boolean;

    setNotifications: (data: NotificationDto[]) => void;
    addNotification: (newNotification: NotificationDto) => void;
    markAsRead: (ids: number[]) => void;
    clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
    devtools((set, get) => ({
        notifications: [],
        hasUnread: false,

        setNotifications: (data) => {
            set({
                notifications: data,
                hasUnread: data.some((n) => !n.isRead),
            });
        },

        addNotification: (newNotification) => {
            set((state) => ({
                notifications: [newNotification, ...state.notifications],
                hasUnread: true,
            }));
        },

        markAsRead: (ids) => {
            const updated = get().notifications.map((n) =>
                ids.includes(n.id) ? { ...n, isRead: true } : n
            );
            set({
                notifications: updated,
                hasUnread: updated.some((n) => !n.isRead),
            });
        },

        clearNotifications: () => {
            set({ notifications: [], hasUnread: false });
        },
    }))
);
