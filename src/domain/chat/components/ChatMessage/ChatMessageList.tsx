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
                messages.map((message, index) => {
                    const mine = isMyMessage(message);
                    const showUnread = message.unreadCount > 0;

                    const isLastFromSameSender =
                        !mine &&
                        (index === messages.length - 1 || isMyMessage(messages[index + 1]) || messages[index + 1].memberId !== message.memberId);

                    const isFirstMessageFromNewSender =
                        !mine &&
                        (index === 0 || messages[index - 1].memberId !== message.memberId);

                    return (
                        <div
                            key={message.id}
                            className={`flex ${mine ? "justify-end" : "justify-start"} w-full ${
                                isFirstMessageFromNewSender ? "mt-2" : "mt-0"
                            }`}
                        >
                            {/* 본인 메시지 */}
                            {mine ? (
                                <div className="flex items-end gap-1">
                                    {showUnread && (
                                        <span className="text-xs text-gray-500 mb-1">{message.unreadCount}</span>
                                    )}
                                    <div className="flex flex-col items-end gap-1">
                                        {message.content && (
                                            <div className="px-4 py-2 rounded-2xl text-sm break-words max-w-xs bg-sky-400 text-white">
                                                {message.content}
                                            </div>
                                        )}
                                        {message.imageUrls?.length > 0 && (
                                            <div className="flex flex-col gap-2">
                                                {message.imageUrls.map((url, index) => (
                                                    <img
                                                        key={index}
                                                        src={url}
                                                        alt={`image-${index}`}
                                                        className="w-40 h-auto rounded-xl"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // 상대방 메시지
                                <div className="flex items-end gap-1">
                                    {/* 프로필 이미지 (같은 사람의 마지막 메시지에만 표시) */}
                                    {isLastFromSameSender ? (
                                        <img
                                            src={getSenderProfileImage(message)}
                                            alt="상대방 프로필"
                                            className="w-8 h-8 rounded-full mr-1"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 mr-1" /> // 자리 확보용 빈 박스
                                    )}

                                    <div className="flex flex-col items-start gap-1">
                                        {message.content && (
                                            <div className="px-4 py-2 rounded-2xl text-sm break-words max-w-xs bg-gray-200 text-gray-900">
                                                {message.content}
                                            </div>
                                        )}
                                        {message.imageUrls?.length > 0 && (
                                            <div className="flex flex-col gap-2">
                                                {message.imageUrls.map((url, index) => (
                                                    <img
                                                        key={index}
                                                        src={url}
                                                        alt={`image-${index}`}
                                                        className="w-40 h-auto rounded-xl"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {showUnread && (
                                        <span className="text-xs text-gray-500 mb-1">{message.unreadCount}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ChatMessageList;
