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

export type NotificationTargetObject =
    | 'Comment'
    | 'Follow'
    | 'Post';

export interface NotificationForm {
    notificationIdList: number[];
}
