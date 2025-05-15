import React, { useState, useRef, useEffect } from 'react';
import { ChatRoomDto, ChatRoomForm } from '../../../../common/interfaces/ChatInterface.ts';
import { MemberDto } from "../../../../common/interfaces/MemberInterface.ts";
import {formatDate} from "../../../../common/utils/formatDate.ts";

interface ChatRoomCardProps {
    chatRooms: ChatRoomDto[];
    refetchChatRoom: () => void;
    updateChatRoomTitle: (chatRoomId: number, chatRoomForm: Partial<ChatRoomForm>) => Promise<void>;
    leaveChatRoom: (id: number) => void;
    member: MemberDto;
    onClickChatRoom: (chatRoomId: number) => void;
}

const ChatRoomCard: React.FC<ChatRoomCardProps> = ({
                                                       chatRooms,
                                                       refetchChatRoom,
                                                       updateChatRoomTitle,
                                                       leaveChatRoom,
                                                       member,
                                                       onClickChatRoom,
                                                   }) => {
    const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
    const [editRoomId, setEditRoomId] = useState<number | null>(null);
    const [editedTitle, setEditedTitle] = useState('');
    const menuRef = useRef<HTMLDivElement | null>(null);
    const wasMenuClosedByClickRef = useRef(false);

    // 메뉴 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuOpenId && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                wasMenuClosedByClickRef.current = true; // 이 클릭은 메뉴 닫기 용도임
                setMenuOpenId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpenId]);

    const startEditing = (roomId: number, currentTitle: string) => {
        setEditRoomId(roomId);
        setEditedTitle(currentTitle);
        setMenuOpenId(null);
    };

    const submitEdit = async (roomId: number) => {
        try {
            await updateChatRoomTitle(roomId, { title: editedTitle });
            setEditRoomId(null);
            await refetchChatRoom();  // refetch도 await 처리해서 완료 기다림
        } catch (error) {
            console.error("채팅방 제목 수정 실패:", error);
        }
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

                            {/* 채팅방 제목 및 메시지 클릭 시에만 이동 */}
                            <div
                                className="flex flex-col flex-1 cursor-pointer"
                                onClick={() => {
                                    if (wasMenuClosedByClickRef.current) {
                                        // 이번 클릭은 메뉴 닫기 용도였음 → 아무 것도 하지 마!
                                        wasMenuClosedByClickRef.current = false;
                                        return;
                                    }
                                    if (!isEditing) {
                                        onClickChatRoom(room.id);
                                    }
                                }}
                            >
                                {isEditing ? (
                                    <div className="flex items-center mt-1">
                                        <input
                                            type="text"
                                            value={editedTitle}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                setEditedTitle(e.target.value);
                                            }}
                                            className="text-xs border rounded px-2 py-1 w-full mr-2"
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="flex space-x-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    submitEdit(room.id);
                                                }}
                                                className="text-black text-xs px-2 py-2 rounded whitespace-nowrap min-w-fit hover:bg-gray-100"
                                            >
                                                저장
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditRoomId(null);
                                                }}
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

                            {/* 메뉴 아이콘 */}
                            <img
                                src="/src/assets/icons/system/more_2_line.svg"
                                alt="More"
                                className="w-5 h-5 mt-2 ml-2 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpenId((prev) => (prev === room.id ? null : room.id));
                                }}
                            />

                            {/* 메뉴 */}
                            {menuOpenId === room.id && (
                                <div
                                    ref={menuRef}
                                    className="absolute right-2 top-8 bg-white rounded shadow-lg z-10"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {isGroupChat && (
                                        <button
                                            className="flex items-center text-xs w-full text-left p-2 hover:bg-gray-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEditing(room.id, room.title);
                                            }}
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
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            setMenuOpenId(null);
                                            try {
                                                await leaveChatRoom(room.id);  // await 추가
                                                await refetchChatRoom();       // 완료 후 재호출
                                            } catch (error) {
                                                console.error("채팅방 나가기 실패:", error);
                                            }
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
