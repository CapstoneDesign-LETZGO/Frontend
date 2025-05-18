import React, {useState, useEffect, RefObject} from 'react';
import { useNavigate } from 'react-router-dom';
import {useNotificationStore} from "../../../common/hooks/useNotificationStore.ts";

interface CommunityHeaderProps {
    scrollContainerRef: RefObject<HTMLDivElement | null>;
    setIsHeaderVisible: (visible: boolean) => void;
    isHeaderVisible: boolean;
}

const CommunityHeader: React.FC<CommunityHeaderProps>  = ({ scrollContainerRef, setIsHeaderVisible, isHeaderVisible }) => {
    const navigate = useNavigate();
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const notifications = useNotificationStore(state => state.notifications);

    const hasUnreadNotifications = notifications.some(notification => !notification.isRead);

    const handleScroll = () => {
        const el = scrollContainerRef.current;
        if (!el) return;

        const currentScrollTop = el.scrollTop;

        // 스크롤 방향에 따라 헤더의 visibility 조정
        if (currentScrollTop > lastScrollTop && currentScrollTop > 60) {
            // 아래로 스크롤 시 헤더 숨기기
            setIsHeaderVisible(false);
        } else {
            // 위로 스크롤 시 헤더 보이기
            setIsHeaderVisible(true);
        }

        setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop); // 스크롤 위치 업데이트
    };

    useEffect(() => {
        const el = scrollContainerRef?.current;
        if (!el) return;

        el.addEventListener('scroll', handleScroll);
        return () => {
            el.removeEventListener('scroll', handleScroll);
        };
    }, [scrollContainerRef?.current, lastScrollTop]);

    return (
        <header
            className={`flex justify-between items-center p-2 bg-white fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md mx-auto z-50 transition-transform duration-300 ${
                isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
            style={{ borderBottom: '0.1px solid #D1D5DB' }} // gray-300 컬러
        >
            <img src="/icons/logo/logo-simple.png" alt="App Logo" className="h-10 ml-2" />

            {/* 알람 아이콘과 send 아이콘을 한 줄에 배치 */}
            <div className="flex items-center space-x-7">
                <div onClick={() => navigate('/notification')} className="relative cursor-pointer">
                    <img
                        src="/icons/media/notification_line.svg"
                        alt="Notification"
                        className="h-6"
                    />
                    {hasUnreadNotifications && (
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                    )}
                </div>
                <img
                    src="/icons/contact/send_line.svg"
                    alt="Send Logo"
                    className="h-6 cursor-pointer mr-1"
                    onClick={() => navigate('/chat-room')}
                />
            </div>
        </header>
    );
};

export default CommunityHeader;
