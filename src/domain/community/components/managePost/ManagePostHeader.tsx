import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaceStore } from '../../../../common/libs/placeStore';
import { openDB } from 'idb';

const DB_NAME = 'ManagePostDB';
const STORE_NAME = 'posts';

async function clearPostData() {
    const db = await openDB(DB_NAME, 1);
    await db.delete(STORE_NAME, 'post');
}

const ManagePostHeader: React.FC = () => {
    const navigate = useNavigate();
    const { clearSelectedPlace } = usePlaceStore();

    const handleExit = async () => {
        await clearPostData();           // IndexedDB 데이터 삭제
        clearSelectedPlace();           // 선택된 장소 초기화
        navigate(-1);                   // 이전 페이지로 이동
    };

    return (
        <header
            className={`flex items-center p-4 bg-white fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md mx-auto z-50 transition-transform duration-300`}
        >
            {/* 닫기 아이콘 */}
            <div onClick={handleExit} className="cursor-pointer ml-2">
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
