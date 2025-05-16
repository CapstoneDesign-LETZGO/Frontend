import ChatMessageHeader from "../components/ChatMessage/ChatMessageHeader.tsx";
import ChatMessageInput from "../components/ChatMessage/ChatMessageInput.tsx";
import {useLocation} from "react-router-dom";
import ChatMessageList from "../components/ChatMessage/ChatMessageList.tsx";

const ChatMessage = () => {
    const location = useLocation();
    const { member, chatRoom } = location.state || {};

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
            <div className="flex flex-col w-full max-w-md min-h-screen relative bg-white">
                <div>
                    <ChatMessageHeader chatRoom={chatRoom} member={member} />
                    <div className={'pt-[50px]'}>
                        <ChatMessageList chatRoom={chatRoom} member={member} />
                    </div>
                    <ChatMessageInput member={member}/>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
