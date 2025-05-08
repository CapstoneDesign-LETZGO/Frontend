import { useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { fetchWithAuth } from '../services/authFetchService.ts';
import { ApiResponse } from '../interfaces/response/ApiResponse.ts';

export const useAuthFetch = () => {
    const [loading, setLoading] = useState(false);

    const authFetch = async <T>(
        url: string,
        options: AxiosRequestConfig = {},
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
    ): Promise<ApiResponse<T>> => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(url, { ...options, method });
            setLoading(false);
            if (response) {
                return response as ApiResponse<T>;  // 응답을 ApiResponse<T> 타입으로 반환
            }
            throw new Error('No response from server');
        } catch (error) {
            setLoading(false);
            throw error;  // 오류가 발생하면 throw
        }
    };

    return { authFetch, loading };
};
