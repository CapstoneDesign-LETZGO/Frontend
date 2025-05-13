import { ChatMessageDto } from "../../../common/interfaces/ChatInterface";
import { AuthFetch, isSuccess } from "../../../common/utils/fetch.ts";
import { ApiResponse } from "../../../common/interfaces/response/ApiResponse.ts";

// 채팅방 이전 메시지 조회
export const fetchChatMessageApi = async (
    authFetch: AuthFetch,
    chatRoomId: number
): Promise<{ messages: ChatMessageDto[]; success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<ChatMessageDto[]>>(
            `/rest-api/v1/chat-room/message/${chatRoomId}`, {}, 'GET'
        );
        console.log('Fetch Chat Message Response:', response);
        if (isSuccess(response)) {
            const messages = response?.letzgoPage?.contents as unknown as ChatMessageDto[] ?? [];
            return { messages, success: true };
        } else {
            console.error("채팅 메시지 조회 실패:", response?.returnMessage);
            return { messages: [], success: false };
        }
    } catch (err) {
        console.error("채팅 메시지 조회 중 오류:", err);
        return { messages: [], success: false };
    }
};

// 채팅방 메시지 검색
export const searchChatMessageApi = async (
    authFetch: AuthFetch,
    chatRoomId: number,
    keyword: string
): Promise<{ messages: ChatMessageDto[]; success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<ChatMessageDto[]>>(
            `/rest-api/v1/chat-room/message/${chatRoomId}/search?keyword=${encodeURIComponent(keyword)}`,
            {},
            'GET'
        );
        console.log('Search Chat Message Response:', response);
        if (isSuccess(response)) {
            const messages = response?.letzgoPage?.contents as unknown as ChatMessageDto[] ?? [];
            return { messages, success: true };
        } else {
            console.error("채팅 메시지 검색 실패:", response?.returnMessage);
            return { messages: [], success: false };
        }
    } catch (err) {
        console.error("채팅 메시지 검색 중 오류:", err);
        return { messages: [], success: false };
    }
};

// 이미지 메시지 전송
export const writeImageMessageApi = async (
    authFetch: AuthFetch,
    chatRoomId: number,
    imageFiles: File[]
): Promise<boolean> => {
    try {
        const formData = new FormData();
        imageFiles.forEach(file => {
            formData.append('imageFile', file);
        });
        const response = await authFetch<ApiResponse<string>>(
            `/rest-api/v1/chat-room/message/image/${chatRoomId}`,
            formData,
            'POST'
        );
        console.log('Write Image Message Response:', response);
        return isSuccess(response);
    } catch (err) {
        console.error("이미지 메시지 전송 중 오류:", err);
        return false;
    }
};

// 메시지 삭제
export const deleteChatMessageApi = async (
    authFetch: AuthFetch,
    messageId: number
): Promise<boolean> => {
    try {
        const response = await authFetch<ApiResponse<string>>(
            `/rest-api/v1/chat-room/message/${messageId}`,
            {},
            'DELETE'
        );
        console.log('Delete Chat Message Response:', response);
        return isSuccess(response);
    } catch (err) {
        console.error("채팅 메시지 삭제 중 오류:", err);
        return false;
    }
};
