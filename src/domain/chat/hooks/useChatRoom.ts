import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
    createChatRoomApi,
    fetchChatRoomApi,
    updateChatRoomTitleApi,
    inviteChatRoomMemberApi,
    delegateChatRoomManagerApi,
    kickOutChatRoomMemberApi,
    leaveChatRoomApi
} from '../services/ChatRoomService';
import { ChatRoomDto, ChatRoomForm } from '../../../common/interfaces/ChatInterface';
import { useAuthFetch } from '../../../common/hooks/useAuthFetch';

export const useChatRoom = () => {
    const [chatRooms, setChatRooms] = useState<ChatRoomDto[] | null>(null);
    const [chatRoom, setChatRoom] = useState<ChatRoomDto | null>(null);
    const [loading, setLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    // 채팅방 목록 조회
    const fetchChatRoom = async () => {
        setLoading(true);
        try {
            const { chatRooms, success } = await fetchChatRoomApi(authFetch);
            if (success) {
                setChatRooms(chatRooms); // 채팅방 목록 저장
            } else {
                return null;
            }
        } catch (err) {
            console.error("채팅방 목록을 가져오는 중 오류 발생:", err);
            toast.error("채팅방 목록을 가져오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 채팅방 생성
    const createChatRoom = async (chatRoomForm: ChatRoomForm) => {
        setLoading(true);
        try {
            const { chatRoom, success } = await createChatRoomApi(authFetch, chatRoomForm);
            if (success) {
                setChatRoom(chatRoom); // 생성된 채팅방 정보 저장
            } else {
                return null;
            }
        } catch (err) {
            console.error('채팅방 생성 중 오류 발생:', err);
            toast.error('채팅방 생성 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 채팅방 이름 수정
    const updateChatRoomTitle = async (chatRoomId: number, chatRoomForm: Partial<ChatRoomForm>) => {
        setLoading(true);
        try {
            await updateChatRoomTitleApi(authFetch, chatRoomId, chatRoomForm);
        } catch (err) {
            console.error('채팅방 이름 수정 중 오류 발생:', err);
            toast.error('채팅방 이름 수정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 채팅방에 초대
    const inviteChatRoomMember = async (chatRoomId: number, chatRoomForm: ChatRoomForm) => {
        setLoading(true);
        try {
            await inviteChatRoomMemberApi(authFetch, chatRoomId, chatRoomForm);
        } catch (err) {
            console.error('채팅방 초대 중 오류 발생:', err);
            toast.error('채팅방 초대 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 방장 권한 위임
    const delegateChatRoomManager = async (chatRoomId: number, chatRoomForm: ChatRoomForm) => {
        setLoading(true);
        try {
            await delegateChatRoomManagerApi(authFetch, chatRoomId, chatRoomForm);
        } catch (err) {
            console.error('방장 권한 위임 중 오류 발생:', err);
            toast.error('방장 권한 위임 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 채팅방 멤버 강퇴
    const kickOutChatRoomMember = async (chatRoomId: number, chatRoomForm: ChatRoomForm) => {
        setLoading(true);
        try {
            await kickOutChatRoomMemberApi(authFetch, chatRoomId, chatRoomForm);
        } catch (err) {
            console.error('채팅방 강퇴 중 오류 발생:', err);
            toast.error('채팅방 강퇴 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 채팅방 나가기
    const leaveChatRoom = async (chatRoomId: number) => {
        setLoading(true);
        try {
            await leaveChatRoomApi(authFetch, chatRoomId);
        } catch (err) {
            console.error('채팅방 나가기 중 오류 발생:', err);
            toast.error('채팅방 나가기 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 초기 fetch (채팅방 목록 조회)
    useEffect(() => {
        fetchChatRoom();
    }, []);

    const refetchChatRoom = () => {
        fetchChatRoom();
    };

    return {
        refetchChatRoom,
        chatRoom,
        chatRooms,
        loading,
        createChatRoom,
        updateChatRoomTitle,
        inviteChatRoomMember,
        delegateChatRoomManager,
        kickOutChatRoomMember,
        leaveChatRoom
    };
};
