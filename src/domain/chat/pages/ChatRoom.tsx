import React, {useEffect, useRef, useState} from 'react';
import { useChatRoom } from '../hooks/useChatRoom';
import { MemberDto } from '../../../common/interfaces/MemberInterface.ts';
import { useNavigate } from 'react-router-dom';
import {ChatRoomDto, ChatRoomForm, ChatWebSocketPayload} from "../../../common/interfaces/ChatInterface.ts";
import { useDebounce } from '../../../common/hooks/useDebounce.ts';
import ChatRoomSearchBar from '../components/ChatRoom/ChatRoomSearchBar.tsx';
import ChatRoomCard from '../components/ChatRoom/ChatRoomCard.tsx';
import SearchResultCard from "../components/ChatRoom/SearchResultCard.tsx";
import ChatRoomHeader from "../components/ChatRoom/ChatRoomHeader.tsx";
import {useChatRoomWebSocket} from "../../../common/hooks/ChatRoomWebSocketContext.tsx";

interface ChatRoomProps {
    member: MemberDto;
    searchMember: (searchTerm: string) => Promise<MemberDto[]>;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ member, searchMember }) => {
    const {
        chatRooms,
        setChatRooms,
        refetchChatRoom,
        createChatRoom,
        updateChatRoomTitle,
        leaveChatRoom
    } = useChatRoom();
    const { registerOnMessage } = useChatRoomWebSocket();
    const [searchResults, setSearchResults] = useState<MemberDto[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [showInvite, setShowInvite] = useState(false);
    const [chatRoomTitle, setChatRoomTitle] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const navigate = useNavigate();
    const searchBarRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMessage = (data: ChatWebSocketPayload) => {
            if (data.messageType === "MESSAGE") {
                const roomId = data.chatRoomId;
                const messageContent = data.content ?? "";
                setChatRooms((prevRooms) => {
                    if (!prevRooms) return prevRooms;
                    return prevRooms.map((room) =>
                        room.id === roomId
                            ? { ...room, lastMessage: messageContent }
                            : room
                    );
                });
            }
        };
        registerOnMessage(handleMessage);
    }, [registerOnMessage]);

    useEffect(() => {
        // 조건: 포커스 상태이고, debounce된 검색어가 비어있지 않을 때만 실행
        if (!isSearchActive || debouncedSearchTerm.trim() === '') return;
        const fetchResults = async () => {
            console.log('[Effect Triggered] isSearchActive:', isSearchActive, 'isFocused:', isFocused, 'debouncedSearchTerm:', debouncedSearchTerm);
            const res = await searchMember(debouncedSearchTerm);
            if (res) setSearchResults(res);
        };
        fetchResults();
    }, [debouncedSearchTerm, isSearchActive]);

    // 클릭이 Search 영역 밖에서 일어났는지 확인
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                if (!showInvite) {
                    setIsFocused(false);
                    setIsSearchActive(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showInvite]);

    const handleToggleMember = (memberId: number) => {
        setSelectedMembers((prev) =>
            prev.includes(memberId)
                ? prev.filter((id) => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleSingleChatCreate = async (memberId: number) => {
        const chatRoomForm: ChatRoomForm = {
            title: '',
            chatRoomMembers: [{ member: { id: memberId } }]
        };
        try {
            const { chatRoom, success } = await createChatRoom(chatRoomForm);
            if (success && chatRoom?.id) {
                setIsSearchActive(false);
                setIsFocused(false);
                setShowInvite(false);
                navigate('/chat-message', {
                    state: { member, chatRoom }
                });
            }
        } catch (error) {
            console.error('채팅방 생성 실패:', error);
        }
    };

    const handleInviteMembers = async () => {
        if (selectedMembers.length === 0) return;
        const chatRoomForm: ChatRoomForm = {
            title: chatRoomTitle.trim(), // 제목 반영
            chatRoomMembers: selectedMembers.map((id) => ({
                member: { id }
            }))
        };
        try {
            const { chatRoom, success } = await createChatRoom(chatRoomForm);
            if (success && chatRoom?.id) {
                setChatRoomTitle(''); // 생성 후 초기화
                navigate('/chat-message', {
                    state: { member, chatRoom }
                });
            }
        } catch (error) {
            console.error('채팅방 생성 실패:', error);
        }
    };

    const handleChatEnter = (chatRoom: ChatRoomDto) => {
        navigate('/chat-message', {
            state: { member, chatRoom }
        });
    };

    // 헤더 그룹 아이콘 클릭 시 검색바에 포커스
    const handleHeaderGroupClick = () => {
        setIsFocused(true);
        setIsSearchActive(true);
        // search bar input에 포커스
        searchBarRef.current?.focus();
    };

    if (!member || !chatRooms) return null;

    const showSearchResults = searchTerm.trim() !== '' && searchResults.length > 0;

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
            <div className="flex flex-col w-full max-w-md min-h-screen relative bg-white">
                <div ref={containerRef}>
                    <ChatRoomHeader
                        member={member}
                        onInviteClick={handleInviteMembers}
                        onGroupIconClick={handleHeaderGroupClick}
                        showInvite={showInvite}
                        setShowInvite={setShowInvite}
                        setIsSearchActive={setIsSearchActive}
                    />
                    {showInvite && (
                        <div className="flex items-center pt-[70px] p-4 bg-white">
                            <input
                                type="text"
                                placeholder="그룹 이름(선택)"
                                value={chatRoomTitle}
                                onChange={(e) => setChatRoomTitle(e.target.value)}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none"
                            />
                        </div>
                    )}
                    <div className={`${showInvite ? '-mt-5' : 'pt-[50px]'}`}>
                        <ChatRoomSearchBar
                            ref={searchBarRef}
                            onSearchChange={setSearchTerm}
                            onFocus={() => {
                                setIsFocused(true);
                                setIsSearchActive(true);
                            }}
                        />
                    </div>
                    <div className="flex-grow">
                        {isSearchActive ? (
                            debouncedSearchTerm.trim() === '' ? null : (
                                showSearchResults ? (
                                    <SearchResultCard
                                        results={searchResults}
                                        selectedMemberIds={selectedMembers}
                                        onToggleMember={handleToggleMember}
                                        onMemberClick={handleSingleChatCreate}
                                        showCheckboxes={showInvite}
                                    />
                                ) : null
                            )
                        ) : (
                            <ChatRoomCard
                                chatRooms={chatRooms}
                                refetchChatRoom={refetchChatRoom}
                                updateChatRoomTitle={updateChatRoomTitle}
                                leaveChatRoom={leaveChatRoom}
                                member={member}
                                onClickChatRoom={handleChatEnter}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
