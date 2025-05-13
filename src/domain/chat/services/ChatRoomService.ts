import {ChatRoomDto, ChatRoomForm } from "../../../common/interfaces/ChatInterface";
import { AuthFetch, isSuccess } from "../../../common/utils/fetchUtils";
import {ApiResponse} from "../../../common/interfaces/response/ApiResponse.ts";

// 채팅방 목록 조회
export const fetchChatRoomApi = async (
    authFetch: AuthFetch
): Promise<{ chatRooms: ChatRoomDto[]; success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<ChatRoomDto[]>>(
            '/rest-api/v1/chat-room', {},'GET'
        );
        console.log('Response Data:', response);
        if (isSuccess(response)) {
            const chatRooms = response?.letzgoPage?.contents as unknown as ChatRoomDto[] ?? [];
            return { chatRooms, success: true };
        } else {
            console.error("채팅방 목록 조회 실패:", response?.returnMessage);
            return { chatRooms: [], success: false };
        }
    } catch (err) {
        console.error("채팅방 목록 조회 중 오류:", err);
        return { chatRooms: [], success: false };
    }
};

// 채팅방 생성
export const createChatRoomApi = async (
    authFetch: AuthFetch,
    chatRoomForm: ChatRoomForm
): Promise<{ chatRoom: ChatRoomDto | null; success: boolean }> => {
    try {
        const response = await authFetch<ChatRoomDto>(
            '/rest-api/v1/chat-room',
            chatRoomForm as unknown as Record<string, unknown>,
            'POST'
        );
        console.log('Create Chat Room Response:', response);
        if (isSuccess(response)) {
            return { chatRoom: response.data ?? null, success: true };
        } else {
            console.error("채팅방 생성 실패:", response?.returnMessage);
            return { chatRoom: null, success: false };
        }
    } catch (err) {
        console.error('채팅방 생성 중 오류:', err);
        return { chatRoom: null, success: false };
    }
};

// 채팅방 이름 수정
export const updateChatRoomTitleApi = async (
    authFetch: AuthFetch,
    chatRoomId: number,
    chatRoomForm: Partial<ChatRoomForm>,
): Promise<boolean> => {
    try {
        const response = await authFetch<ApiResponse<string>>(
            `/rest-api/v1/chat-room/title/${chatRoomId}`,
            chatRoomForm as unknown as Record<string, unknown>,
            'PUT'
        );
        console.log('Update Chat Room Title Response:', response);
        return isSuccess(response);
    } catch (err) {
        console.error('채팅방 이름 수정 중 오류:', err);
        return false;
    }
};

// 채팅방에 초대
export const inviteChatRoomMemberApi = async (
    authFetch: AuthFetch,
    chatRoomId: number,
    chatRoomForm: ChatRoomForm
): Promise<boolean> => {
    try {
        const response = await authFetch<ApiResponse<string>>(
            `/rest-api/v1/chat-room/group/${chatRoomId}`,
            chatRoomForm as unknown as Record<string, unknown>,
            'PUT'
        );
        console.log('Invite Chat Room Member Response:', response);
        return isSuccess(response);
    } catch (err) {
        console.error('채팅방 초대 중 오류:', err);
        return false;
    }
};

// 방장 권한 위임
export const delegateChatRoomManagerApi = async (
    authFetch: AuthFetch,
    chatRoomId: number,
    chatRoomForm: ChatRoomForm
): Promise<boolean> => {
    try {
        const response = await authFetch<ApiResponse<string>>(
            `/rest-api/v1/chat-room/group/${chatRoomId}`,
            chatRoomForm as unknown as Record<string, unknown>,
            'POST'
        );
        console.log('Delegate Chat Room Manager Response:', response);
        return isSuccess(response);
    } catch (err) {
        console.error('방장 권한 위임 중 오류:', err);
        return false;
    }
};

// 채팅방에서 강퇴
export const kickOutChatRoomMemberApi = async (
    authFetch: AuthFetch,
    chatRoomId: number,
    chatRoomForm: ChatRoomForm
): Promise<boolean> => {
    try {
        const response = await authFetch<ApiResponse<string>>(
            `/rest-api/v1/chat-room/group/${chatRoomId}`,
            chatRoomForm as unknown as Record<string, unknown>,
            'DELETE'
        );
        console.log('Kick Out Chat Room Member Response:', response);
        return isSuccess(response);
    } catch (err) {
        console.error('채팅방 강퇴 중 오류:', err);
        return false;
    }
};

// 채팅방 나가기
export const leaveChatRoomApi = async (
    authFetch: AuthFetch,
    chatRoomId: number
): Promise<boolean> => {
    try {
        const response = await authFetch<ApiResponse<string>>(
            `/rest-api/v1/chat-room/${chatRoomId}`,
            {},
            'DELETE'
        );
        console.log('Leave Chat Room Response:', response);
        return isSuccess(response);
    } catch (err) {
        console.error('채팅방 나가기 중 오류:', err);
        return false;
    }
};
