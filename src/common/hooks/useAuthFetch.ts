import { useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { fetchWithAuth } from '../services/authFetch';

export const useAuthFetch = (setIsLoggedIn: (v: boolean) => void) => {
    const [loading, setLoading] = useState(false);
    // 인증된 fetch 요청 함수
    const authFetch = async (url: string, options: AxiosRequestConfig = {}) => {  // AxiosRequestConfig으로 변경
        setLoading(true);
        const response = await fetchWithAuth(url, options, setIsLoggedIn);
        setLoading(false);
        return response;
    };
    return { authFetch, loading };
};
