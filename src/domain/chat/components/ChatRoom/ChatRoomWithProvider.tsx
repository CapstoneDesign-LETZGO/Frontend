import React from 'react';
import { useMemberActions } from '../../../account/member/hooks/useMemberActions';
import {ChatRoomWebSocketProvider} from "../../../../common/hooks/ChatRoomWebSocketContext.tsx";
import ChatRoom from "../../pages/ChatRoom.tsx";
import {MemberDto} from "../../../../common/interfaces/MemberInterface.ts";

const ChatRoomWithProvider: React.FC = () => {
    const { member, searchMember } = useMemberActions();

    if (!member) return null;

    const safeSearchMember = async (searchTerm: string): Promise<MemberDto[]> => {
        const result = await searchMember(searchTerm);
        return result ?? []; // null이나 undefined이면 빈 배열 반환
    };

    return (
        <ChatRoomWebSocketProvider memberId={member.id}>
            <ChatRoom member={member} searchMember={safeSearchMember} />
        </ChatRoomWebSocketProvider>
    );
};

export default ChatRoomWithProvider;
