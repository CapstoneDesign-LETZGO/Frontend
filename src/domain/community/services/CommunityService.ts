import { ApiResponse } from "../../../common/interfaces/response/ApiResponse.ts";
import { DetailPostDto } from "../../../common/interfaces/CommunityInterface.ts";

// 본인/팔로우한 유저 게시글 조회
export const fetchPostApi = async (
    authFetch: <T>(
        url: string,
        data?: Record<string, unknown>,
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    ) => Promise<ApiResponse<T>>
): Promise<{ posts: DetailPostDto[]; success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<DetailPostDto>>(
            '/rest-api/v1/post/main', {}, 'GET'
        );
        console.log('Response Data:', response);
        const success = response?.returnCode === 'SUCCESS';
        if (success) {
            const posts = response?.letzgoPage?.contents as unknown as DetailPostDto[] ?? [];
            return { posts, success };
        } else {
            console.error("게시글 목록 조회 실패:", response?.returnMessage);
            return { posts: [], success };
        }
    } catch (err) {
        console.error("게시글 목록 조회 중 오류:", err);
        return { posts: [], success: false };
    }
};

// 게시글 좋아요
export const fetchLikeApi = async (
    authFetch: <T>(
        url: string,
        data?: Record<string, unknown>,
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    ) => Promise<ApiResponse<T>>,
    postId: number
): Promise<{ success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<null>>(
            `/rest-api/v1/post/like/${postId}`,
            {},
            'POST'
        );
        console.log('Like Response:', response);
        const success = response?.returnCode === 'SUCCESS';
        if (success) {
            return { success };
        } else {
            console.error("좋아요 처리 실패:", response?.returnMessage);
            return { success: false };
        }
    } catch (err) {
        console.error("좋아요 처리 중 오류:", err);
        return { success: false };
    }
};

// 게시글 좋아요 취소
export const cancelLikeApi = async (
    authFetch: <T>(
        url: string,
        data?: Record<string, unknown>,
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    ) => Promise<ApiResponse<T>>,
    postId: number
): Promise<{ success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<null>>(
            `/rest-api/v1/post/like/${postId}`,
            {},
            'DELETE'
        );
        console.log('Cancel Like Response:', response);
        const success = response?.returnCode === 'SUCCESS';
        if (success) {
            return { success };
        } else {
            console.error("좋아요 취소 실패:", response?.returnMessage);
            return { success: false };
        }
    } catch (err) {
        console.error("좋아요 취소 중 오류:", err);
        return { success: false };
    }
};

// 게시글 저장
export const fetchSaveApi = async (
    authFetch: <T>(
        url: string,
        data?: Record<string, unknown>,
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    ) => Promise<ApiResponse<T>>,
    postId: number
): Promise<{ success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<null>>(
            `/rest-api/v1/post/collection/${postId}`,
            {},
            'POST'
        );
        console.log('Save Response:', response);
        const success = response?.returnCode === 'SUCCESS';
        if (success) {
            return { success };
        } else {
            console.error("저장 처리 실패:", response?.returnMessage);
            return { success: false };
        }
    } catch (err) {
        console.error("저장 처리 중 오류:", err);
        return { success: false };
    }
};

// 게시글 저장 취소
export const cancelSaveApi = async (
    authFetch: <T>(
        url: string,
        data?: Record<string, unknown>,
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    ) => Promise<ApiResponse<T>>,
    postId: number
): Promise<{ success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<null>>(
            `/rest-api/v1/post/collection/${postId}`,
            {},
            'DELETE'
        );
        console.log('Cancel Save Response:', response);
        const success = response?.returnCode === 'SUCCESS';
        if (success) {
            return { success };
        } else {
            console.error("저장 취소 처리 실패:", response?.returnMessage);
            return { success: false };
        }
    } catch (err) {
        console.error("저장 취소 처리 중 오류:", err);
        return { success: false };
    }
};
