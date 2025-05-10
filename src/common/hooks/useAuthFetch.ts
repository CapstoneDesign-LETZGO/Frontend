import { useState } from 'react';
import { ApiResponse } from '../interfaces/response/ApiResponse.ts';
import { authFetch } from '../services/authFetchService.ts';

export const useAuthFetch = () => {
    const [loading, setLoading] = useState(false);

    const fetch = async <T>(
        url: string,
        data: Record<string, unknown> = {},
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
    ): Promise<ApiResponse<T>> => {
        setLoading(true);

        const response = await authFetch<T>(url, data, method);
        return response as ApiResponse<T>;
    };

    return { authFetch: fetch, loading };
};
