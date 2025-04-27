import { AxiosRequestConfig, AxiosResponse } from 'axios';
import authApi from "../libs/authApi.ts";
import publicApi from "../libs/publicApi.ts";


export const fetchWithAuth = async (
    url: string,
    options: AxiosRequestConfig = {}
): Promise<AxiosResponse | null> => {
    const { method = 'GET', headers, ...restOptions } = options;
    const requestOptions: AxiosRequestConfig = {
        method,
        headers,
        ...restOptions
    };

    console.log('Sending request to:', url);
    const response: AxiosResponse = await authApi(url, requestOptions);  // 요청 보내기
    console.log('Response received:', response);

    return response;
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
