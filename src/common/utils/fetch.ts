import { ApiResponse } from '../../common/interfaces/response/ApiResponse.ts';

export type AuthFetch = <T>(
    url: string,
    data?: Record<string, unknown> | FormData,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
) => Promise<ApiResponse<T>>;

// isSuccess 함수에서 response 타입을 명확히 지정
export const isSuccess = <T>(response: ApiResponse<T>): boolean => {
    return response?.returnCode === 'SUCCESS';
};
