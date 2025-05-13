import React, { useState, useRef, useEffect } from 'react';
import { ChatRoomDto, ChatRoomForm } from '../../../common/interfaces/ChatInterface.ts';
import { MemberDto } from "../../../common/interfaces/MemberInterface.ts";

interface ChatRoomCardProps {
    chatRooms: ChatRoomDto[];
    refetchChatRoom: () => void;
    createChatRoom: (chatRoomForm: ChatRoomForm) => void;
    updateChatRoomTitle: (chatRoomId: number, chatRoomForm: Partial<ChatRoomForm>) => Promise<void>;
    leaveChatRoom: (id: number) => void;
    member: MemberDto;
}

const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);

    if (diffSec < 10) return '방금';
    if (diffSec < 60) return `${diffSec}초`;
    if (diffMin < 60) return `${diffMin}분`;
    if (diffHour < 24) return `${diffHour}시간`;
    if (diffDay < 7) return `${diffDay}일`;
    return `${diffWeek}주 전`;
};

const ChatRoomCard: React.FC<ChatRoomCardProps> = ({
                                                       chatRooms,
                                                       refetchChatRoom,
                                                       createChatRoom,
                                                       updateChatRoomTitle,
                                                       leaveChatRoom,
                                                       member
                                                   }) => {
    const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
    const [editRoomId, setEditRoomId] = useState<number | null>(null);
    const [editedTitle, setEditedTitle] = useState('');
    const menuRef = useRef<HTMLDivElement | null>(null);

    // 메뉴 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpenId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const startEditing = (roomId: number, currentTitle: string) => {
        setEditRoomId(roomId);
        setEditedTitle(currentTitle);
        setMenuOpenId(null);
    };

    const submitEdit = async (roomId: number) => {
        await updateChatRoomTitle(roomId, { title: editedTitle });
        setEditRoomId(null);
        refetchChatRoom();
    };

    return (
        <div>
            {chatRooms.map((room) => {
                const otherMember = room.chatRoomMembers.find(
                    (simpleMember) => simpleMember.userId !== member.id
                );
                const isGroupChat = room.chatRoomMembers.length >= 3;
                const isEditing = editRoomId === room.id;

                return (
                    <div
                        key={room.id}
                        className="w-full p-3 bg-white text-sm relative"
                    >
                        <div className="flex items-start mb-2 relative">
                            <img
                                src={otherMember?.profileImageUrl || '/src/assets/icons/user/user_4_line.svg'}
                                alt="Profile"
                                className="w-8 h-8 rounded-full mr-3 ml-1 mt-[2px]"
                            />
                            <div className="flex flex-col flex-1">
                                {isEditing ? (
                                    <div className="flex items-center mt-1">
                                        <input
                                            type="text"
                                            value={editedTitle}
                                            onChange={(e) => setEditedTitle(e.target.value)}
                                            className="text-xs border rounded px-2 py-1 w-full mr-2"
                                            autoFocus
                                        />
                                        <div className="flex space-x-0">
                                            <button
                                                onClick={() => submitEdit(room.id)}
                                                className="text-black text-xs px-2 py-2 rounded whitespace-nowrap min-w-fit hover:bg-gray-100"
                                            >
                                                저장
                                            </button>
                                            <button
                                                onClick={() => setEditRoomId(null)}
                                                className="text-black text-xs px-2 py-2 rounded whitespace-nowrap min-w-fit hover:bg-gray-100"
                                            >
                                                취소
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <span className="font-semibold text-xs mb-[2px]">
                                            {room.title?.trim()
                                                ? room.title
                                                : isGroupChat
                                                    ? (() => {
                                                        const otherMembers = room.chatRoomMembers.filter(
                                                            (simpleMember) => simpleMember.userId !== member.id
                                                        );
                                                        const displayName = otherMembers[0]?.userName ?? '알 수 없음';
                                                        const extraCount = otherMembers.length;
                                                        return `${displayName}님 외 ${extraCount}명`;
                                                    })()
                                                    : `${otherMember?.userName ?? '알 수 없음'}님`}
                                        </span>

                                        <div className="flex items-center text-xs text-gray-500">
                                            <p className="truncate max-w-full">{room.lastMessage}</p>
                                            {room.lastMessage && room.lastMessageCreatedAt && (
                                                <>
                                                    <span className="mx-1">·</span>
                                                    <span className="whitespace-nowrap">
                                                        {formatDate(room.lastMessageCreatedAt)}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            <img
                                src="/src/assets/icons/system/more_2_line.svg"
                                alt="More"
                                className="w-5 h-5 mt-2 ml-2 cursor-pointer"
                                onClick={() =>
                                    setMenuOpenId((prev) => (prev === room.id ? null : room.id))
                                }
                            />

                            {menuOpenId === room.id && (
                                <div
                                    ref={menuRef}
                                    className="absolute right-2 top-8 bg-white rounded shadow-lg z-10"
                                >
                                    {isGroupChat && (
                                        <button
                                            className="flex items-center text-xs w-full text-left p-2 hover:bg-gray-100"
                                            onClick={() => startEditing(room.id, room.title)}
                                        >
                                            <img
                                                src="/src/assets/icons/editor/edit_line.svg"
                                                alt="Edit"
                                                className="w-4 h-4 mr-1"
                                            />
                                            수정
                                        </button>
                                    )}
                                    <button
                                        className="flex items-center text-xs w-full text-left p-2 hover:bg-gray-100"
                                        onClick={() => {
                                            setMenuOpenId(null);
                                            leaveChatRoom(room.id);
                                            refetchChatRoom();
                                        }}
                                    >
                                        <img
                                            src="/src/assets/icons/system/exit_line.svg"
                                            alt="Exit"
                                            className="w-4 h-4 mr-1"
                                        />
                                        나가기
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChatRoomCard;
