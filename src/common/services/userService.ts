import { AxiosResponse } from 'axios';
import api from '../libs/api';

// 사용자 정보 타입 정의
interface UserInfo {
    id: number;
    name: string;
    nickName: string;
    profileImageUrl: string | null;
    followMemberCount: number;
    followedMemberCount: number;
}

export const getUserInfo = async (): Promise<AxiosResponse<{ returnCode: string; returnMessage: string; data: UserInfo }>> => {
    return api.get('/rest-api/v1/member'); // 사용자 정보 API 요청
};
