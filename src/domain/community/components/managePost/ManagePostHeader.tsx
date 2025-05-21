import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManagePostHeader: React.FC = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollTop, setLastScrollTop] = useState(0);

    const handleScroll = () => {
        const currentScrollTop = window.pageYOffset;

        if (currentScrollTop > lastScrollTop && currentScrollTop > 60) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }

        setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollTop]);

    return (
        <header
            className={`flex items-center p-4 bg-white fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md mx-auto z-50 transition-transform duration-300 ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            {/* 닫기 아이콘 */}
            <div onClick={() => navigate(-1)} className="cursor-pointer ml-2">
                <img src="/icons/system/close_line.svg" alt="Close" className="h-6" />
            </div>

            {/* 중앙 텍스트 */}
            <div className="ml-4 font-semibold text-base">
                새 게시글
            </div>
        </header>
    );
};

export default ManagePostHeader;
