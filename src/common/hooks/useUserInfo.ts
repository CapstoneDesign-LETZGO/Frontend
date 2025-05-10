import { useState } from 'react';
import { useAuthFetch } from './useAuthFetch';
import { MemberDto } from '../interfaces/MemberInterface';
import {fetchUserInfoApi} from "../services/commonService.ts";
import {toast} from "react-toastify";

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState<MemberDto | null>(null);
    const [loading, setLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    // 본인 정보 조회
    const fetchUserInfo = async () => {
        setLoading(true);
        try {
            const { user, success } = await fetchUserInfoApi(authFetch);
            if (success) {
                setUserInfo(user);
            } else {
                return null;
            }
        } catch (err) {
            console.error("사용자 정보를 가져오는 중 오류 발생:", err);
            toast.error("사용자 정보를 가져오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return { fetchUserInfo, userInfo, loading };
};
