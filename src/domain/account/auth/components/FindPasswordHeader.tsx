import React from "react";
import { useNavigate } from "react-router-dom";

interface FindAccountHeaderProps {
    title?: string; // 기본값 "계정 찾기"
}

const FindAccountHeader: React.FC<FindAccountHeaderProps> = ({ title = "계정 찾기" }) => {
    const navigate = useNavigate();

    return (
        <header className="flex items-center p-4 bg-white fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md mx-auto z-50 shadow-sm">
            {/* 뒤로가기 버튼 */}
            <button onClick={() => navigate(-1)} className="cursor-pointer">
                <img
                    src="/src/assets/icons/arrow/left_line.svg"
                    alt="뒤로가기"
                    className="h-5 w-5"
                />
            </button>

            {/* 타이틀 */}
            <h1 className="flex-grow text-center text-base font-semibold text-gray-900">
                {title}
            </h1>

            <div className="w-5 h-5" />
        </header>
    );
};

export default FindAccountHeader;
