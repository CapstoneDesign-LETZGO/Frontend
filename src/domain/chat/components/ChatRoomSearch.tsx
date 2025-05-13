import React from "react";

const ChatRoomSearch = () => {
    const [search, setSearch] = React.useState('');

    return (
        <header
            className="flex items-center pt-[70px] p-4 bg-white w-full max-w-md mx-auto"
        >
            <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 flex-1 relative">
                {/* 돋보기 아이콘 */}
                <img
                    src="/src/assets/icons/file/search_line.svg"
                    alt="Search"
                    className="h-4 w-4"
                />

                {/* "검색" 텍스트 - 입력이 비어있을 때만 표시 */}
                {search === '' && (
                    <span className="ml-1 text-sm text-gray-500 pointer-events-none absolute left-9">
                        검색
                    </span>
                )}

                {/* 실제 입력창 (투명 텍스트로 겹쳐 입력됨) */}
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="absolute inset-0 w-full h-full bg-transparent pl-8 pr-2 outline-none text-sm text-gray-700"
                />
            </div>
        </header>
    );
};

export default ChatRoomSearch;
