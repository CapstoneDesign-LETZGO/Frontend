import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMemberActions } from '../../account/member/hooks/useMemberActions';

const ChatRoomHeader: React.FC = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const { memberInfo } = useMemberActions(); // 사용자 정보 가져오기

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

            {/* 사용자 닉네임 */}
            <div className="ml-4 font-semibold">
                {memberInfo?.nickname || 'Unknown User'}
            </div>

            {/* 그룹 아이콘 */}
            <div onClick={() => navigate('/group-chat')} className="cursor-pointer ml-auto mr-2">
                <img src="/src/assets/icons/editor/menu_line.svg.svg" alt="Group" className="h-6" />
            </div>
        </header>
    );
};

export default ChatRoomHeader;
