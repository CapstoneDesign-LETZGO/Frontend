import { useState } from 'react';
import { ApiResponse } from '../interfaces/response/ApiResponse.ts';
import { authFetch } from '../services/authFetchService.ts';

export const useAuthFetch = () => {
    const [loading, setLoading] = useState(false);

    const fetch = async <T>(
        url: string,
        data: Record<string, unknown> | FormData = {},
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
    ): Promise<ApiResponse<T>> => {
        setLoading(true);

        try {
            const response = await authFetch<T>(url, data, method);

            if (response.returnCode !== 'SUCCESS') {
                throw new Error(response.returnMessage || '요청 처리 실패');
            }

            return response;
        } catch (error) {
            console.error('[useAuthFetch] Error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { authFetch: fetch, loading };
};