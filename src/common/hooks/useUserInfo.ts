import { useState, useEffect } from 'react';
import { useAuthFetch } from './useAuthFetch';
import { UserInfo } from '../interfaces/AuthInterface';

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { authFetch } = useAuthFetch();

    useEffect(() => {
        const fetchUserInfo = async () => {
            setLoading(true);
            try {
                const response = await authFetch('/rest-api/v1/member', {}, 'GET');
                if (response && response.data.returnCode === 'SUCCESS') {
                    setUserInfo(response.data.data);
                } else {
                    setError('사용자 정보를 가져오는 데 실패했습니다.');
                }
            } catch (err) {
                console.error('사용자 정보를 가져오는 중 오류 발생:', err);
                setError('사용자 정보를 가져오는 데 오류가 발생했습니다.');
            }
            setLoading(false);
        };
        fetchUserInfo();
    }, []);
    return { userInfo, loading, error };
};
