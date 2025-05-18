import {createContext, useContext, useEffect, useRef, ReactNode, useState, useCallback} from "react";
import {ChatWebSocketPayload} from "../interfaces/ChatInterface.ts";

const WS_ROOM_URL = import.meta.env.VITE_CORE_WEBSOCKET_URL+"-room";

interface ChatRoomWebSocketContextType {
    ws: WebSocket | null;
    registerOnMessage: (callback: (payload: ChatWebSocketPayload) => void) => void;
}

const ChatRoomWebSocketContext = createContext<ChatRoomWebSocketContextType | undefined>(undefined);

interface Props {
    memberId: number;
    children: ReactNode;
}

export const ChatRoomWebSocketProvider = ({ memberId, children }: Props) => {
    const ws = useRef<WebSocket | null>(null);
    const pingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const messageHandlers = useRef<((payload: ChatWebSocketPayload) => void)[]>([]);

    const registerOnMessage = useCallback((callback: (payload: ChatWebSocketPayload) => void) => {
        messageHandlers.current.push(callback);
    }, []);

    const onMessageReceived = useCallback((event: MessageEvent) => {
        console.log("💬 WebSocket Message:", event.data);
        const data: ChatWebSocketPayload = JSON.parse(event.data);
        messageHandlers.current.forEach((handler) => handler(data));
    }, []);

    useEffect(() => {
        if (!memberId) return;
        const socketInstance = new WebSocket(`${WS_ROOM_URL}?memberId=${memberId}`);
        setSocket(socketInstance);
        ws.current = socketInstance;
        console.log("Connecting to:", `${WS_ROOM_URL}?memberId=${memberId}`);
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
        ws.current.onclose = () => {
            console.log("ChatRoom WebSocket disconnected");
        };
        ws.current.onerror = (e) => {
            console.error("ChatRoom WebSocket error", e);
        };

        return () => {
            if (pingInterval.current) {
                clearInterval(pingInterval.current);
            }
            ws.current?.close();
        };
    }, [memberId]);

    return (
        <ChatRoomWebSocketContext.Provider value={{ ws: socket, registerOnMessage }}>
            {children}
        </ChatRoomWebSocketContext.Provider>
    );
};

export const useChatRoomWebSocket = (): ChatRoomWebSocketContextType => {
    const context = useContext(ChatRoomWebSocketContext);
    if (context === undefined) {
        throw new Error("useChatRoomWebSocket must be used within a ChatRoomWebSocketProvider");
    }
    return context;
};
