import ChatMessageHeader from "../components/chatMessage/ChatMessageHeader.tsx";
import ChatMessageInput from "../components/chatMessage/ChatMessageInput.tsx";
import { useLocation } from "react-router-dom";
import ChatMessageList from "../components/chatMessage/ChatMessageList.tsx";
import { ChatMessageDto, ChatWebSocketPayload } from "../../../common/interfaces/ChatInterface.ts";
import { useCallback, useEffect, useRef, useState } from "react";
import { useChatMessage } from "../hooks/useChatMessage.ts";

const WS_URL = import.meta.env.VITE_CORE_WEBSOCKET_URL;

const ChatMessage = () => {
    const location = useLocation();
    const { member, chatRoom } = location.state || {};

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { messages: _fetchedMessages, fetchChatMessage, writeImageMessage, loading } = useChatMessage();
    const [combinedMessages, setCombinedMessages] = useState<ChatMessageDto[]>([]);
    const ws = useRef<WebSocket | null>(null);
    const pingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    const onMessageReceived = useCallback(
        (event: MessageEvent) => {
            console.log("💬 WebSocket Message:", event.data);
            const data: ChatWebSocketPayload = JSON.parse(event.data);

            // 메시지 수신
            if (data.messageType === "MESSAGE" && data.chatMessageDto) {
                const message = data.chatMessageDto;
                setCombinedMessages((prev) => [...prev, message]);

                if (message.memberId !== member.id) {
                    const readPayload: ChatWebSocketPayload = {
                        messageType: "READ",
                        chatRoomId: chatRoom.id,
                        memberId: member.id,
                        messageId: message.id,
                    };
                    ws.current?.send(JSON.stringify(readPayload));
                }
            }

            // 단일 메시지 읽음 처리
            if (data.messageType === "READ") {
                const { messageId } = data;
                if (typeof messageId !== "number") return;
                setCombinedMessages((prevMessages) => {
                    const index = prevMessages.findIndex((msg) => msg.id === messageId);
                    if (index === -1) return prevMessages;
                    const updated = [...prevMessages];
                    const target = updated[index];
                    updated[index] = {
                        ...target,
                        unreadCount: Math.max(0, target.unreadCount - 1),
                    };
                    return updated;
                });
            }

            // 다수 메시지 읽음 처리
            if (data.messageType === "READALL") {
                const readMessageIds: number[] | undefined = data.readMessageIdList;
                if (!Array.isArray(readMessageIds)) return;
                setCombinedMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        readMessageIds.includes(msg.id)
                            ? { ...msg, unreadCount: Math.max(0, msg.unreadCount - 1) }
                            : msg
                    )
                );
            }
        },
        [chatRoom?.id, member?.id]
    );

    useEffect(() => {
        if (!chatRoom || !member) return;

        fetchChatMessage(chatRoom.id).then((messages) => {
            // fetch 완료 후 초기 메시지 상태 세팅
            setCombinedMessages(
                [...messages].sort(
                    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                )
            );
        });

        ws.current = new WebSocket(`${WS_URL}?chatRoomId=${chatRoom.id}`);
        ws.current.onopen = () => {
            console.log("WebSocket connected");
            // Ping every 25 seconds
            pingInterval.current = setInterval(() => {
                if (ws.current?.readyState === WebSocket.OPEN) {
                    ws.current.send(JSON.stringify({ messageType: "PING" }));
                    console.log("Sent ping to keep connection alive");
                }
            }, 25000);
        };
        ws.current.onmessage = onMessageReceived;
        ws.current.onclose = () => console.log("WebSocket disconnected");
        ws.current.onerror = (error) => console.error("WebSocket error", error);

        return () => {
            if (pingInterval.current) {
                clearInterval(pingInterval.current);
            }
            ws.current?.close();
        };
    }, [chatRoom, member, onMessageReceived]);

    const sendMessage = (content: string) => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
            console.warn("WebSocket not connected");
            return;
        }
        const payload: ChatWebSocketPayload = {
            chatRoomId: chatRoom.id,
            messageType: "MESSAGE",
            chatMessageDto: {
                id: 0,
                memberId: member.id,
                nickname: member.nickname || "Unknown",
                profileImageUrl: member.profileImageUrl || "",
                content,
                imageUrls: [],
                unreadCount: 0,
                createdAt: "", // 서버에서 채워줌
            }
        };
        ws.current.send(JSON.stringify(payload));
    };

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
            <div className="flex flex-col w-full max-w-md min-h-screen relative bg-white">
                <ChatMessageHeader chatRoom={chatRoom} member={member} />
                <div className="pt-[50px] pb-[40px]">
                    <ChatMessageList
                        chatRoom={chatRoom}
                        member={member}
                        messages={combinedMessages}
                        loading={loading}
                    />
                </div>
                <ChatMessageInput
                    member={member}
                    onSendMessage={sendMessage}
                    onSendImageMessage={(files) => writeImageMessage(chatRoom.id, files)}
                />
            </div>
        </div>
    );
};

export default ChatMessage;
