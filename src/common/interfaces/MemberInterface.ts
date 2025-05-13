export interface MemberForm {
    name: string;
    nickname: string;
    phone: string | null;
    email: string;
    password: string;
    gender: 'MALE' | 'FEMALE';
    birthday: string;
}

export interface MemberDto {
    id: number;
    name: string;
    nickname: string;
    profileImageUrl: string | null;
    followMemberCount: number;
    followedMemberCount: number;
}

export interface DetailMemberDto {
    id: number;
    name: string;
    nickname: string;
    phone: string | null;
    email: string;
    password: string;
    gender: 'MALE' | 'FEMALE'; // Enum 값 매핑
    birthday: string; // ISO 형식
    profileImageUrl: string | null;
    followMemberCount: number;
    followedMemberCount: number;
    followList: SimpleMember[];
    followedList: SimpleMember[];
    followReqList: SimpleMember[];
    followRecList: SimpleMember[];
}

export interface SimpleMember {
    userId: number;
    userName: string;
    userNickname: string;
    profileImageUrl: string | null;
}
