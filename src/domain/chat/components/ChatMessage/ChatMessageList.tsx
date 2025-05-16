import { ChatMessageDto, ChatRoomDto } from "../../../../common/interfaces/ChatInterface";
import { MemberDto } from "../../../../common/interfaces/MemberInterface.ts";

interface ChatMessageListProps {
    member: MemberDto;
    chatRoom: ChatRoomDto;
    messages: ChatMessageDto[];
    loading: boolean;
}

const ChatMessageList = ({ member, chatRoom, messages, loading }: ChatMessageListProps) => {
    const isMyMessage = (message: ChatMessageDto) => {
        return message.memberId === member.id;
    };

    const getSenderProfileImage = (message: ChatMessageDto) => {
        const sender = chatRoom.chatRoomMembers.find((m) => m.userId === message.memberId);
        return sender?.profileImageUrl || "src/assets/icons/user/user_4_line.svg";
    };

    return (
        <div className="flex flex-col gap-2 p-4 overflow-y-auto flex-1">
            {loading ? (
                <div className="text-center text-gray-500">메시지를 불러오는 중...</div>
            ) : (
                messages.map((message) => {
                    const mine = isMyMessage(message);
                    const showUnread = message.unreadCount > 0;

                    return (
                        <div
                            key={message.id}
                            className={`flex items-end gap-1 ${mine ? "justify-end" : "justify-start"}`}
                        >
                            {!mine && (
                                <img
                                    src={getSenderProfileImage(message)}
                                    alt="상대방 프로필"
                                    className="w-8 h-8 rounded-full mr-2"
                                />
                            )}

                            {mine && showUnread && (
                                <span className="text-xs text-gray-500 mb-1">{message.unreadCount}</span>
                            )}

                            <div
                                className={`px-4 py-2 rounded-2xl text-sm break-words max-w-xs ${
                                    mine
                                        ? "bg-sky-400 text-white self-end"
                                        : "bg-gray-200 text-gray-900 self-start"
                                }`}
                            >
                                {message.content}
                            </div>

                            {!mine && showUnread && (
                                <span className="text-xs text-gray-500 mb-1">{message.unreadCount}</span>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ChatMessageList;
