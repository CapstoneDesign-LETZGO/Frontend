import api from '../libs/api'; // axios 인스턴스를 import
import { AxiosRequestConfig, AxiosResponse } from 'axios'; // AxiosRequestConfig, AxiosResponse import

export const fetchWithAuth = async (
    url: string,
    options: AxiosRequestConfig = {},  // axios 설정 객체 타입으로 변경
    setIsLoggedIn?: (v: boolean) => void
): Promise<AxiosResponse | null> => {  // 반환 타입을 AxiosResponse로 변경
    const userToken = JSON.parse(localStorage.getItem('userToken') || '{}');
    const config: AxiosRequestConfig = {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${userToken.accessToken}`,
        },
    };
    try {
        const response: AxiosResponse = await api(url, config);  // axios 응답 타입 지정
        if (response.status === 401) {
            // accessToken 만료 → refreshToken으로 재발급 시도
            const refreshed = await tryRefreshToken();
            if (refreshed) {
                // 재시도
                return fetchWithAuth(url, options, setIsLoggedIn);
            } else {
                // 재발급 실패 → 로그아웃 처리
                localStorage.removeItem('userToken');
                localStorage.removeItem('isLoggedIn');
                setIsLoggedIn?.(false);
                return null;
            }
        }
        return response;
    } catch (err) {
        console.error('요청 중 오류 발생:', err);
        return null;
    }
};

export const tryRefreshToken = async (): Promise<boolean> => {
    const userToken = JSON.parse(localStorage.getItem('userToken') || '{}');
    const refreshUrl = '/rest-api/v1/auth/refresh-token';  // 상대경로로 설정
    try {
        const response: AxiosResponse = await api.post(refreshUrl, {
            refreshToken: userToken.refreshToken,
        });
        if (response.status === 200) {
            const newTokens = response.data.data;

            localStorage.setItem('userToken', JSON.stringify({
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
            }));
            return true;
        }
    } catch (err) {
        console.error('토큰 재발급 실패:', err);
    }
    return false;
};
