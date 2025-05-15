import React from 'react';
import ChatRoomHeader from '../components/ChatRoomHeader';
import ChatRoomSearch from '../components/ChatRoomSearch';
import { useChatRoom } from '../hooks/useChatRoom';
import ChatRoomCard from "../components/ChatRoomCard";
import {useMemberActions} from "../../account/member/hooks/useMemberActions.ts";

const ChatRoom: React.FC = () => {
    const {
        chatRooms,
        refetchChatRoom,
        createChatRoom,
        updateChatRoomTitle,
        leaveChatRoom
    } = useChatRoom();
    const { member } = useMemberActions();

    if (!member || !chatRooms) {
        return null;
    }

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
            <div className="flex flex-col w-full max-w-md min-h-screen relative bg-white">
                <div>
                    <ChatRoomHeader member={member} />
                    <ChatRoomSearch />
                    <ChatRoomCard
                        chatRooms={chatRooms}
                        refetchChatRoom={refetchChatRoom}
                        createChatRoom={createChatRoom}
                        updateChatRoomTitle={updateChatRoomTitle}
                        leaveChatRoom={leaveChatRoom}
                        member={member}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
