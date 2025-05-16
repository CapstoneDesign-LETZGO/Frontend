import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {ChatRoomDto} from "../../../../common/interfaces/ChatInterface.ts";
import { MemberDto } from '../../../../common/interfaces/MemberInterface.ts';

interface ChatRoomHeaderProps {
    chatRoom: ChatRoomDto;
    member: MemberDto;
}

const ChatMessageHeader: React.FC<ChatRoomHeaderProps> = ({chatRoom, member}) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollTop, setLastScrollTop] = useState(0);

    const handleScroll = () => {
        const currentScrollTop = window.pageYOffset;

        // 스크롤 방향에 따라 헤더의 visibility 조정
        if (currentScrollTop > lastScrollTop && currentScrollTop > 60) {
            // 아래로 스크롤 시 헤더 숨기기
            setIsVisible(false);
        } else {
            // 위로 스크롤 시 헤더 보이기
            setIsVisible(true);
        }

        setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop); // 스크롤 위치 업데이트
    };

    useEffect(() => {
        // 컴포넌트가 마운트되면 스크롤 이벤트 리스너 추가
        window.addEventListener('scroll', handleScroll);
        return () => {
            // 컴포넌트가 언마운트되면 리스너 제거
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollTop]);

    // === 채팅방 제목 표시 로직 ===
    const isGroupChat = chatRoom.chatRoomMembers.length > 2;
    const otherMembers = chatRoom.chatRoomMembers.filter(m => m.userId !== member?.id);
    const otherMember = otherMembers[0];

    // 그룹 채팅일 때 표시할 이름
    const groupTitle = otherMembers.length > 0
        ? `${otherMembers[0].userName}님 외 ${otherMembers.length}명`
        : '알 수 없음';

    return (
        <header
            className={`flex items-center p-4 bg-white fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md mx-auto z-50 transition-transform duration-300 ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            {/* 왼쪽 화살표 아이콘 */}
            <div onClick={() => navigate(-1)} className="cursor-pointer ml-2">
                <img src="/src/assets/icons/arrow/left_line.svg" alt="Back" className="h-6" />
            </div>

            {/* 채팅방 제목 */}
            <div className="ml-4 font-semibold">
                {chatRoom.title?.trim()
                    ? chatRoom.title
                    : isGroupChat
                        ? groupTitle
                        : `${otherMember?.userName ?? '알 수 없음'}님`}
            </div>

            {/* 그룹 아이콘 */}
            <div className="cursor-pointer ml-auto mr-2">
                <img src="/src/assets/icons/editor/menu_line.svg" alt="Group" className="h-6" />
            </div>
        </header>
    );
};

export default ChatMessageHeader;
