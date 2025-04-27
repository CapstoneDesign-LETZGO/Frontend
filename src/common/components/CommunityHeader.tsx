import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CommunityHeader: React.FC = () => {
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

    return (
        <header
            className={`flex justify-between items-center p-4 bg-white fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md mx-auto z-50 transition-transform duration-300 ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            <img src="/src/assets/icons/logo/logo-simple.png" alt="App Logo" className="h-10" />

            {/* 알람 아이콘과 send 아이콘을 한 줄에 배치 */}
            <div className="flex items-center space-x-7">
                <div onClick={() => navigate('/notification')} className="cursor-pointer">
                    <img src="/src/assets/icons/media/notification_line.svg" alt="Notification" className="h-8" />
                </div>
                <img
                    src="/src/assets/icons/contact/send_line.svg"
                    alt="Send Logo"
                    className="h-8 cursor-pointer"
                    onClick={() => navigate('/chat-room')}
                />
            </div>
        </header>
    );
};

export default CommunityHeader;
