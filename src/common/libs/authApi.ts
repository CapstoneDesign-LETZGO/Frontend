import axios from 'axios';
import { getToken } from "./getToken.ts";
import { tryRefreshToken } from "../services/authFetchService.ts";

const authApi = axios.create({
    baseURL: import.meta.env.VITE_CORE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 보내기 전에 토큰 자동으로 붙이기
authApi.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 수정: 401 오류를 캐치하고 토큰 갱신을 시도
authApi.interceptors.response.use(
    (response) => response,  // 정상적인 응답 처리
    async (error) => {
        if (error.response && error.response.status === 401) {
            // 401 오류 발생 시 토큰 갱신 시도
            console.log('AccessToken expired, attempting to refresh token...');
            const refreshed = await tryRefreshToken();
            if (refreshed) {
                console.log('Token refreshed successfully.');
                // 토큰 갱신 성공 시, 요청을 재시도
                return authApi(error.config); // 원래 요청 재시도
            } else {
                console.log('Token refresh failed. Logging out...');
                localStorage.removeItem('userToken'); // 로그아웃 처리
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default authApi;
