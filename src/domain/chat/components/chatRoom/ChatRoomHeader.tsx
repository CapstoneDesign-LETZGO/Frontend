import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {MemberDto} from "../../../../common/interfaces/MemberInterface.ts";

interface ChatRoomHeaderProps {
    member: MemberDto;
    onInviteClick: () => void;
    onGroupIconClick?: () => void;
    showInvite: boolean;
    setShowInvite: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSearchActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatRoomHeader: React.FC<ChatRoomHeaderProps> = ({ member, onInviteClick, onGroupIconClick, showInvite, setShowInvite, setIsSearchActive }) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollTop, setLastScrollTop] = useState(0);

    const handleScroll = () => {
        const currentScrollTop = window.pageYOffset;
        setIsVisible(currentScrollTop <= lastScrollTop || currentScrollTop <= 60);
        setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollTop]);

    const handleGroupIconClick = () => {
        setShowInvite((prev) => {
            const next = !prev;
            if (next && onGroupIconClick) {
                onGroupIconClick(); // 검색바 포커스
            }
            return next;
        });
    };

    const handleBackClick = () => {
        if (showInvite) {
            // 새 그룹 채팅 상태에서 뒤로 가기 → 모드 종료
            setShowInvite(false);
            setIsSearchActive(false);
        } else {
            navigate(-1);
        }
    };

    const handleInviteConfirmClick = () => {
        onInviteClick(); // 실제 채팅방 생성
        setShowInvite(false); // 모드 종료
        setIsSearchActive(false);
    };

    return (
        <header
            className={`flex items-center p-4 bg-white fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md mx-auto z-50 transition-transform duration-300 ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            {/* 왼쪽 화살표 아이콘 */}
            <div onClick={handleBackClick} className="cursor-pointer ml-2">
                <img src="/icons/arrow/left_line.svg" alt="Back" className="h-6" />
            </div>

            {/* 사용자 닉네임 */}
            <div className="ml-4 font-semibold">
                {showInvite ? "새 그룹 채팅" : member?.nickname}
            </div>

            {/* 오른쪽: 그룹 아이콘 클릭 시 체크 버튼으로 변경 */}
            <div className="ml-auto mr-2">
                {showInvite ? (
                    <img
                        src="/icons/system/check_line.svg"
                        alt="Check"
                        className="h-6 cursor-pointer"
                        onClick={handleInviteConfirmClick}
                    />
                ) : (
                    <img
                        src="/icons/user/group_line.svg"
                        alt="Group"
                        className="h-6 cursor-pointer"
                        onClick={handleGroupIconClick}
                    />
                )}
            </div>
        </header>
    );
};

export default ChatRoomHeader;
