import React, { useRef, useState } from 'react';
import { MemberDto } from '../../../../common/interfaces/MemberInterface';

interface ChatMessageInputProps {
    member: MemberDto;
    onSendMessage: (message: string) => void;
    onSendImageMessage: (imageFiles: File[]) => void;
}

const ChatMessageInput: React.FC<ChatMessageInputProps> = ({member, onSendMessage, onSendImageMessage}) => {
    const [message, setMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const handleSend = () => {
        if (!message.trim()) return;
        onSendMessage(message);

        setMessage('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };


    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const imageFiles = Array.from(files).slice(0, 5); // 최대 5개 제한
        onSendImageMessage(imageFiles);

        // 초기화해서 같은 파일 다시 선택 가능하도록
        e.target.value = '';
    };

    return (
        <div
            className="flex items-center p-2 border-t border-gray-300 bg-white fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50"
            style={{ borderTop: '0.1px solid #D1D5DB' }}
        >
            <img
                src={member.profileImageUrl || "/src/assets/icons/user/user_4_line.svg"}
                alt="User Profile"
                className="w-8 h-8 rounded-full ml-2 object-cover flex-shrink-0"
            />
            <input
                ref={inputRef}
                type="text"
                placeholder="메시지를 입력하세요..."
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-grow px-4 py-2 text-xs focus:outline-none mx-2"
            />
            {message && (
                <img
                    src="/src/assets/icons/arrow/arrow_up_line.svg"
                    alt="Send Message"
                    className="w-6 h-6 mr-2 cursor-pointer flex-shrink-0"
                    onClick={handleSend}
                />
            )}
            <img
                src="/src/assets/icons/file/pic_line.svg"
                alt="Attach Image"
                className="w-6 h-6 mr-2 cursor-pointer flex-shrink-0"
                onClick={handleImageClick}
            />
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default ChatMessageInput;
