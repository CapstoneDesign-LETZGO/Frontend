import ChatMessageHeader from "../components/ChatMessage/ChatMessageHeader.tsx";
import ChatMessageInput from "../components/ChatMessage/ChatMessageInput.tsx";

const ChatMessage = () => {
    return (
        <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
            <div className="flex flex-col w-full max-w-md min-h-screen relative bg-white">
                <div>
                    <ChatMessageHeader />
                    <ChatMessageInput />
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
