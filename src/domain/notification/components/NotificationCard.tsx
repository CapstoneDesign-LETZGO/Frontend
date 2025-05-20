import React from 'react';
import { NotificationDto } from '../../../common/interfaces/NotificationInterface.ts';
import {formatDate} from "../../../common/utils/formatDate.ts";

interface NotificationCardProps {
    notifications: NotificationDto[];
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notifications }) => {
    return (
        <div className="flex flex-col">
            {notifications.map((notification) => {
                return (
                    <div
                        key={notification.id}
                        className="w-full p-3 bg-white text-xs flex items-center space-x-3"
                    >
                        <img
                            src={notification.senderProfileUrl ?? '/icons/user/user_4_line.svg'}
                            alt="프로필"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="text-gray-800 flex flex-row">
                            <span>
                                <span className="font-semibold">
                                    {notification.senderNickname ?? '알 수 없음'}
                                </span>
                                {notification.content}
                            </span>
                            {notification.createdAt && (
                                <div className="flex items-center text-gray-500 text-[11px] mt-0.5 min-w-[60px] whitespace-nowrap">
                                    <span className="mx-1">·</span>
                                    <span>{formatDate(notification.createdAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default NotificationCard;
