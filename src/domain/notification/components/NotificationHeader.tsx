import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationHeader: React.FC = () => {
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

    return (
        <header
            className={`flex items-center p-4 bg-white fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md mx-auto z-50 transition-transform duration-300 ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            {/* 왼쪽 화살표 아이콘 */}
            <div onClick={() => navigate(-1)} className="cursor-pointer ml-2">
                <img src="/icons/arrow/left_line.svg" alt="Back" className="h-6" />
            </div>
            {/* 가운데 "알림" 텍스트 */}
            <div className="ml-6 font-semibold">
                알림
            </div>
            {/* 오른쪽 공간은 비워둠 (그룹 아이콘 없음) */}
            <div className="ml-auto mr-2" />
        </header>
    );
};

export default NotificationHeader;
