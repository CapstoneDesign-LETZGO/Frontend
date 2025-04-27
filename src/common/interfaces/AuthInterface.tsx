export interface UserInfo {
    id: number;
    name: string;
    nickName: string;
    profileImageUrl: string | null;
    followMemberCount: number;
    followedMemberCount: number;
}
