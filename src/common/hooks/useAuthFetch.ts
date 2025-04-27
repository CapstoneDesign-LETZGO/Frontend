import { useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { fetchWithAuth } from '../services/authFetchService.ts';

export const useAuthFetch = () => {
    const [loading, setLoading] = useState(false);

    const authFetch = async (
        url: string,
        options: AxiosRequestConfig = {},
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'  // 기본 HTTP 메서드는 'GET'
    ) => {
        setLoading(true);
        const response = await fetchWithAuth(url, { ...options, method });  // 옵션에 메서드 추가
        setLoading(false);
        return response;
    };

    return { authFetch, loading };
};
