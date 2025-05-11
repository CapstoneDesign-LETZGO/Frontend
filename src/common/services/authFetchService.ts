import {AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import authApi from "../libs/authApi.ts";
import publicApi from "../libs/publicApi.ts";
import { ApiResponse } from '../interfaces/response/ApiResponse.ts';

// 인증 API 요청 함수 (자동 토큰 갱신 포함)
export const authFetch = async <T>(
    url: string,
    data: Record<string, unknown> = {},
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
): Promise<ApiResponse<T>> => {
    const userToken = JSON.parse(localStorage.getItem('userToken') || '{}');

    const config: AxiosRequestConfig = {
        method,
        url,
        headers: {
            'Authorization': `Bearer ${userToken.accessToken}`,
            'Content-Type': 'application/json',
        },
    };

    if (method === 'GET') {
        config.params = data;
    } else {
        config.data = data;
    }

    try {
        console.log(`[authFetch] ${method} ${url}`, data);
        const response: AxiosResponse = await authApi(config);
        console.log('[authFetch] Response:', response);

        if (response.data && response.data.returnCode) {
            return response.data as ApiResponse<T>;
        }
        throw new Error('Invalid response format');
    } catch (error: unknown) {
        console.error('[authFetch] Request failed:', error);

        // 타입 좁히기
        if (isAxiosError(error)) {
            // 401 Unauthorized -> 토큰 만료 감지
            if (error.response?.status === 401) {
                console.log('[authFetch] 401 오류 - 토큰 재발급 시도');
                const refreshed = await tryRefreshToken();
                if (refreshed) {
                    const newUserToken = JSON.parse(localStorage.getItem('userToken') || '{}');
                    config.headers!['Authorization'] = `Bearer ${newUserToken.accessToken}`;
                    try {
                        const retryResponse: AxiosResponse = await authApi(config);
                        if (retryResponse.data && retryResponse.data.returnCode) {
                            console.log('[authFetch] 재시도 성공');
                            return retryResponse.data as ApiResponse<T>;
                        }
                        throw new Error('Invalid response format after retry');
                    } catch (retryError) {
                        console.error('[authFetch] 재시도 실패:', retryError);
                        throw retryError;
                    }
                }
            }
        }
        throw error;
    }
};

// AxiosError 타입 가드
function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
}

// 토큰 재발급 함수
export const tryRefreshToken = async (): Promise<boolean> => {
    const userToken = JSON.parse(localStorage.getItem('userToken') || '{}');
    const refreshUrl = '/rest-api/v1/auth/refresh-token';
    try {
        const response = await publicApi.get(refreshUrl, {
            headers: {
                'Authorization': `Bearer ${userToken.refreshToken}`,
            }
        });
        if (response.status === 200) {
            const newTokens = response.data.data;
            localStorage.setItem('userToken', JSON.stringify({
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
            }));
            console.log('[authFetch] 토큰 재발급 성공');
            return true;
        }
    } catch (err) {
        console.error('[authFetch] 토큰 재발급 실패:', err);
    }
    return false;
};
