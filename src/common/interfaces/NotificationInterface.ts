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

// Notification.TargetObject가 enum 혹은 특정 타입일 텐데, 예시로 enum 타입 선언
export type NotificationTargetObject =
    | 'Comment'
    | 'Follow'
    | 'Post';

export interface NotificationForm {
    notificationIdList: number[];
}
