import {SimpleMember} from "./MemberInterface.ts";

export interface ChatRoomForm {
    title: string;
    chatRoomMembers: ChatRoomMember[];
}

export interface ChatRoomMember {
    member: { id: number };
}

export interface ChatRoomDto {
    id: number;
    memberId: number;
    title: string;
    chatRoomMembers: SimpleMember[];
    unreadCount: number;
    lastMessage: string;
    lastMessageCreatedAt: string;
    memberCount: number;
}

export interface ChatMessageDto {
    id: number;
    memberId: number;
    nickname: string;
    profileImageUrl: string;
    content: string;
    imageUrls: string[];
    unreadCount: number;
    createdAt: string;
}

export interface ChatWebSocketPayload {
    messageType: 'MESSAGE' | 'READ' | 'READALL';
    memberId?: number;
    chatRoomId: number;

    // MESSAGE일 때만 존재
    chatMessageDto?: ChatMessageDto;
    content?: string;
    lastMessageCreatedAt?: string;

    // READ일 때만 존재
    messageId?: number;

    // READALL일 때만 존재
    readMessageIdList?: number[];
}
