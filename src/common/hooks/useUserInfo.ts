import { useState, useEffect } from 'react';
import { getUserInfo } from '../services/userService'; // 사용자 정보 요청 서비스

// 사용자 정보 타입 정의
interface UserInfo {
    id: number;
    name: string;
    nickName: string;
    profileImageUrl: string | null;
    followMemberCount: number;
    followedMemberCount: number;
}

export const useUserInfo = (setIsLoggedIn: (v: boolean) => void) => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // UserInfo 타입으로 변경
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            setLoading(true);
            try {
                const response = await getUserInfo(); // userService에서 사용자 정보 요청
                if (response.data.returnCode === 'SUCCESS') {
                    setUserInfo(response.data.data); // 사용자 정보 저장
                    setIsLoggedIn(true); // 로그인 상태 유지
                } else {
                    setError('사용자 정보를 가져오는 데 실패했습니다.');
                    setIsLoggedIn(false); // 로그인 상태 false로 설정 (로그아웃)
                }
                setLoading(false);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    // 'Error' 인스턴스인지 확인하여 안전하게 처리
                    console.error('사용자 정보를 가져오는 중 오류 발생:', err.message);
                    setError('사용자 정보를 가져오는 데 오류가 발생했습니다.');
                } else {
                    // 예기치 않은 오류 처리
                    console.error('알 수 없는 오류 발생');
                    setError('알 수 없는 오류가 발생했습니다.');
                }
                setIsLoggedIn(false); // 로그인 상태 false로 설정
                setLoading(false);
            }
        };
        fetchUserInfo();
    }, []); // 컴포넌트가 마운트될 때 한 번만 호출
    return { userInfo, loading, error };
};
