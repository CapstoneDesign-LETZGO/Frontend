import React, { useEffect, useState } from 'react';
import { NotificationDto } from '../../../common/interfaces/NotificationInterface.ts';
import { useMemberActions } from '../../account/member/hooks/useMemberActions.ts';
import { MemberDto } from '../../../common/interfaces/MemberInterface.ts';

interface NotificationCardProps {
    notifications: NotificationDto[];
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notifications }) => {
    const [senderProfiles, setSenderProfiles] = useState<{ [key: number]: MemberDto | null }>({});
    const { fetchOtherMember } = useMemberActions({}); // fetchOnly hook call

    useEffect(() => {
        const fetchSenders = async () => {
            const uniqueSenderIds = Array.from(new Set(notifications.map(n => n.senderId)));
            for (const senderId of uniqueSenderIds) {
                if (!(senderId in senderProfiles)) {
                    const member = await fetchOtherMember(senderId);
                    setSenderProfiles(prev => ({
                        ...prev,
                        [senderId]: member ?? null, // undefined일 경우 null로 설정
                    }));
                }
            }
        };
        fetchSenders();
    }, [notifications]);

    return (
        <div className="flex flex-col">
            {notifications.map((notification) => {
                const sender = senderProfiles[notification.senderId];
                return (
                    <div
                        key={notification.id}
                        className="w-full p-3 bg-white text-xs flex items-center space-x-3"
                    >
                        <img
                            src={sender?.profileImageUrl ?? '/icons/user/user_4_line.svg'}
                            alt="프로필"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-gray-800">
                            <span className="font-semibold">{sender?.nickname ?? '알 수 없음'}</span>{notification.content}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default NotificationCard;
