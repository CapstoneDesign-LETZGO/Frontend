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
    const MAX_IMAGES = 5;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const handleSend = () => {
        if (!message.trim()) return;
        onSendMessage(message);
        setMessage('');
        inputRef.current?.focus();
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!message.trim()) return;
            onSendMessage(message);
            setMessage('');
            inputRef.current?.focus();
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const selectedFiles = Array.from(files);
        if (selectedFiles.length > MAX_IMAGES) {
            alert(`이미지는 최대 ${MAX_IMAGES}장까지만 선택할 수 있습니다.`);
        }

        const limitedFiles = selectedFiles.slice(0, MAX_IMAGES);
        onSendImageMessage(limitedFiles);

        // input 초기화 (같은 파일 다시 선택 가능)
        e.target.value = '';
    };

    return (
        <div
            className="flex items-center p-2 border-t border-gray-300 bg-white fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50"
            style={{ borderTop: '0.1px solid #D1D5DB' }}
        >
            <img
                src={member.profileImageUrl || "/icons/user/user_4_line.svg"}
                alt="User Profile"
                className="w-8 h-8 rounded-full ml-2 object-cover flex-shrink-0"
            />
            <input
                ref={inputRef}
                type="text"
                placeholder="메시지를 입력하세요..."
                value={message}
                onChange={handleInputChange}
                onKeyUp={handleKeyUp}
                className="flex-grow px-4 py-2 text-xs focus:outline-none mx-2"
            />
            {message && (
                <img
                    src="/icons/arrow/arrow_up_line.svg"
                    alt="Send Message"
                    className="w-6 h-6 mr-2 cursor-pointer flex-shrink-0"
                    onClick={handleSend}
                />
            )}
            <img
                src="/icons/file/pic_line.svg"
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
