import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";

interface ChatRoomSearchProps {
    onSearchChange: (keyword: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

export interface ChatRoomSearchRef {
    focus: () => void;
}

const ChatRoomSearchBar = forwardRef<ChatRoomSearchRef, ChatRoomSearchProps>(
    ({ onSearchChange, onFocus, onBlur }, ref) => {
        const [search, setSearch] = useState('');
        const inputRef = useRef<HTMLInputElement>(null);

        useImperativeHandle(ref, () => ({
            focus: () => {
                inputRef.current?.focus();
            },
        }));

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setSearch(value);
            onSearchChange(value);
        };

        return (
            <header className="flex items-center p-4 bg-white w-full max-w-md mx-auto">
                <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 flex-1 relative">
                    <img
                        src="/src/assets/icons/file/search_line.svg"
                        alt="Search"
                        className="h-4 w-4"
                    />
                    {search === '' && (
                        <span className="ml-1 text-sm text-gray-500 pointer-events-none absolute left-9">
                            검색
                        </span>
                    )}
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={handleChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        className="absolute inset-0 w-full h-full bg-transparent pl-8 pr-2 outline-none text-sm text-gray-700"
                    />
                </div>
            </header>
        );
    }
);

export default ChatRoomSearchBar;
