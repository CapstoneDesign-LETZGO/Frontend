import { AxiosRequestConfig, AxiosResponse } from 'axios';
import authApi from "../libs/authApi.ts";
import publicApi from "../libs/publicApi.ts";
import { ApiResponse } from '../interfaces/response/ApiResponse.ts';

export const fetchWithAuth = async <T>(
    url: string,
    options: AxiosRequestConfig = {}
): Promise<ApiResponse<T> | null> => {
    const { method = 'GET', headers, ...restOptions } = options;
    const requestOptions: AxiosRequestConfig = {
        method,
        headers,
        ...restOptions
    };

    try {
        console.log('Sending request to:', url);
        // 기존의 authApi 호출을 그대로 유지
        const response: AxiosResponse = await authApi(url, requestOptions);  // 요청 보내기
        console.log('Response received:', response);

        // 응답 데이터에서 returnCode가 존재하는지 확인
        if (response.data && response.data.returnCode) {
            return response.data as ApiResponse<T>;
        }
        return null;
    } catch (error) {
        console.error('Request failed:', error);
        throw error;  // 실패한 요청에 대해 오류 던지기
    }
};

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
            return true;
        }
    } catch (err) {
        console.error('토큰 재발급 실패:', err);
    }
    return false;
};
