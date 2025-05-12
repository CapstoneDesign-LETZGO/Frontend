import { useState } from 'react';
import { toast } from 'react-toastify';
import {
    fetchChatMessageApi,
    searchChatMessageApi,
    writeImageMessageApi,
    deleteChatMessageApi
} from '../services/ChatMessageService';
import { ChatMessageDto } from '../../../common/interfaces/ChatInterface';
import { useAuthFetch } from '../../../common/hooks/useAuthFetch';

export const useChatMessage = () => {
    const [messages, setMessages] = useState<ChatMessageDto[]>([]);
    const [loading, setLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    // 채팅방 이전 메시지 조회
    const fetchChatMessage = async (chatRoomId: number) => {
        setLoading(true);
        try {
            const { messages, success } = await fetchChatMessageApi(authFetch, chatRoomId);
            if (success) {
                setMessages(messages); // 이전 메시지 저장
            } else {
                setMessages([]); // 실패 시 빈 배열 반환
            }
        } catch (err) {
            console.error("채팅 메시지 조회 중 오류 발생:", err);
            toast.error("채팅 메시지 조회 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 채팅방 메시지 검색
    const searchChatMessage = async (chatRoomId: number, keyword: string) => {
        setLoading(true);
        try {
            const { messages, success } = await searchChatMessageApi(authFetch, chatRoomId, keyword);
            if (success) {
                setMessages(messages); // 검색 결과 메시지 저장
            } else {
                setMessages([]); // 실패 시 빈 배열 반환
            }
        } catch (err) {
            console.error("채팅 메시지 검색 중 오류 발생:", err);
            toast.error("채팅 메시지 검색 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 이미지 메시지 전송
    const writeImageMessage = async (chatRoomId: number, imageFiles: File[]) => {
        setLoading(true);
        try {
            await writeImageMessageApi(authFetch, chatRoomId, imageFiles);
        } catch (err) {
            console.error("이미지 메시지 전송 중 오류 발생:", err);
            toast.error("이미지 메시지 전송 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 메시지 삭제
    const deleteChatMessage = async (messageId: number) => {
        setLoading(true);
        try {
            await deleteChatMessageApi(authFetch, messageId);
        } catch (err) {
            console.error("메시지 삭제 중 오류 발생:", err);
            toast.error("메시지 삭제 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return {
        messages,
        loading,
        fetchChatMessage,
        searchChatMessage,
        writeImageMessage,
        deleteChatMessage
    };
};
